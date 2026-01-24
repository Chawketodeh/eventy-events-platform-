import { Suspense } from "react";
import AdminLayoutClient from "./AdminLayoutClient";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense fallback={<div>{children}</div>}>
      <AdminLayoutClient>{children}</AdminLayoutClient>
    </Suspense>
  );
}
