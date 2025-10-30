"use client";

export const dynamic = "force-dynamic";
export const revalidate = 0; // disable static generation completely

import { Suspense } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import EventForm from "@/components/shared/EventForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

// Move auth logic inside this component to isolate from prerender
function CreateEventContent() {
  const { userId } = useAuth();

  if (!userId) {
    return <p className="text-center text-gray-500 py-10">Loading user...</p>;
  }

  return (
    <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Create Event</h1>
        <Button asChild variant="outline">
          <Link href="/admin/events">← Back to Events</Link>
        </Button>
      </div>

      <EventForm type="Create" userId={userId} />
    </div>
  );
}

export default function AdminCreateEventPage() {
  return (
    <Suspense fallback={<p className="text-center py-20">Loading page...</p>}>
      <div className="min-h-screen flex flex-col">
        <Header isAdmin />

        <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
          <CreateEventContent />
        </main>

        <Footer />
      </div>
    </Suspense>
  );
}
