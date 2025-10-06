import { createUser, deleteUser, updateUser } from "@/lib/actions/user.actions";
import { createClerkClient } from "@clerk/backend";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SIGNING_SECRET!;

    if (!WEBHOOK_SECRET) {
      throw new Error("Missing CLERK_WEBHOOK_SIGNING_SECRET");
    }

    // Read body as text
    const payload = await req.text();

    // Get headers Clerk sends
    const headerPayload = await headers();

    const svix_id = headerPayload.get("svix-id")!;
    const svix_timestamp = headerPayload.get("svix-timestamp")!;
    const svix_signature = headerPayload.get("svix-signature")!;

    // Verify signature
    const wh = new Webhook(WEBHOOK_SECRET);
    const evt = wh.verify(payload, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as any;

    const eventType = evt.type;
    const { id } = evt.data;

    console.log(" Webhook Event:", eventType);

    // === USER CREATED ===
    if (eventType === "user.created") {
      const { email_addresses, image_url, first_name, last_name, username } =
        evt.data;

      const user = {
        clerkId: id,
        email: email_addresses[0]?.email_address || "",
        userName: username || "", // safe
        firstName: first_name || "", //  safe
        lastName: last_name || "", //  safe
        photo: image_url || "",
      };

      const newUser = await createUser(user);

      const clerkClient = createClerkClient({
        secretKey: process.env.CLERK_SECRET_KEY!,
      });

      if (newUser) {
        await clerkClient.users.updateUserMetadata(id, {
          publicMetadata: {
            userId: newUser._id.toString(),
          },
        });
      }

      return NextResponse.json({ message: "OK", user: newUser });
    }

    // === USER UPDATED ===
    if (eventType === "user.updated") {
      const { image_url, first_name, last_name, username } = evt.data;

      const user = {
        userName: username || "", // default to "" if missing
        firstName: first_name || "", // default to "" if missing
        lastName: last_name || "", // default to "" if missing
        photo: image_url || "",
      };

      const updatedUser = await updateUser(id!, user);

      return NextResponse.json({ message: "OK", user: updatedUser });
    }

    // === USER DELETED ===
    if (eventType === "user.deleted") {
      const deletedUser = await deleteUser(id!);

      return NextResponse.json({ message: "OK", user: deletedUser });
    }

    return new Response("Webhook received", { status: 200 });
  } catch (err) {
    console.error(" Error verifying webhook:", err);
    return new Response("Error verifying webhook", { status: 400 });
  }
}
