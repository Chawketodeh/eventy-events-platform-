"use server";

import Stripe from "stripe";
import {
  CheckoutOrderParams,
  CreateOrderParams,
  GetOrdersByEventParams,
  GetOrdersByUserParams,
} from "@/types";
import { redirect } from "next/navigation";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import Order from "../database/models/order.model";
import Event from "../database/models/event.model";
import User from "../database/models/user.model";
import { ObjectId } from "mongodb";

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
    throw error;
  }
};

/* ============================
   CREATE ORDER
============================ */
export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();

    const newOrder = await Order.create({
      ...order,
      event: order.eventId,
      buyer: order.buyerId,
    });

    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
};

/* ============================
  GET ORDERS BY EVENT
============================ */
export async function getOrdersByEvent({
  searchString = "",
  eventId,
}: GetOrdersByEventParams) {
  try {
    await connectToDatabase();

    if (!eventId) throw new Error("Event ID is required");

    const eventObjectId =
      typeof eventId === "string" ? new ObjectId(eventId) : eventId;

    console.log(" Fetching orders for event:", eventObjectId);

    const orders = await Order.aggregate([
      {
        $match: {
          event: eventObjectId, // Match on event field before lookup
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "buyer",
          foreignField: "_id",
          as: "buyer",
        },
      },
      { $unwind: "$buyer" },
      {
        $lookup: {
          from: "events",
          localField: "event",
          foreignField: "_id",
          as: "event",
        },
      },
      { $unwind: "$event" },
      {
        $project: {
          _id: 1,
          totalAmount: 1,
          createdAt: 1,
          eventTitle: "$event.title",
          eventId: "$event._id",
          buyer: { $concat: ["$buyer.firstName", " ", "$buyer.lastName"] },
        },
      },
      ...(searchString
        ? [
            {
              $match: {
                buyer: { $regex: new RegExp(searchString, "i") },
              },
            },
          ]
        : []),
    ]);

    console.log(" Orders found:", orders.length);
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error(" Error in getOrdersByEvent:", error);
    handleError(error);
  }
}

/* ============================
  GET ORDERS BY USER
============================ */
export const getOrdersByUser = async ({
  userId,
  page = 1,
}: GetOrdersByUserParams) => {
  try {
    await connectToDatabase();

    // Find MongoDB user by Clerk ID
    const user = await User.findOne({ clerkId: userId });
    if (!user) throw new Error("User not found");

    const currentPage = Number(page) || 1;

    const orders = await Order.find({ buyer: user._id })
      .populate({
        path: "event",
        model: Event,
        populate: { path: "organizer", model: User },
      })
      .limit(10)
      .skip((currentPage - 1) * 10);

    console.log(` Found ${orders.length} orders for user ${user.userName}`);

    return JSON.parse(JSON.stringify({ data: orders }));
  } catch (error) {
    console.error(" Error in getOrdersByUser:", error);
    handleError(error);
  }
};
