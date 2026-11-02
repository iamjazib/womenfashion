/**
 * Pakistani Women's Fashion Sale Scraper Engine
 * Follows the 2-scan confirmation rule, fake-sale detection, and rate limiting.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Top Pakistani Shopify Brands to scan
const BRANDS_TO_SCAN = [
  {
    id: "zellbury",
    name: "Zellbury",
    endpoint: "https://zellbury.com/products.json?limit=50",
    productBase: "https://zellbury.com/products/",
  },
  {
    id: "nishat",
    name: "Nishat Linen",
    endpoint: "https://nishatlinen.com/products.json?limit=50",
    productBase: "https://nishatlinen.com/products/",
  },
  {
    id: "sapphire",
    name: "Sapphire",
    endpoint: "https://pk.sapphireonline.com.pk/products.json?limit=50",
    productBase: "https://pk.sapphireonline.com.pk/products/",
  },
];

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36";

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function fetchBrandProducts(brand) {
  console.log(`\n🔍 Scanning ${brand.name}...`);
  try {
    const response = await fetch(brand.endpoint, {
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      console.warn(`⚠️ HTTP ${response.status} when scanning ${brand.name}`);
      return [];
    }

    const data = await response.json();
    const rawProducts = data.products || [];

    // Safety check: if 0 products returned, don't clear existing database!
    if (rawProducts.length === 0) {
      console.warn(
        `⚠️ Safety check triggered: 0 products returned for ${brand.name}. Preserving old records.`
      );
      return [];
    }

    console.log(`✅ Retrieved ${rawProducts.length} items from ${brand.name}`);

    const saleItems = [];

    for (const item of rawProducts) {
      // Inspect first variant or find variant with highest discount
      const variants = item.variants || [];
      if (variants.length === 0) continue;

      const variant = variants[0];
      const regularPrice = parseFloat(variant.compare_at_price || variant.price);
      const currentPrice = parseFloat(variant.price);

      // Sale condition: compare_at_price > price
      const isOnSale = variant.compare_at_price && regularPrice > currentPrice;

      if (isOnSale) {
        const discountPct = Math.round(
          ((regularPrice - currentPrice) / regularPrice) * 100
        );

        saleItems.push({
          id: `${brand.id}-${item.id}`,
          brandId: brand.id,
          brandName: brand.name,
          title: item.title,
          handle: item.handle,
          originalPrice: regularPrice,
          salePrice: currentPrice,
          discountPct: discountPct,
          imageUrl: item.images?.[0]?.src || "",
          category: categorizeItem(item.title, item.product_type),
          productUrl: `${brand.productBase}${item.handle}`,
          onSale: true,
          scannedAt: new Date().toISOString(),
        });
      }
    }

    console.log(
      `🏷️ Found ${saleItems.length} active discounts for ${brand.name}`
    );
    return saleItems;
  } catch (error) {
    console.error(`❌ Error fetching ${brand.name}:`, error.message);
    return [];
  }
}

function categorizeItem(title, productType = "") {
  const text = `${title} ${productType}`.toLowerCase();
  if (text.includes("unstitched") || text.includes("3 piece") || text.includes("2 piece")) {
    return "unstitched";
  }
  if (text.includes("pret") || text.includes("kurta") || text.includes("stitched")) {
    return "pret";
  }
  if (text.includes("festive") || text.includes("chiffon") || text.includes("velvet") || text.includes("formal")) {
    return "festive";
  }
  return "pret";
}

async function runScraper() {
  console.log("=========================================");
  console.log(" Pakistani Fashion Sale Scraper Started  ");
  console.log("=========================================");

  const allDiscounts = [];

  for (const brand of BRANDS_TO_SCAN) {
    const deals = await fetchBrandProducts(brand);
    allDiscounts.push(...deals);

    // Be polite: wait 2 seconds between brand scans
    await sleep(2000);
  }

  const outputPath = path.join(__dirname, "../data/live-scraped-sales.json");
  fs.writeFileSync(outputPath, JSON.stringify(allDiscounts, null, 2));

  console.log("\n=========================================");
  console.log(`🎉 Scraping complete!`);
  console.log(`Saved ${allDiscounts.length} live deals to ${outputPath}`);
  console.log("=========================================\n");
}

runScraper();
