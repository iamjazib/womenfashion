import { NextRequest, NextResponse } from "next/server";
import { createBlog, updateBlog, deleteBlog, getAllBlogs } from "@/lib/blogRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const blogs = getAllBlogs(true);
    return NextResponse.json(
      { success: true, count: blogs.length, blogs },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve blogs." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    }

    if (!body || !body.title) {
      return NextResponse.json(
        { success: false, error: "Blog title is required." },
        { status: 400 }
      );
    }

    const result = createBlog(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to create blog post." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Blog post "${result.blog?.title}" created successfully!`,
      blog: result.blog,
    });
  } catch (error: any) {
    console.error("Error creating blog post:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error creating blog." },
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    }

    const { id, ...updates } = body;
    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required for update." },
        { status: 400 }
      );
    }

    const result = updateBlog(id, updates);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update blog post." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Blog post "${result.blog?.title}" updated successfully!`,
      blog: result.blog,
    });
  } catch (error: any) {
    console.error("Error updating blog post:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error updating blog." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    let id: string | null = null;
    try {
      id = req.nextUrl.searchParams.get("id");
    } catch {}

    if (!id) {
      try {
        const url = new URL(req.url);
        id = url.searchParams.get("id");
      } catch {}
    }

    if (!id) {
      try {
        const body = await req.json();
        id = body?.id || null;
      } catch {}
    }

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Blog ID is required." },
        { status: 400 }
      );
    }

    const result = deleteBlog(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to delete blog post." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Blog post deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error deleting blog post." },
      { status: 500 }
    );
  }
}
