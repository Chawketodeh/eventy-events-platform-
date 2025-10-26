import { getAllEvents } from "@/lib/actions/event.actions";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") || "";
    const category = searchParams.get("category") || "";
    const page = Number(searchParams.get("page")) || 1;

    const result = await getAllEvents({ query, category, page, limit: 100 });

    // always return a valid JSON response
    return NextResponse.json(result?.data || []);
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json(
      { error: "Failed to fetch events" },
      { status: 500 }
    );
  }
}
