import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/database";
import Event from "@/lib/database/models/event.model";

// GET single event
export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectToDatabase();
    const event = await Event.findById(id)
      .populate("organizer")
      .populate("category");

    if (!event)
      return NextResponse.json({ message: "Event not found" }, { status: 404 });

    return NextResponse.json(event, { status: 200 });
  } catch (err) {
    console.error("GET /api/events/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE event
export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  try {
    await connectToDatabase();
    const deleted = await Event.findByIdAndDelete(id);

    if (!deleted)
      return NextResponse.json({ message: "Event not found" }, { status: 404 });

    return NextResponse.json({ message: "Event deleted" }, { status: 200 });
  } catch (err) {
    console.error("DELETE /api/events/[id] error:", err);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
