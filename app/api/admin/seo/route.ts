import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import os from "os";

export const dynamic = "force-dynamic";

const LOCAL_SEO_FILE = path.join(process.cwd(), "data", "seo-config.json");
const TMP_SEO_FILE = path.join(os.tmpdir(), "seo-config.json");

// Default initial SEO config fallback
const DEFAULT_SEO_CONFIG = {
  pages: [
    {
      id: "home",
      path: "/",
      name: "Homepage",
      title: "Women Fashion • Pakistani Women's Clothing Sale Tracker | Real Discounts",
      description: "Pakistan's #1 women's fashion sale tracker. Real-time discounts, unstitched lawn clearances, and designer pret markdowns across Gul Ahmed, Baroque, Asim Jofa, Nishat Linen, Sapphire, and more.",
      keywords: "pakistani lawn sale, women fashion deals, gul ahmed sale, baroque special prices, sapphire pret, nishat linen unstitched, online clothing discounts pakistan",
      ogImage: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200&h=630&fit=crop&q=80",
      canonical: "https://womenfashion2.vercel.app/",
    },
    {
      id: "brands",
      path: "/brands",
      name: "Brands Directory",
      title: "Pakistani Women's Fashion Brands Directory | Official Sale Trackers",
      description: "Browse all 10 verified Pakistani women's clothing brands. Real-time clearance deals, unstitched lawn collections, and ready-to-wear kurtis.",
      keywords: "pakistani clothing brands, gul ahmed, baroque, asim jofa, nishat linen, sapphire, limelight, sana safinaz, junaid jamshed, alkaram, zellbury",
      ogImage: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1200&h=630&fit=crop&q=80",
      canonical: "https://womenfashion2.vercel.app/brands",
    },
    {
      id: "compare",
      path: "/compare",
      name: "Compare Deals",
      title: "Compare Women's Fashion Deals Side-by-Side | Pakistani Brand Sales",
      description: "Compare fabrics, piece counts, discounts, and genuine prices across Gul Ahmed, Baroque, Nishat Linen, Sapphire, and more.",
      keywords: "compare lawn suits, compare pret deals, pakistani designer sales comparison",
      ogImage: "https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=1200&h=630&fit=crop&q=80",
      canonical: "https://womenfashion2.vercel.app/compare",
    },
    {
      id: "brand-portal",
      path: "/brand-portal",
      name: "Brand Partner Portal",
      title: "Brand Partner Portal & Registration | Women Fashion Sale Radar",
      description: "Register your Pakistani clothing brand on Pakistan's #1 women's fashion sale radar. Reach high-intent buyers with zero listing fees and direct storefront checkout.",
      keywords: "list your brand, brand partnership pakistan, fashion brand registration, pakistani clothing brand partner",
      ogImage: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=1200&h=630&fit=crop&q=80",
      canonical: "https://womenfashion2.vercel.app/brand-portal",
    },
  ],
};

// In-memory cache for fast serverless execution across requests
let memorySeoConfig: any = null;

function readSeoConfig(): any {
  if (memorySeoConfig) {
    return memorySeoConfig;
  }

  // 1. Try reading from /tmp (writable cache on Vercel)
  try {
    if (fs.existsSync(TMP_SEO_FILE)) {
      const data = JSON.parse(fs.readFileSync(TMP_SEO_FILE, "utf8"));
      if (data && Array.isArray(data.pages)) {
        memorySeoConfig = data;
        return data;
      }
    }
  } catch {}

  // 2. Try reading from local project data directory
  try {
    if (fs.existsSync(LOCAL_SEO_FILE)) {
      const data = JSON.parse(fs.readFileSync(LOCAL_SEO_FILE, "utf8"));
      if (data && Array.isArray(data.pages)) {
        memorySeoConfig = data;
        return data;
      }
    }
  } catch {}

  // 3. Fallback to default
  memorySeoConfig = DEFAULT_SEO_CONFIG;
  return DEFAULT_SEO_CONFIG;
}

function writeSeoConfig(data: any) {
  memorySeoConfig = data;

  // 1. Try writing to /tmp (always writable on Vercel lambda)
  try {
    fs.writeFileSync(TMP_SEO_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    console.warn("Could not write SEO config to /tmp:", err);
  }

  // 2. Try writing to local project data file (works locally, might be read-only on Vercel)
  try {
    fs.writeFileSync(LOCAL_SEO_FILE, JSON.stringify(data, null, 2), "utf8");
  } catch (err) {
    // Expected on Vercel serverless read-only filesystem; memory & /tmp already saved
    console.info("Filesystem read-only (Vercel environment). Saved to memory and /tmp.");
  }
}

export async function GET() {
  try {
    const config = readSeoConfig();
    return NextResponse.json(
      { success: true, ...config },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to read SEO configuration." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { pageId, title, description, keywords, ogImage, canonical } = body;

    if (!pageId) {
      return NextResponse.json(
        { success: false, error: "pageId is required." },
        { status: 400 }
      );
    }

    const seoData = readSeoConfig();
    const pageIndex = seoData.pages.findIndex((p: any) => p.id === pageId);

    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Page "${pageId}" not found.` },
        { status: 404 }
      );
    }

    const current = seoData.pages[pageIndex];

    const updatedPage = {
      ...current,
      title: title !== undefined ? title : current.title,
      description: description !== undefined ? description : current.description,
      keywords: keywords !== undefined ? keywords : current.keywords,
      ogImage: ogImage !== undefined ? ogImage : current.ogImage,
      canonical: canonical !== undefined ? canonical : current.canonical,
      updatedAt: new Date().toISOString(),
    };

    seoData.pages[pageIndex] = updatedPage;
    writeSeoConfig(seoData);

    return NextResponse.json(
      {
        success: true,
        message: `Meta details for "${updatedPage.name}" updated successfully!`,
        page: updatedPage,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    console.error("Error updating SEO config:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update SEO config: " + (error.message || "") },
      { status: 500 }
    );
  }
}
