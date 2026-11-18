import { NextRequest, NextResponse } from "next/server";
import { getAllBlogs } from "@/lib/blogRegistry";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDrafts = searchParams.get("all") === "true";
    const blogs = getAllBlogs(includeDrafts);

    return NextResponse.json(
      {
        success: true,
        count: blogs.length,
        blogs,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blog posts." },
      { status: 500 }
    );
  }
}
