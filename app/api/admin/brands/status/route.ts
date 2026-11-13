import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getBrandRegistrations } from "@/lib/brandRegistry";

const REGISTRATIONS_FILE = path.join(process.cwd(), "data", "brand-registrations.json");

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { id, status } = body;

    if (!id || !status) {
      return NextResponse.json(
        { success: false, error: "Both id and status are required." },
        { status: 400 }
      );
    }

    const registrations = getBrandRegistrations();
    const index = registrations.findIndex((r) => r.id === id);

    if (index === -1) {
      return NextResponse.json(
        { success: false, error: `Brand registration "${id}" not found.` },
        { status: 404 }
      );
    }

    registrations[index].status = status;
    fs.writeFileSync(REGISTRATIONS_FILE, JSON.stringify(registrations, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      message: `Status updated to "${status}" for ${registrations[index].brandName}.`,
      registration: registrations[index],
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to update brand status." },
      { status: 500 }
    );
  }
}
