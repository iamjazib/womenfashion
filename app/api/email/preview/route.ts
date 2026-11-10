import { NextRequest, NextResponse } from "next/server";
import { generateWelcomeEmailHtml } from "@/lib/emailService";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const email = searchParams.get("email") || "fashionlover@example.com";

  const html = generateWelcomeEmailHtml(email);

  return new NextResponse(html, {
    status: 200,
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
