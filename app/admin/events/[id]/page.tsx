"use client";

export const dynamic = "force-dynamic";
export const revalidate = false;
export const fetchCache = "force-no-store";

import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import Link from "next/link";

type Event = {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  category?: { name: string };
  organizer?: { firstName: string; lastName: string };
  location?: string;
  startDateTime?: string;
  endDateTime?: string;
  isFree?: boolean;
  price?: number;
  url?: string;
};

// Inner component wrapped in Suspense
function EventContent() {
  const params = useParams<{ id: string }>();
  const id = params?.id;

  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let ignore = false;

    const fetchEvent = async () => {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        if (!ignore) setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    fetchEvent();
    return () => {
      ignore = true;
    };
  }, [id]);

  if (!id) return <p className="text-center py-20">Invalid event ID.</p>;
  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="animate-pulse text-gray-500">Loading event…</p>
      </div>
    );
  if (!event) return <p className="text-center py-20">Event not found.</p>;

  return (
    <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Event Details</h1>
          <Button asChild variant="outline">
            <Link href="/admin/events">← Back to Dashboard</Link>
          </Button>
        </div>

        {/* Event content */}
        <img
          src={event.imageUrl}
          alt={event.title}
          className="w-full h-64 object-cover rounded-xl mb-4"
        />

        <h2 className="text-2xl font-bold mb-2">{event.title}</h2>
        <p className="text-gray-500 mb-2">
          {event.category &&
          typeof event.category === "object" &&
          "name" in event.category
            ? event.category.name
            : "Uncategorized"}{" "}
          ·{" "}
          {event.organizer &&
          typeof event.organizer === "object" &&
          "firstName" in event.organizer
            ? `${event.organizer.firstName} ${event.organizer.lastName || ""}`
            : "Unknown organizer"}
        </p>
        <p className="text-gray-600 mb-4">{event.description}</p>

        <div className="mb-4 space-y-1">
          <p>📍 {event.location}</p>
          <p>
            🗓️ {new Date(event.startDateTime ?? "").toLocaleString()} →{" "}
            {new Date(event.endDateTime ?? "").toLocaleString()}
          </p>
          <p>
            💰 {event.isFree ? "Free" : `$${event.price}`} |{" "}
            <a
              href={event.url}
              className="text-blue-600 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Visit link
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}

export default function ViewEventPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin />
      <Suspense fallback={<p className="text-center py-20">Loading page...</p>}>
        <EventContent />
      </Suspense>
      <Footer />
    </div>
  );
}
