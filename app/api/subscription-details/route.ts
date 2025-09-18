import { Environment, Paddle } from "@paddle/paddle-node-sdk";
import { get } from "lodash";
import { NextResponse } from "next/server";

const paddle = new Paddle("pdl_sdbx_apikey_01k5ecdq2cba0sxfc354cyp35a_DBf7XMHKQJ1y9vyg4XBDAY_Awa", {
  environment: Environment.sandbox,
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const transactionId = searchParams.get('transactionId');

  if (!transactionId) {
    return NextResponse.json({ error: "Transaction ID required" }, { status: 400 });
  }

  try {
    const transaction = await paddle.transactions.get(transactionId);
    const subscriptionId = transaction.subscriptionId;

    if (!subscriptionId) {
      return NextResponse.json({ error: "No subscription found for this transaction" }, { status: 404 });
    }

    const subscription = await paddle.subscriptions.get(subscriptionId);
    const data = get(subscription, "items[0]");
    const nextBilledAt = get(data, "nextBilledAt");
    const planId = get(data, "product.id");
    const priceId = get(data, "price.id");
    const status = get(data, "status");
    return NextResponse.json({ subscriptionId, nextBilledAt, data, planId, priceId, status });
  } catch (error: any) {
    return NextResponse.json({ error: error?.message }, { status: 500 });
  }
}
