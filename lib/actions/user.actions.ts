"use server";

import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Event from "@/lib/database/models/event.model";

import {
  CreateUserParams,
  UpdateUserParams,
  DeleteUserParams,
  GetUserByIdParams,
} from "@/types";

/* ===============================
   CREATE USER
================================ */
export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();

    const newUser = await User.create(user);
    return JSON.parse(JSON.stringify(newUser));
  } catch (error) {
    console.error("Create user failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to create user"
    );
  }
}

/* ===============================
   GET USER BY ID
================================ */
export async function getUserById({ userId }: GetUserByIdParams) {
  try {
    await connectToDatabase();

    const user = await User.findById(userId);
    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Get user failed:", error);
    return null;
  }
}

/* ===============================
   UPDATE USER
================================ */
export async function updateUser({ clerkId, user, path }: UpdateUserParams) {
  try {
    const { userId } = await auth();
    if (!userId) throw new Error("Unauthorized");

    await connectToDatabase();

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, {
      new: true,
    });
    if (!updatedUser) throw new Error("User not found");

    return JSON.parse(JSON.stringify(updatedUser));
  } catch (error) {
    console.error("Update user failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to update user"
    );
  }
}

/* ===============================
   DELETE USER
================================ */
export async function deleteUser({ clerkId }: DeleteUserParams) {
  try {
    await connectToDatabase();

    const userToDelete = await User.findOne({ clerkId });

    if (!userToDelete) {
      throw new Error("User not found");
    }

    // Delete all events of user
    await Event.deleteMany({ _id: { $in: userToDelete.events } });

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id);
    return JSON.parse(JSON.stringify(deletedUser));
  } catch (error) {
    console.error("Delete user failed:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to delete user"
    );
  }
}

/* ===============================
   GET USER BY CLERK ID
================================ */
export async function getUserByClerkId(clerkId: string) {
  try {
    await connectToDatabase();

    const user = await User.findOne({ clerkId });
    if (!user) return null;

    return JSON.parse(JSON.stringify(user));
  } catch (error) {
    console.error("Get user by Clerk ID failed:", error);
    return null;
  }
}
