import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getAllUsers, deleteUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";

export default async function ManageUsersPage() {
  const users = await getAllUsers();

  // 🔥 Filter out admin users
  const filteredUsers = users?.filter(
    (user: any) => user.email !== "admin@example.com" && !user.isAdmin
  );

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Back to dashboard */}
          <div className="mb-6 flex justify-between items-center">
            <h1 className="text-3xl font-bold">Manage Users</h1>
            <Button asChild variant="outline">
              <Link href="/admin">← Back to Dashboard</Link>
            </Button>
          </div>

          <p className="text-gray-600 mb-8 text-center">
            View, edit or delete platform users
          </p>

          {!filteredUsers?.length ? (
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
                  {filteredUsers.map((user: any) => (
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

                      <td className="p-3 border-b">
                        {user.email || "No email"}
                      </td>

                      <td className="p-3 border-b text-center space-x-3">
                        <Button asChild size="sm" variant="outline">
                          <Link href={`/admin/users/edit/${user._id}`}>
                            Edit
                          </Link>
                        </Button>

                        <form
                          action={async () => {
                            "use server";
                            await deleteUser(user.clerkId);
                          }}
                        >
                          <Button type="submit" size="sm" variant="destructive">
                            Delete
                          </Button>
                        </form>
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
