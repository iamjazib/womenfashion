import fs from "fs";
import path from "path";
import { BrandRegistration, Brand } from "@/types";

const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "brand-registrations.json");
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

let memoryRegistrations: BrandRegistration[] = [];

/**
 * Retrieve all registered brand applications
 */
export function getBrandRegistrations(): BrandRegistration[] {
  try {
    if (fs.existsSync(REGISTRATIONS_FILE)) {
      const content = fs.readFileSync(REGISTRATIONS_FILE, "utf8");
      const parsed = JSON.parse(content || "[]");
      if (Array.isArray(parsed)) {
        memoryRegistrations = parsed;
        return parsed;
      }
    }
  } catch (error) {
    console.warn("Could not read brand-registrations from disk, using memory store:", error);
  }
  return memoryRegistrations;
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
      // Never remove core Pakistani fashion labels
      if (CORE_BRAND_IDS.has(reg.slug)) return;

      // Remove the custom brand block if present
      const regex = new RegExp(
        `\\s*,?\\s*\\{\\s*id:\\s*"${reg.slug}"[\\s\\S]*?\\}`,
        "g"
      );
      if (regex.test(content)) {
        const updatedContent = content.replace(regex, "");
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
    const registrations = getBrandRegistrations();
    const index = registrations.findIndex((r) => r.id === id);

    if (index === -1) {
      return { success: false, error: `Brand application "${id}" not found.` };
    }

    registrations[index].status = status;
    memoryRegistrations = registrations;

    // Save to brand-registrations.json
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");

    // Sync with live storefront data/brands.ts
    if (status === "approved" || status === "live") {
      syncBrandToBrandsFile(registrations[index], "add");
    } else if (status === "rejected" || status === "pending_review") {
      syncBrandToBrandsFile(registrations[index], "remove");
    }

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
    const registrations = getBrandRegistrations();
    const target = registrations.find((r) => r.id === id);
    if (!target) {
      return { success: false, error: "Registration not found." };
    }

    const updated = registrations.filter((r) => r.id !== id);
    memoryRegistrations = updated;

    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(updated, null, 2), "utf8");

    // Remove from brands.ts if it was added
    syncBrandToBrandsFile(target, "remove");

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

  const updatedList = [newRegistration, ...currentList];
  memoryRegistrations = updatedList;

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
