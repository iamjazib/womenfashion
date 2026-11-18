import { NextRequest, NextResponse } from "next/server";
import { updateSiteContent, resetSiteContent, getSiteContent } from "@/lib/siteContentRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve site content." },
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

    if (!body || typeof body !== "object") {
      return NextResponse.json(
        { success: false, error: "Invalid payload." },
        { status: 400 }
      );
    }

    const result = updateSiteContent(body);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update content." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Website text content updated successfully!",
      content: result.content,
    });
  } catch (error: any) {
    console.error("Error updating site content:", error);
    return NextResponse.json(
      { success: false, error: error?.message || "Internal server error updating content." },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    const result = resetSiteContent();
    return NextResponse.json({
      success: true,
      message: "Website content reset to default settings.",
      content: result.content,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to reset site content." },
      { status: 500 }
    );
  }
}
