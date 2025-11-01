import AdminUsersPageClient from "./AdminUsersPageClient";

// app/admin/users/page.tsx
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ManageUsersPage() {
  return <AdminUsersPageClient />;
}
