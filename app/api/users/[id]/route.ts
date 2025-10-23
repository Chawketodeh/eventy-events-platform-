import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

// PUT /api/users/[id]
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    await connectToDatabase();

    const updatedUser = await User.findByIdAndUpdate(params.id, body, {
      new: true,
    });

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(updatedUser);
  } catch (err) {
    console.error("Error updating user:", err);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
