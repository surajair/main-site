import { handleDodoWebhookAction } from "@/actions/handle-webhook-action";
import { findUserIdByEmail, logWebhookEvent } from "@/lib/webhook-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clientId = process.env.CHAIBUILDER_CLIENT_ID || "";
    const userId = (await findUserIdByEmail(body?.data?.customer?.email)) || "";
    const eventType = body.type;

    // Save webhook to database - Just userId, clientId, and complete payload
    const { webhook, error: logError } = await logWebhookEvent({
      provider: "DODO",
      eventType,
      payload: body,
      userId,
      clientId,
    });

    if (logError) {
      console.error("Failed to log webhook:", logError);
      return NextResponse.json({ error: "Failed to save webhook" }, { status: 500 });
    }

    // Process webhook event based on event type
    if (eventType === "subscription.renewed") {
      await new Promise((resolve) => setTimeout(resolve, 3000));
    }
    await handleDodoWebhookAction(eventType, body, userId);

    return NextResponse.json(
      {
        received: true,
        saved: true,
        eventType,
        webhookId: webhook?.id,
      },
      { status: 200 },
    );
  } catch (error: any) {
    console.error("DODO Webhook error:", error);
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
      },
      { status: 500 },
    );
  }
}
