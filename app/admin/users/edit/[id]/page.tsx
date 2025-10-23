// app/admin/users/edit/[id]/page.tsx
import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getUserById, updateUser } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation"; //  Add this import

export default async function EditUserPage({
  params,
}: {
  params: { id: string };
}) {
  const user = await getUserById(params.id);

  if (!user)
    return (
      <div className="flex flex-col min-h-screen">
        <Header isAdmin />
        <main className="flex-1 flex items-center justify-center">
          <p>User not found.</p>
        </main>
        <Footer />
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen">
      <Header isAdmin />

      <main className="flex-1 bg-secondary bg-dotted-pattern bg-contain py-10 px-6">
        <div className="max-w-lg mx-auto bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Edit User</h1>
            <Button asChild variant="outline">
              <Link href="/admin/users">← Back to Users</Link>
            </Button>
          </div>

          <form
            action={async (formData) => {
              "use server";

              const updatedUser = {
                firstName: formData.get("firstName")?.toString() || "",
                lastName: formData.get("lastName")?.toString() || "",
                userName: formData.get("userName")?.toString() || "",
                photo: formData.get("photo")?.toString() || "",
              };

              //  Update user
              await updateUser(user.clerkId, updatedUser);

              //  Redirect immediately after update
              redirect("/admin/users");
            }}
            className="flex flex-col gap-4"
          >
            <div className="flex justify-center">
              <Image
                src={user.photo || "/assets/icons/profile-placeholder.svg"}
                alt="profile"
                width={80}
                height={80}
                className="rounded-full border border-gray-300"
              />
            </div>

            <Input
              name="firstName"
              defaultValue={user.firstName || ""}
              placeholder="First name"
            />
            <Input
              name="lastName"
              defaultValue={user.lastName || ""}
              placeholder="Last name"
            />
            <Input
              name="userName"
              defaultValue={user.userName || ""}
              placeholder="Username"
            />
            <Input
              name="photo"
              defaultValue={user.photo || ""}
              placeholder="Photo URL"
            />

            <Button type="submit" className="mt-4 w-full">
              Save Changes
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
