"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const searchParams = useSearchParams();
  const router = useRouter();

  // If ?mode=user, redirect to home page
  useEffect(() => {
    if (searchParams.get("mode") === "user") {
      router.replace("/");
    }
  }, [searchParams, router]);

  return <div>{children}</div>;
}
