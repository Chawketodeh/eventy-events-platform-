// Server entry file
export const dynamic = "force-dynamic";
export const revalidate = 0;

import { Suspense } from "react";
import ManageEventsPageClient from "./ManageEventsPageClient";

export default function AdminEventsPage() {
  return (
    <Suspense fallback={<p className="text-center py-10">Loading events...</p>}>
      <ManageEventsPageClient />
    </Suspense>
  );
}
