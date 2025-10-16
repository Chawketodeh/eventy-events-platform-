import { auth } from "@clerk/nextjs/server";
import { createClerkClient } from "@clerk/backend";

export async function isAdminUser() {
  const { userId } = await auth();
  if (!userId) return false;

  const clerk = createClerkClient({ secretKey: process.env.CLERK_SECRET_KEY! });
  const user = await clerk.users.getUser(userId);
  return user?.publicMetadata?.isAdmin === true;
}
console.log(" Clerk Secret Loaded:", !!process.env.CLERK_SECRET_KEY);
