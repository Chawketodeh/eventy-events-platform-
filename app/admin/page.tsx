export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import AdminPageClient from "./AdminPageClient";

export default function AdminPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading admin...</p>}>
      <AdminPageClient />
    </Suspense>
  );
}
