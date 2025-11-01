// app/admin/users/AdminUsersPageClient.tsx
"use client";

import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminUsersPageClient() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUsers() {
      try {
        const res = await fetch("/api/users", { cache: "no-store" });
        const data = await res.json();
        setUsers(data.data || []);
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    }
    fetchUsers();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await fetch(`/api/users/${id}`, { method: "DELETE" });
      setUsers((prev) => prev.filter((u) => u._id !== id));
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <Button asChild variant="outline">
              <Link href="/admin">← Back to Dashboard</Link>
            </Button>
          </div>

          {loading ? (
            <p className="text-center">Loading...</p>
          ) : users.length === 0 ? (
            <p className="text-center text-gray-500">No users found.</p>
          ) : (
            <div className="overflow-x-auto shadow-md rounded-xl bg-white">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 text-gray-700">
                    <th className="p-3 border-b">Photo</th>
                    <th className="p-3 border-b">Name</th>
                    <th className="p-3 border-b">Email</th>
                    <th className="p-3 border-b text-center">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-50">
                      <td className="p-3 border-b">
                        <Image
                          src={
                            user.photo ||
                            "/assets/icons/profile-placeholder.svg"
                          }
                          alt="user"
                          width={40}
                          height={40}
                          className="rounded-full"
                        />
                      </td>
                      <td className="p-3 border-b">
                        {user.firstName || "—"} {user.lastName || ""}
                      </td>
                      <td className="p-3 border-b">{user.email}</td>
                      <td className="p-3 border-b text-center space-x-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/users/edit/${user._id}`}>
                            Edit
                          </Link>
                        </Button>
                        <Button
                          onClick={() => handleDelete(user._id)}
                          size="sm"
                          variant="destructive"
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
