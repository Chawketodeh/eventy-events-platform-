import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/order.actions";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

export async function POST(request: Request) {
  const body = await request.text();
  const sig = request.headers.get("stripe-signature") as string;
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return new NextResponse(`Webhook Error: ${err.message}`, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    const order = {
      stripeId: session.id,
      eventId: session.metadata?.eventId || "",
      buyerId: session.metadata?.buyerId || "",
      totalAmount: session.amount_total
        ? (session.amount_total / 100).toString()
        : "0",
      createdAt: new Date(),
    };

    try {
      const newOrder = await createOrder(order);
      console.log("Order saved:", newOrder);
    } catch (dbErr) {
      console.error("Failed to save order:", dbErr);
    }
  }

  return new NextResponse("Webhook received", { status: 200 });
}

export const config = {
  api: {
    bodyParser: false,
  },
};
