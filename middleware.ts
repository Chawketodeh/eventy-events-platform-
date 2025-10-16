import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Ignore webhooks and uploads
const isIgnored = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

// 👇 publicRoutes: accessible without auth
const isPublic = createRouteMatcher([
  "/",
  "/events/:id",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhook/clerk(.*)",
  "/api/webhook/stripe(.*)",
  "/api/uploadthing(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  if (isIgnored(req)) return NextResponse.next();

  const { userId, sessionClaims } = await auth();

  //  Read admin flag correctly
  const isAdmin =
    sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

  console.log(" Middleware — Admin flag:", isAdmin);

  const url = new URL(req.url);

  //  If admin logs in and tries to access home or sign-in, redirect to /admin
  if (
    (url.pathname === "/" || url.pathname.startsWith("/sign-in")) &&
    isAdmin
  ) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  //  Block non-admin users from /admin routes
  if (url.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  //  Protect private routes
  if (!isPublic(req)) await auth.protect();

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
