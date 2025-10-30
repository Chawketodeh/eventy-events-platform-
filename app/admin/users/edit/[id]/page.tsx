import Header from "@/components/shared/Header";
import Footer from "@/components/shared/Footer";
import { getUserById } from "@/lib/actions/user.actions";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import EditUserForm from "@/components/admin/EditUserForm";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function EditUserPage({ params }: PageProps) {
  const { id } = await params; //  await the params Promise
  const user = await getUserById(id);

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

          {/* client component form */}
          <EditUserForm user={user} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
