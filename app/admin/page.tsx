import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AdminPage() {
  return (
    <div className="h-screen flex flex-col">
      {/*  Same header as user page */}
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-3xl font-bold mb-3">Admin Dashboard</h1>
          <p className="text-gray-600 mb-6">Welcome back, Admin </p>

          <div className="flex justify-center gap-4">
            <Button asChild>
              <Link href="/admin/events">Manage Events</Link>
            </Button>

            <Link href="/admin/users">
              <Button className="w-full md:w-64 bg-secondary" variant="outline">
                Manage Users
              </Button>
            </Link>

            {/*  Button to switch to user view */}
            <Button variant="outline" asChild>
              <Link href="/">View as User</Link>
            </Button>
          </div>
        </div>
      </main>

      {/*  Same footer */}
      <Footer />
    </div>
  );
}
