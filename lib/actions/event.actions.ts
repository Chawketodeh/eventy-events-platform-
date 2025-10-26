"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@clerk/nextjs/server"; // new
import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";
import User from "@/lib/database/models/user.model";
import Category from "@/lib/database/models/category.model";
import { handleError } from "@/lib/utils";

import {
  CreateEventParams,
  UpdateEventParams,
  DeleteEventParams,
  GetAllEventsParams,
  GetRelatedEventsByCategoryParams,
} from "@/types";

// Get category by name (case insensitive)
const getCategoryByName = async (name: string) => {
  return Category.findOne({ name: { $regex: name, $options: "i" } });
};

// Helper to populate Event
const populateEvent = (query: any) => {
  return query
    .populate({
      path: "organizer",
      model: User,
      select: "_id clerkId firstName lastName", //  added clerkId here
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
export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    const { userId: clerkUserId, sessionClaims } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    await connectToDatabase();

    //  Extract user details from Clerk claims
    const firstName = sessionClaims?.firstName || "Unknown";
    const lastName = sessionClaims?.lastName || "";
    const email = sessionClaims?.email || "";

    //  Find or create organizer
    let organizer = await User.findOne({ clerkId: clerkUserId });

    if (!organizer) {
      organizer = await User.create({
        clerkId: clerkUserId,
        firstName,
        lastName,
        email,
      });
    }

    //  Create the new event
    const newEvent = await Event.create({
      title: event.title,
      description: event.description,
      location: event.location,
      latitude: event.latitude,
      longitude: event.longitude,
      imageUrl: event.imageUrl,
      startDateTime: event.startDateTime,
      endDateTime: event.endDateTime,
      price: event.price,
      isFree: event.isFree,
      url: event.url,
      category: event.categoryId,
      organizer: organizer._id,
    });

    revalidatePath(path);
    return JSON.parse(JSON.stringify(newEvent));
  } catch (error) {
    handleError(error);
  }
}

/* ===============================
   GET EVENT BY ID
================================ */
export async function getEventById(eventId: string) {
  try {
    await connectToDatabase();

    const event = await populateEvent(Event.findById(eventId)).exec();
    if (!event) throw new Error("Event not found");

    return JSON.parse(JSON.stringify(event));
  } catch (error) {
    handleError(error);
  }
}

/* ===============================
   UPDATE EVENT
================================ */
export async function updateEvent({ userId, event, path }: UpdateEventParams) {
  try {
    const { userId: clerkUserId, sessionClaims } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const isAdmin =
      sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

    await connectToDatabase();

    const organizer = await User.findOne({ clerkId: clerkUserId });
    if (!organizer) throw new Error("User not found");

    const eventToUpdate = await Event.findById(event._id);
    if (!eventToUpdate) throw new Error("Event not found");

    // prevent editing others' events unless admin
    if (
      !isAdmin &&
      eventToUpdate.organizer.toString() !== organizer._id.toString()
    ) {
      throw new Error("Unauthorized action");
    }

    const updatedEvent = await Event.findByIdAndUpdate(
      event._id,
      {
        title: event.title,
        description: event.description,
        location: event.location,
        latitude: event.latitude, //  added
        longitude: event.longitude, //  added
        imageUrl: event.imageUrl,
        startDateTime: event.startDateTime,
        endDateTime: event.endDateTime,
        price: event.price,
        isFree: event.isFree,
        url: event.url,
        category: event.categoryId,
      },
      { new: true }
    );

    revalidatePath(path);
    return JSON.parse(JSON.stringify(updatedEvent));
  } catch (error) {
    handleError(error);
  }
}

/* ===============================
   DELETE EVENT
================================ */
export async function deleteEvent({ eventId, path }: DeleteEventParams) {
  try {
    const { userId: clerkUserId, sessionClaims } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    const isAdmin =
      sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

    await connectToDatabase();

    const organizer = await User.findOne({ clerkId: clerkUserId });
    if (!organizer) throw new Error("User not found");

    const eventToDelete = await Event.findById(eventId);
    if (!eventToDelete) throw new Error("Event not found");

    // prevent deleting others' events unless admin
    if (
      !isAdmin &&
      eventToDelete.organizer.toString() !== organizer._id.toString()
    ) {
      throw new Error("Unauthorized action");
    }

    const deletedEvent = await Event.findByIdAndDelete(eventId);
    if (deletedEvent) revalidatePath(path);
  } catch (error) {
    handleError(error);
  }
}

/* ===============================
   GET ALL EVENTS (search + filter)
================================ */
export async function getAllEvents({
  query,
  limit = 6,
  page = 1,
  category,
}: GetAllEventsParams) {
  try {
    await connectToDatabase();

    const skipAmount = (Number(page) - 1) * limit;

    query = typeof query === "string" ? query.trim() : "";
    category = typeof category === "string" ? category.trim() : "";

    const titleCondition =
      query && query !== "" ? { title: { $regex: query, $options: "i" } } : {};

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
      .skip(skipAmount)
      .limit(limit);

    // Ensure population resolves fully before returning
    const events = await populateEvent(eventsQuery).exec();

    const eventsCount = await Event.countDocuments(conditions);

    // Send populated data with organizer names
    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

/* ===============================
   GET EVENTS BY USER
================================ */
export const getEventsByUser = async ({ userId, page = 1, limit = 6 }: any) => {
  try {
    await connectToDatabase();

    const organizer = await User.findOne({ clerkId: userId });
    if (!organizer) throw new Error("User not found");

    const query = Event.find({ organizer: organizer._id })
      .sort({ createdAt: "desc" })
      .skip((page - 1) * limit)
      .limit(limit);

    const events = await query.populate("category").populate("organizer");
    const count = await Event.countDocuments({ organizer: organizer._id });

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    handleError(error);
  }
};

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

    const skipAmount = (Number(page) - 1) * limit;

    const conditions = {
      $and: [{ category: categoryId }, { _id: { $ne: eventId } }],
    };

    const eventsQuery = Event.find(conditions)
      .sort({ createdAt: "desc" })
      .skip(skipAmount)
      .limit(limit);

    const events = await populateEvent(eventsQuery);
    const eventsCount = await Event.countDocuments(conditions);

    return {
      data: JSON.parse(JSON.stringify(events)),
      totalPages: Math.ceil(eventsCount / limit),
    };
  } catch (error) {
    handleError(error);
  }
}

/* ===============================
   DELETE EVENTS BY USER (for Clerk webhook)
================================ */
export async function deleteEventsByUser(clerkId: string) {
  try {
    await connectToDatabase();

    const organizer = await User.findOne({ clerkId });
    if (!organizer) {
      console.log(`No user found with Clerk ID ${clerkId}`);
      return;
    }

    const result = await Event.deleteMany({ organizer: organizer._id });
    console.log(`Deleted ${result.deletedCount} events for user ${clerkId}`);
  } catch (error) {
    console.error("Error deleting user events:", error);
  }
}
