import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";

export async function GET() {
  try {
    await connectToDatabase();
    const users = await User.find({}).lean();

    return NextResponse.json({ data: users }, { status: 200 });
  } catch (error) {
    console.error("GET USERS ERROR:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}
