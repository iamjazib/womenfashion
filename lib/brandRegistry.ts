import fs from "fs";
import path from "path";
import os from "os";
import { BrandRegistration, Brand } from "@/types";

const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "brand-registrations.json");
const TMP_REGISTRATIONS_FILE = path.join(os.tmpdir(), "brand-registrations.json");
const TMP_DELETED_FILE = path.join(os.tmpdir(), "brand-registrations-deleted.json");
const BRANDS_FILE = path.join(process.cwd(), "data", "brands.ts");

const CORE_BRAND_IDS = new Set([
  "gulahmed",
  "limelight",
  "baroque",
  "asimjofa",
  "sanasafinaz",
  "j.",
  "alkaram",
  "zellbury",
  "nishat",
  "sapphire",
]);

let memoryRegistrations: BrandRegistration[] | null = null;
let memoryDeletedIds: Set<string> = new Set();

function loadDeletedIds(): Set<string> {
  try {
    if (fs.existsSync(TMP_DELETED_FILE)) {
      const content = fs.readFileSync(TMP_DELETED_FILE, "utf8");
      const list = JSON.parse(content || "[]");
      if (Array.isArray(list)) {
        list.forEach((id: string) => memoryDeletedIds.add(id));
      }
    }
  } catch {}
  return memoryDeletedIds;
}

function saveDeletedIds() {
  try {
    fs.writeFileSync(TMP_DELETED_FILE, JSON.stringify(Array.from(memoryDeletedIds)), "utf8");
  } catch {}
}

/**
 * Retrieve all registered brand applications
 */
export function getBrandRegistrations(): BrandRegistration[] {
  loadDeletedIds();

  if (memoryRegistrations !== null) {
    return memoryRegistrations.filter((r) => !memoryDeletedIds.has(r.id));
  }

  // 1. Check TMP file (writable in serverless)
  try {
    if (fs.existsSync(TMP_REGISTRATIONS_FILE)) {
      const content = fs.readFileSync(TMP_REGISTRATIONS_FILE, "utf8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed)) {
        memoryRegistrations = parsed;
        return memoryRegistrations.filter((r) => !memoryDeletedIds.has(r.id));
      }
    }
  } catch {}

  // 2. Check local data/brand-registrations.json
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const content = fs.readFileSync(REGISTRATIONS_FILE, "utf8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed)) {
        memoryRegistrations = parsed;
        return memoryRegistrations.filter((r) => !memoryDeletedIds.has(r.id));
      }
    }
  } catch (error) {
    console.warn("Could not read brand-registrations from disk, using memory store:", error);
  }

  memoryRegistrations = [];
  return [];
}

/**
 * Sync an approved/live brand into data/brands.ts so it immediately activates across the website
 */
function syncBrandToBrandsFile(reg: BrandRegistration, action: "add" | "remove") {
  try {
    if (!fs.existsSync(BRANDS_FILE)) return;
    const content = fs.readFileSync(BRANDS_FILE, "utf8");

    // Extract domain safely
    let domain = "brand.pk";
    try {
      domain = new URL(reg.website).hostname.replace(/^www\./, "");
    } catch {
      domain = reg.slug + ".com";
    }

    if (action === "add") {
      // Check if brand is already present in brands.ts
      if (content.includes(`slug: "${reg.slug}"`) || content.includes(`id: "${reg.slug}"`)) {
        return;
      }

      const newBrandEntry = `  {
    id: "${reg.slug}",
    name: "${reg.brandName.replace(/"/g, '\\"')}",
    slug: "${reg.slug}",
    logo: "${reg.logoUrl || '/logos/gul-ahmed.svg'}",
    website: "${reg.website}",
    shopifyDomain: "${domain}",
    saleUrl: "${reg.saleUrl}",
    primaryColor: "#E11D48",
    active: true,
    totalDeals: 0,
  },
];`;

      // Trim any trailing comma and bracket cleanly
      const cleanContent = content.replace(/,?\s*\];\s*$/, "");
      const updatedContent = `${cleanContent},\n${newBrandEntry}\n`;
      fs.writeFileSync(BRANDS_FILE, updatedContent, "utf8");
    } else if (action === "remove") {
      // Never remove core fashion labels
      if (CORE_BRAND_IDS.has(reg.slug)) return;

      // Remove the custom brand block if present
      const regex = new RegExp(
        `\\s*,?\\s*\\{\\s*id:\\s*"${reg.slug}"[\\s\\S]*?\\}\\s*,?`,
        "g"
      );
      if (regex.test(content)) {
        let updatedContent = content.replace(regex, "");
        // Clean up any double commas or syntax artifacts before ];
        updatedContent = updatedContent
          .replace(/,\s*,/g, ",")
          .replace(/,\s*\];/g, ",\n];")
          .replace(/\[\s*,/g, "[");
        fs.writeFileSync(BRANDS_FILE, updatedContent, "utf8");
      }
    }
  } catch (err) {
    console.error("Failed to sync brand with data/brands.ts:", err);
  }
}

/**
 * Update the verification status of a brand application
 */
