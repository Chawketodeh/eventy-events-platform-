"use server";

import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import Stripe from "stripe";
import { connectToDatabase } from "@/lib/database";
import Order from "@/lib/database/models/order.model";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";

import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";

/* ============================
   CHECKOUT ORDER (STRIPE)
============================ */
export const checkoutOrder = async (order: CheckoutOrderParams) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

  const price = order.isFree ? 0 : Number(order.price) * 100;

  try {
    const session = await stripe.checkout.sessions.create({
      line_items: [
        {
          price_data: {
            currency: "usd",
            unit_amount: price,
            product_data: {
              name: order.eventTitle,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        eventId: order.eventId,
        buyerId: order.buyerId,
      },
      mode: "payment",
      success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/profile`,
      cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
    });

    redirect(session.url!);
  } catch (error) {
    console.error(" Stripe checkout error:", error);
    // Throw proper Error object instead of raw error
    throw new Error("Stripe checkout failed");
  }
};

/* ============================
   CREATE ORDER
============================ */
export async function createOrder(order: CreateOrderParams) {
  try {
    await connectToDatabase();

    // Resolve Clerk ID to MongoDB ID if needed, 
    // or assume it's passed as clerkId in metadata
    const buyer = await User.findOne({ clerkId: order.buyerId });
    if (!buyer) throw new Error("Buyer not found for given clerkId");

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: buyer._id,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    console.error("Create order failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create order",
    );
  }
}

/* ============================
  GET ORDERS BY EVENT
============================ */
export async function getOrdersByEvent({
  eventId,
  searchString = "",
}: GetOrdersByEventParams) {
  try {
    await connectToDatabase();

    const skip = 0; // Pagination not yet implemented for this function

    const userConditions = searchString
      ? {
          $or: [
            { firstName: { $regex: searchString, $options: "i" } },
            { lastName: { $regex: searchString, $options: "i" } },
          ],
        }
      : {};

    const users = await User.find(userConditions).select("_id");
    const userIds = users.map((user) => user._id);

    const conditions = {
      event: eventId,
      ...(searchString ? { buyer: { $in: userIds } } : {}),
    };

    const orders = await Order.find(conditions)
      .sort({ createdAt: -1 })
      .populate({
        path: "event",
        model: Event,
        select: "_id title",
      })
      .populate({
        path: "buyer",
        model: User,
        select: "_id firstName lastName",
      });

    // Transform to IOrderItem format for the frontend table
    const plainOrders = orders.map((order: any) => ({
      _id: order._id,
      totalAmount: order.totalAmount,
      createdAt: order.createdAt,
      eventTitle: order.event?.title || "",
      eventId: order.event?._id || "",
      buyer: order.buyer ? `${order.buyer.firstName} ${order.buyer.lastName}` : "Unknown",
    }));

    return JSON.parse(JSON.stringify(plainOrders));
  } catch (error) {
    console.error("Get orders by event failed:", error);
    return [];
  }
}

/* ============================
  GET ORDERS BY USER
============================ */
export async function getOrdersByUser({
  userId,
  page = 1,
  limit = 10,
}: GetOrdersByUserParams) {
  try {
    await connectToDatabase();

    const buyer = await User.findOne({ clerkId: userId });
    if (!buyer) return { data: [], totalPages: 0 };

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const orders = await Order.find({ buyer: buyer._id })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNumber)
      .populate({
        path: "event",
        model: Event,
        select: "_id title imageUrl price",
      });

    const count = await Order.countDocuments({ buyer: buyer._id });

    return {
      data: JSON.parse(JSON.stringify(orders)),
      totalPages: Math.ceil(count / limitNumber),
    };
  } catch (error) {
    console.error("Get user orders failed:", error);
    return { data: [], totalPages: 0 };
  }
}

/* ============================
   GET ORDER BY ID
============================ */
export async function getOrderById(orderId: string) {
  try {
    await connectToDatabase();

    const order = await Order.findById(orderId)
      .populate({
        path: "event",
        model: Event,
      })
      .populate({
        path: "buyer",
        model: User,
      });

    if (!order) return null;

    return JSON.parse(JSON.stringify(order));
  } catch (error) {
    console.error("Get order failed:", error);
    return null;
  }
}
