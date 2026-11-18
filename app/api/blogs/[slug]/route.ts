import { NextRequest, NextResponse } from "next/server";
import { getBlogBySlug } from "@/lib/blogRegistry";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await context.params;
    if (!slug) {
      return NextResponse.json(
        { success: false, error: "Slug is required." },
        { status: 400 }
      );
    }

    const blog = getBlogBySlug(slug);
    if (!blog) {
      return NextResponse.json(
        { success: false, error: `Blog post "${slug}" not found.` },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, blog },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog post." },
      { status: 500 }
    );
  }
}
