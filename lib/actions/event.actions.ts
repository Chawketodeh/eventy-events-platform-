"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

/* ===============================
   HELPERS
================================ */

const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id clerkId firstName lastName",
    })
    .populate({
      path: "category",
      model: Category,
      select: "_id name",
    });
};

/* ===============================
   CREATE EVENT
================================ */
export async function createEvent({ event, path }: CreateEventParams) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const firstName = sessionClaims?.firstName || "Unknown";
    const lastName = sessionClaims?.lastName || "";
    const email = sessionClaims?.email || "";

    let organizer = await User.findOne({ clerkId: userId });

    if (!organizer) {
      organizer = await User.create({
        clerkId: userId,
        firstName,
        lastName,
        email,
      });
    }

    const newEvent = await Event.create({
      ...event,
      category: event.categoryId,
      organizer: organizer._id,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    console.error("Create event failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create event"
    );
  }
}

/* ===============================
   GET EVENT BY ID
================================ */
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId)).exec();
    if (!event) return null;

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    console.error("Get event failed:", error);
    return null;
  }
}

/* ===============================
   UPDATE EVENT
================================ */
export async function updateEvent({ event, path }: UpdateEventParams) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isAdmin =
      sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

    await connectToDatabase();

    const organizer = await User.findOne({ clerkId: userId });
    if (!organizer) throw new Error("User not found");

    const existingEvent = await Event.findById(event._id);
    if (!existingEvent) throw new Error("Event not found");

    if (
      !isAdmin &&
      existingEvent.organizer.toString() !== organizer._id.toString()
    ) {
      throw new Error("Unauthorized action");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {
        ...event,
        category: event.categoryId,
      },
      { new: true }
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    console.error("Update event failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update event"
    );
  }
}

/* ===============================
   DELETE EVENT
================================ */
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    const { userId, sessionClaims } = await auth();
    if (!userId) throw new Error("Unauthorized");

    const isAdmin =
      sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

    await connectToDatabase();

    const organizer = await User.findOne({ clerkId: userId });
    if (!organizer) throw new Error("User not found");

    const event = await Event.findById(eventId);
    if (!event) throw new Error("Event not found");

    if (!isAdmin && event.organizer.toString() !== organizer._id.toString()) {
      throw new Error("Unauthorized action");
    }

    await Event.findByIdAndDelete(eventId);
    revalidatePath(path);
  } catch (error) {
    console.error("Delete event failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete event"
    );
  }
}

/* ===============================
   GET ALL EVENTS
================================ */
export async function getAllEvents({
  query = "",
  limit = 6,
  page = 1,
  category = "",
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 6;
    const skip = (pageNumber - 1) * limitNumber;

    const titleCondition = query
      ? { title: { $regex: query, $options: "i" } }
      : {};

    let categoryCondition = {};
    if (category) {
      const categoryDoc = await getCategoryByName(category);
      if (categoryDoc) categoryCondition = { category: categoryDoc._id };
    }

    const conditions =
      Object.keys(titleCondition).length ||
      Object.keys(categoryCondition).length
        ? { $and: [titleCondition, categoryCondition] }
        : {};

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skip)
      .limit(limitNumber);

    const events = await populateEvent(eventsQuery).exec();
    const count = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(count / limitNumber),
    };
  } catch (error) {
    console.error("Get all events failed:", error);
    return { data: [], totalPages: 0 };
  }
}

/* ===============================
   GET EVENTS BY USER
================================ */
export async function getEventsByUser({
  userId,
  page = 1,
  limit = 6,
}: {
  userId: string;
  page?: number;
  limit?: number;
}) {
  try {
    await connectToDatabase();

    const organizer = await User.findOne({ clerkId: userId });
    if (!organizer) return { data: [], totalPages: 0 };

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 6;
    const skip = (pageNumber - 1) * limitNumber;

    const events = await populateEvent(
      Event.find({ organizer: organizer._id })
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limitNumber)
    ).exec();

    const count = await Event.countDocuments({ organizer: organizer._id });

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(count / limitNumber),
    };
  } catch (error) {
    console.error("Get user events failed:", error);
    return { data: [], totalPages: 0 };
  }
}

/* ===============================
   GET RELATED EVENTS
================================ */
export async function getRelatedEventsByCategory({
  categoryId,
  eventId,
  limit = 3,
  page = 1,
}: GetRelatedEventsByCategoryParams) {
  try {
    await connectToDatabase();

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 3;
    const skip = (pageNumber - 1) * limitNumber;

    const conditions = {
      category: categoryId,
      _id: { $ne: eventId },
    };

    const events = await populateEvent(
      Event.find(conditions)
        .sort({ createdAt: "desc" })
        .skip(skip)
        .limit(limitNumber)
    ).exec();

    const count = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(count / limitNumber),
    };
  } catch (error) {
    console.error("Get related events failed:", error);
    return { data: [], totalPages: 0 };
  }
}

/* ===============================
   DELETE EVENTS BY USER (WEBHOOK)
================================ */
export async function deleteEventsByUser(clerkId: string) {
  try {
    await connectToDatabase();

    const organizer = await User.findOne({ clerkId });
    if (!organizer) return;

    await Event.deleteMany({ organizer: organizer._id });
  } catch (error) {
    console.error("Delete user events failed:", error);
  }
}
