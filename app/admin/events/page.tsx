"use client";
import { useEffect, useState } from "react";
import { getAllEvents, deleteEvent } from "@/lib/actions/event.actions";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminEventsPage() {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getAllEvents({
        query: "",
        category: "",
        limit: 100,
        page: 1,
      });
      setEvents(result?.data || []);
      setLoading(false);
    })();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this event?")) return;
    await deleteEvent({ eventId: id, path: "/admin/events" });
    setEvents(events.filter((e) => e._id !== id));
  };

  if (loading) return <p>Loading events...</p>;

  return (
    <section className="wrapper py-10">
      <h2 className="h3-bold mb-6">Manage Events</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Title</th>
            <th className="border p-2">Category</th>
            <th className="border p-2">Organizer</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {events.map((event) => (
            <tr key={event._id}>
              <td className="border p-2">{event.title}</td>
              <td className="border p-2">{event.category?.name}</td>
              <td className="border p-2">
                {event.organizer?.firstName} {event.organizer?.lastName}
              </td>
              <td className="border p-2 space-x-2">
                <Link href={`/events/${event._id}`}>
                  <Button size="sm" variant="secondary">
                    View
                  </Button>
                </Link>
                <Link href={`/admin/events/${event._id}`}>
                  <Button size="sm">Edit</Button>
                </Link>
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleDelete(event._id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
