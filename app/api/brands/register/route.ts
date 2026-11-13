import { NextRequest, NextResponse } from "next/server";
import { registerBrand, getBrandRegistrations } from "@/lib/brandRegistry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const registrations = getBrandRegistrations();
    return NextResponse.json(
      {
        success: true,
        count: registrations.length,
        registrations,
      },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve brand registrations." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const result = registerBrand(body);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to register brand." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Registration for "${result.registration?.brandName}" submitted successfully! Our curation team will review and connect your live sales feed.`,
      registration: result.registration,
    });
  } catch (error: any) {
    console.error("Brand registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
