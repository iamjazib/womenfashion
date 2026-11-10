import { NextRequest, NextResponse } from "next/server";
import { getSubscribers } from "@/lib/subscriberStore";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const format = searchParams.get("format");
    const subscribers = getSubscribers();

    // Export as CSV if ?format=csv
    if (format === "csv") {
      const csvHeader = "ID,Email,SubscribedAt,Source,Status\n";
      const csvRows = subscribers
        .map(
          (s) =>
            `"${s.id}","${s.email}","${s.subscribedAt}","${s.source}","${s.status}"`
        )
        .join("\n");
      const csv = csvHeader + csvRows;

      return new NextResponse(csv, {
        status: 200,
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="subscribers-${new Date().toISOString().slice(0, 10)}.csv"`,
        },
      });
    }

    return NextResponse.json({
      success: true,
      count: subscribers.length,
      subscribers,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: "Failed to retrieve subscribers" },
      { status: 500 }
    );
  }
}
