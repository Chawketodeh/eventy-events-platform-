"use client";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPageClient() {
  return (
    <div className="h-screen flex flex-col">
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome back, Admin</p>

          <div className="flex justify-center gap-4">
            <Button
              asChild
              className="transition-all duration-200 hover:scale-105 hover:bg-primary-600"
            >
              <Link href="/admin/events">Manage Events</Link>
            </Button>

            <Button
              variant="outline"
              asChild
              className="transition-all duration-200 hover:bg-gray-200 hover:scale-105"
            >
              <Link href="/admin/users">Manage Users</Link>
            </Button>

            <Button
              variant="outline"
              onClick={() => {
                const url = new URL(window.location.origin);
                url.searchParams.set("mode", "user");
                window.location.href = url.toString();
              }}
              className="transition-all duration-200 hover:bg-gray-200 hover:scale-105"
            >
              View as User
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
