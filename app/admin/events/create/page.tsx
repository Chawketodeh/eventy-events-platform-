"use client";

// These lines must be exactly like this:
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "edge";

import { Suspense } from "react";
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import EventForm from "@/components/shared/EventForm";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useAuth } from "@clerk/nextjs";

export default function AdminCreateEventPage() {
  const { userId } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Create Event</h1>
            <Button asChild variant="outline">
              <Link href="/admin/events">← Back to Events</Link>
            </Button>
          </div>

          <Suspense fallback={<p>Loading form...</p>}>
            {userId ? (
              <EventForm type="Create" userId={userId} />
            ) : (
              <p className="text-gray-500">Loading user...</p>
            )}
          </Suspense>
        </div>
      </main>

      <Footer />
    </div>
  );
}
