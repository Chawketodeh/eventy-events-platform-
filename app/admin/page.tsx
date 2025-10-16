import { isAdminUser } from "@/lib/isAdminUser";
import { redirect } from "next/navigation";

export default async function AdminPage() {
  const isAdmin = await isAdminUser();

  if (!isAdmin) {
    redirect("/"); //  redirect non-admins to home instead
  }

  return (
    <div className="p-10">
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>
      <p>Welcome back, Admin </p>
    </div>
  );
}
