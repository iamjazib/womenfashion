import { NextResponse } from "next/server";
import { getSiteContent } from "@/lib/siteContentRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const content = getSiteContent();
    return NextResponse.json(
      { success: true, content },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve site content." },
      { status: 500 }
    );
  }
}