export function updateBrandRegistrationStatus(
  id: string,
  status: "pending_review" | "approved" | "live" | "rejected"
): { success: boolean; registration?: BrandRegistration; error?: string } {
  try {
    loadDeletedIds();
    const registrations = getBrandRegistrations();
    const index = registrations.findIndex((r) => r.id === id);

    if (index === -1) {
      return { success: false, error: `Brand application "${id}" not found.` };
    }

    registrations[index].status = status;
    memoryRegistrations = [...registrations];

    // Save to tmp for serverless persistence
    try {
      fs.writeFileSync(TMP_REGISTRATIONS_FILE, JSON.stringify(memoryRegistrations, null, 2), "utf8");
    } catch {}

    // Save to local brand-registrations.json if writable
    try {
      fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(memoryRegistrations, null, 2), "utf8");
    } catch {}

    // Sync with live storefront data/brands.ts
    try {
      if (status === "approved" || status === "live") {
        syncBrandToBrandsFile(registrations[index], "add");
      } else if (status === "rejected" || status === "pending_review") {
        syncBrandToBrandsFile(registrations[index], "remove");
      }
    } catch {}

    return {
      success: true,
      registration: registrations[index],
    };
  } catch (error: any) {
    console.error("Error in updateBrandRegistrationStatus:", error);
    return { success: false, error: error.message || "Failed to update brand status." };
  }
}

/**
 * Delete a brand application
 */
export function deleteBrandRegistration(id: string): { success: boolean; error?: string } {
  try {
    memoryDeletedIds.add(id);
    saveDeletedIds();

    const registrations = getBrandRegistrations();
    const target = registrations.find((r) => r.id === id);

    const updated = registrations.filter((r) => r.id !== id);
    memoryRegistrations = updated;

    try {
      fs.writeFileSync(TMP_REGISTRATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
    } catch {}

    try {
      fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");
    } catch {}

    // Remove from brands.ts if it was added
    if (target) {
      try {
        syncBrandToBrandsFile(target, "remove");
      } catch {}
    }

    return { success: true };
  } catch (err: any) {
    return { success: false, error: err.message || "Failed to delete registration." };
  }
}

/**
 * Register a new Pakistani fashion brand
 */
export function registerBrand(data: {
  brandName: string;
  website: string;
  saleUrl: string;
  platform?: "shopify" | "woocommerce" | "magento" | "custom" | "other";
  categories: string[];
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  description?: string;
  priceGuaranteeAccepted: boolean;
}): { success: boolean; registration?: BrandRegistration; error?: string } {
  const brandName = (data.brandName || "").trim();
  const website = (data.website || "").trim();
  const saleUrl = (data.saleUrl || "").trim();
  const contactName = (data.contactName || "").trim();
  const contactEmail = (data.contactEmail || "").trim().toLowerCase();
  const contactPhone = (data.contactPhone || "").trim();

  // Basic validations
  if (!brandName) return { success: false, error: "Brand name is required." };
  if (!website || !website.startsWith("http")) {
    return { success: false, error: "A valid website URL starting with http:// or https:// is required." };
  }
  if (!saleUrl || !saleUrl.startsWith("http")) {
    return { success: false, error: "A valid official sale/collection URL is required." };
  }
  if (!contactName) return { success: false, error: "Contact person name is required." };
  if (!contactEmail || !contactEmail.includes("@")) {
    return { success: false, error: "A valid business email address is required." };
  }
  if (!data.priceGuaranteeAccepted) {
    return {
      success: false,
      error: "Please accept the Genuine Discount & Women's Fashion Guarantee.",
    };
  }

  const slug = brandName
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");

  const currentList = getBrandRegistrations();

  // Check if brand is already registered
  const existing = currentList.find(
    (b) => b.slug === slug || b.website.toLowerCase() === website.toLowerCase()
  );
  if (existing) {
    return {
      success: false,
      error: `A registration for "${brandName}" is already under review or registered.`,
    };
  }

  const newRegistration: BrandRegistration = {
    id: `reg_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    brandName,
    slug,
    website,
    saleUrl,
    platform: data.platform || "shopify",
    categories: data.categories && data.categories.length > 0 ? data.categories : ["unstitched", "pret"],
    contactName,
    contactEmail,
    contactPhone,
    logoUrl: data.logoUrl || "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=100&h=100&fit=crop&q=80",
    description: data.description || "",
    registeredAt: new Date().toISOString(),
    status: "pending_review",
    priceGuaranteeAccepted: true,
  };

  memoryDeletedIds.delete(newRegistration.id);
  memoryDeletedIds.delete(newRegistration.slug);
  saveDeletedIds();

  const updatedList = [newRegistration, ...currentList];
  memoryRegistrations = updatedList;

  try {
    fs.writeFileSync(TMP_REGISTRATIONS_FILE, JSON.stringify(updatedList, null, 2), "utf8");
  } catch {}

  try {
    const dir = path.dirname(REGISTRATIONS_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(updatedList, null, 2), "utf8");
  } catch (error) {
    console.warn("Could not write brand registration to disk:", error);
  }

  return {
    success: true,
    registration: newRegistration,
  };
}
