import { NextRequest, NextResponse } from "next/server";
import { addSubscriber } from "@/lib/subscriberStore";
import { sendWelcomeEmail } from "@/lib/emailService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { success: false, error: "Email address is required." },
        { status: 400 }
      );
    }

    // 1. Store subscriber locally in project
    const result = addSubscriber(email, source || "homepage_cta");

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || "Failed to subscribe." },
        { status: 400 }
      );
    }

    // 2. Dispatch Welcome Email (local outbox or provider)
    let emailStatus = { success: false, provider: "none" };
    try {
      emailStatus = await sendWelcomeEmail(result.subscriber.email);
    } catch (e: any) {
      console.warn("Could not dispatch welcome email:", e.message);
    }

    return NextResponse.json({
      success: true,
      message: result.isNew
        ? "You're on the VIP list! Welcome email has been dispatched."
        : "You are already subscribed to VIP Sale Alerts!",
      isNew: result.isNew,
      subscriber: {
        email: result.subscriber.email,
        subscribedAt: result.subscriber.subscribedAt,
        status: result.subscriber.status,
      },
      welcomeEmailDispatched: emailStatus.success,
    });
  } catch (error: any) {
    console.error("Subscription error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
