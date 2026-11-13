import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

const SEO_FILE = path.join(process.cwd(), "data", "seo-config.json");

export async function GET() {
  try {
    if (fs.existsSync(SEO_FILE)) {
      const content = fs.readFileSync(SEO_FILE, "utf8");
      return NextResponse.json({ success: true, ...JSON.parse(content) });
    }
    return NextResponse.json({ success: true, pages: [] });
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

    let seoData = { pages: [] as any[] };
    if (fs.existsSync(SEO_FILE)) {
      seoData = JSON.parse(fs.readFileSync(SEO_FILE, "utf8"));
    }

    const pageIndex = seoData.pages.findIndex((p: any) => p.id === pageId);
    if (pageIndex === -1) {
      return NextResponse.json(
        { success: false, error: `Page "${pageId}" not found.` },
        { status: 404 }
      );
    }

    seoData.pages[pageIndex] = {
      ...seoData.pages[pageIndex],
      title: title || seoData.pages[pageIndex].title,
      description: description || seoData.pages[pageIndex].description,
      keywords: keywords || seoData.pages[pageIndex].keywords,
      ogImage: ogImage || seoData.pages[pageIndex].ogImage,
      canonical: canonical || seoData.pages[pageIndex].canonical,
      updatedAt: new Date().toISOString(),
    };

    fs.writeFileSync(SEO_FILE, JSON.stringify(seoData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: `Meta details for "${seoData.pages[pageIndex].name}" updated successfully!`,
      page: seoData.pages[pageIndex],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update SEO config." },
      { status: 500 }
    );
  }
}
