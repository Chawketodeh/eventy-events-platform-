import React from "react";

type PageProps = {
  params: { id: string };
};

export default function UserPage({ params }: PageProps) {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold">User ID: {params.id}</h1>
      <p>This is the admin user detail page.</p>
    </div>
  );
}
