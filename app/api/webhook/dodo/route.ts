import { handleDodoWebhookAction } from "@/actions/handle-webhook-action";
import { findUserIdByEmail, logWebhookEvent } from "@/lib/webhook-helpers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const startTime = Date.now();
  const requestId = `dodo-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

  try {
    console.log(`[${requestId}] 🚀 DODO Webhook POST request started`);
    console.log(`[${requestId}] 📋 Request headers:`, {
      contentType: req.headers.get("content-type"),
      userAgent: req.headers.get("user-agent"),
      host: req.headers.get("host"),
    });

    const body = await req.json();
    console.log(`[${requestId}] 📦 Webhook payload received:`, {
      type: body.type,
      eventId: body.id,
      timestamp: body.created_at,
      hasData: !!body.data,
      hasCustomer: !!body.data?.customer,
      customerEmail: body.data?.customer?.email,
      subscriptionId: body.data?.subscription_id,
    });

    const clientId = process.env.CHAIBUILDER_CLIENT_ID || "";
    console.log(`[${requestId}] 🔐 Client ID:`, clientId ? `${clientId.substring(0, 8)}...` : "MISSING");

    const userId = (await findUserIdByEmail(body?.data?.customer?.email)) || "";
    console.log(`[${requestId}] 👤 User lookup result:`, {
      email: body?.data?.customer?.email,
      userId: userId || "NOT_FOUND",
    });

    const eventType = body.type;
    console.log(`[${requestId}] 📝 Event type:`, eventType);

    // Save webhook to database - Just userId, clientId, and complete payload
    console.log(`[${requestId}] 💾 Saving webhook to database...`);
    const { webhook, error: logError } = await logWebhookEvent({
      provider: "DODO",
      eventType,
      payload: body,
      userId,
      clientId,
    });

    if (logError) {
      console.error(`[${requestId}] ❌ Failed to log webhook:`, logError);
      return NextResponse.json({ error: "Failed to save webhook" }, { status: 500 });
    }

    console.log(`[${requestId}] ✅ Webhook saved successfully:`, {
      webhookId: webhook?.id,
      provider: "DODO",
      eventType,
    });

    // Process webhook event based on event type
    console.log(`[${requestId}] ⚙️ Processing webhook action...`);
    const actionStartTime = Date.now();
    await handleDodoWebhookAction(eventType, body);
    const actionDuration = Date.now() - actionStartTime;
    console.log(`[${requestId}] ✅ Webhook action completed in ${actionDuration}ms`);

    const totalDuration = Date.now() - startTime;
    console.log(`[${requestId}] 🎉 Webhook processing completed successfully in ${totalDuration}ms`);

    return NextResponse.json(
      {
        received: true,
        saved: true,
        eventType,
        webhookId: webhook?.id,
        requestId,
        processingTime: totalDuration,
      },
      { status: 200 },
    );
  } catch (error: any) {
    const totalDuration = Date.now() - startTime;
    console.error(`[${requestId}] 💥 DODO Webhook error after ${totalDuration}ms:`, {
      message: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      {
        error: error.message || "Internal server error",
        requestId,
        processingTime: totalDuration,
      },
      { status: 500 },
    );
  }
}
