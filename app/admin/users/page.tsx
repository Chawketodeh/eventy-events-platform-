"use client";
import { useEffect, useState } from "react";
import { getAllUsers } from "@/lib/actions/user.actions"; // we’ll make this
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const result = await getAllUsers();
      setUsers(result || []);
      setLoading(false);
    })();
  }, []);

  if (loading) return <p>Loading users...</p>;

  return (
    <section className="wrapper py-10">
      <h2 className="h3-bold mb-6">Manage Users</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Email</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td className="border p-2">
                {user.firstName} {user.lastName}
              </td>
              <td className="border p-2">{user.email}</td>
              <td className="border p-2">
                <Link href={`/admin/users/${user._id}`}>
                  <Button size="sm">Edit</Button>
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
