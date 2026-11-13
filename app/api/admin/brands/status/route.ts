import { NextRequest, NextResponse } from "next/server";
import { updateBrandRegistrationStatus, deleteBrandRegistration } from "@/lib/brandRegistry";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Both brand id and status are required." },
        { status: 400 }
      );
    }

    const validStatuses = ["pending_review", "approved", "live", "rejected"];
    if (!validStatuses.includes(status)) {
      return NextResponse.json(
        { success: false, error: `Invalid status. Must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const result = updateBrandRegistrationStatus(id, status);

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to update brand status." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: `Status updated to "${status}" for ${result.registration?.brandName}.`,
      registration: result.registration,
    });
  } catch (error: any) {
    console.error("Error in status update API:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error updating brand status." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Application id is required." },
        { status: 400 }
      );
    }

    const result = deleteBrandRegistration(id);
    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to delete registration." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Brand application deleted successfully.",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Internal server error deleting brand application." },
      { status: 500 }
    );
  }
}
