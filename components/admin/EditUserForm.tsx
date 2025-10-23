"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUploader } from "@/components/shared/FileUploader";
import Image from "next/image";
import { useUploadThing } from "@/lib/uploadthing";

export default function EditUserForm({ user }: { user: any }) {
  const router = useRouter();
  const [files, setFiles] = useState<File[]>([]);
  const [preview, setPreview] = useState<string>(user.photo || "");
  const [isSaving, setIsSaving] = useState(false);

  const { startUpload } = useUploadThing("imageUploader");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsSaving(true);

    try {
      const formData = new FormData(e.currentTarget);

      // Step 1: upload image if a new one was dropped
      let photoUrl = preview;
      if (files.length > 0) {
        const uploaded = await startUpload(files);
        if (uploaded && uploaded[0]) photoUrl = uploaded[0].url;
      }

      // Step 2: prepare data for update
      const updatedUser = {
        firstName: formData.get("firstName")?.toString() || "",
        lastName: formData.get("lastName")?.toString() || "",
        userName: formData.get("userName")?.toString() || "",
        photo: photoUrl,
      };

      // Step 3: call your existing API route to update
      const res = await fetch(`/api/users/${user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedUser),
      });

      if (!res.ok) throw new Error("Failed to update user");
      router.push("/admin/users");
    } catch (err) {
      console.error("Error saving user:", err);
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="flex justify-center">
        <Image
          src={preview || "/assets/icons/profile-placeholder.svg"}
          alt="profile"
          width={80}
          height={80}
          className="rounded-full border border-gray-300"
        />
      </div>

      <FileUploader
        onFieldChange={(url) => setPreview(url)}
        imageUrl={preview}
        setFiles={setFiles}
      />

      <Input
        name="firstName"
        defaultValue={user.firstName}
        placeholder="First name"
      />
      <Input
        name="lastName"
        defaultValue={user.lastName}
        placeholder="Last name"
      />
      <Input
        name="userName"
        defaultValue={user.userName}
        placeholder="Username"
      />

      <Button type="submit" className="mt-4 w-full" disabled={isSaving}>
        {isSaving ? "Saving..." : "Save Changes"}
      </Button>
    </form>
  );
}
