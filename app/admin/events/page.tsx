"use client";

export const dynamic = "force-dynamic";

import { useEffect, useState } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type Event = {
  _id: string;
  title: string;
  imageUrl?: string;
  category?: { name: string };
  organizer?: { firstName: string; lastName: string };
  startDateTime?: string;
  orders?: number;
};

export default function ManageEventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [refresh, setRefresh] = useState(false);

  useEffect(() => {
    async function fetchEvents() {
      try {
        const res = await fetch("/api/events", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch events");
        const data = await res.json();
        setEvents(data.data || data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchEvents();
  }, [refresh]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/events/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setRefresh((r) => !r);
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin />
      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <Button asChild variant="outline">
              <Link href="/admin">← Back to Dashboard</Link>
            </Button>
            <Button asChild>
              <Link href="/admin/events/create">+ Create Event</Link>
            </Button>
          </div>

          <h1 className="text-3xl font-bold mb-6">Manage Events</h1>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {events.map((event) => (
                <div
                  key={event._id}
                  className="border border-gray-200 rounded-2xl shadow-sm bg-white overflow-hidden hover:shadow-md transition-all"
                >
                  <div className="w-full h-48 bg-gray-100">
                    {event.imageUrl ? (
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{event.title}</h2>
                    <p className="text-sm text-gray-600 mb-1">
                      📅{" "}
                      {event.startDateTime
                        ? new Date(event.startDateTime).toLocaleDateString()
                        : "No date"}
                    </p>
                    <p className="text-sm text-gray-500 mb-2">
                      {event.category?.name || "Uncategorized"} ·{" "}
                      {event.organizer?.firstName
                        ? `${event.organizer.firstName} ${
                            event.organizer.lastName || ""
                          }`
                        : "Unknown organizer"}
                    </p>
                    <p className="text-sm text-gray-600 mb-3">
                      🎟️ {event.orders ?? 0} orders
                    </p>

                    <div className="flex justify-between items-center gap-2">
                      <Button variant="outline" asChild size="sm">
                        <Link href={`/admin/events/${event._id}`}>View</Link>
                      </Button>

                      <Button asChild size="sm">
                        <Link href={`/admin/events/edit/${event._id}`}>
                          Edit
                        </Link>
                      </Button>

                      {/* 🗑 Delete with modal */}
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            size="sm"
                            variant="destructive"
                            className="bg-red-600 text-white hover:bg-red-700"
                          >
                            Delete
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Delete "{event.title}"?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. The event will be
                              permanently removed.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(event._id)}
                              className="bg-red-600 hover:bg-red-700 text-white"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
