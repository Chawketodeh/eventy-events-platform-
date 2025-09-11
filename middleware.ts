// middleware.ts
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// 👇 ignoredRoutes: Clerk should fully ignore these (webhooks, uploadthing)
const isIgnored = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

// 👇 publicRoutes: accessible without auth
const isPublic = createRouteMatcher([
  "/",
  "/events/:id",
  // (optional) also list ignored ones here if you want them considered public too
  "/api/webhook/clerk(.*)",
  "/api/webhook/stripe(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  // === ignoredRoutes behavior ===
  if (isIgnored(req)) {
    // Do nothing: no auth checks, no redirects
    return NextResponse.next();
  }

  // === publicRoutes behavior ===
  if (!isPublic(req)) {
    await auth.protect(); // redirect unauthenticated users
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
