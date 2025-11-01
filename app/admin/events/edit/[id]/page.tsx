"use client";

export const dynamic = "force-dynamic";
export const revalidate = false;
export const fetchCache = "force-no-store";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useAuth } from "@clerk/nextjs";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import EventForm from "@/components/shared/EventForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface EventData {
  _id: string;
  title: string;
  description: string;
  imageUrl: string;
  location: string;
  startDateTime: string;
  endDateTime: string;
  isFree: boolean;
  price: number;
  url: string;
  category?: { _id: string; name: string };
  organizer?: { firstName: string; lastName: string };
}

export default function EditEventPage() {
  const { id } = useParams();
  const { userId } = useAuth();
  const [event, setEvent] = useState<EventData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEvent() {
      try {
        const res = await fetch(`/api/events/${id}`);
        if (!res.ok) throw new Error("Failed to fetch event");
        const data = await res.json();
        setEvent(data);
      } catch (error) {
        console.error("Error fetching event:", error);
      } finally {
        setLoading(false);
      }
    }
    if (id) fetchEvent();
  }, [id]);

  if (loading) return <p className="text-center py-20">Loading event...</p>;
  if (!event) return <p className="text-center py-20">Event not found.</p>;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
          {/* Header section inside container */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Edit Event</h1>
            <Button asChild variant="outline">
              <Link href="/admin/events">← Back to Dashboard</Link>
            </Button>
          </div>

          {/* Event Form */}
          <EventForm
            type="Update"
            userId={userId!}
            event={event as any}
            eventId={event._id}
          />
        </div>
      </main>

      <Footer />
    </div>
  );
}
