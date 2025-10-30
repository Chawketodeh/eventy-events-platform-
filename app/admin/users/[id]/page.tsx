import React from "react";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function UserPage({ params }: PageProps) {
  const { id } = await params;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">User ID: {id}</h1>
      <p>This is the admin user detail page.</p>
    </div>
  );
}
