import fs from "fs";
import path from "path";
import { BrandRegistration } from "@/types";

const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "brand-registrations.json");
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
