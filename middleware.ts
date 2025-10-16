import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Ignore webhooks and uploads
const isIgnored = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

// Public routes (accessible without auth)
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

  // Correctly read admin flag
  const isAdmin =
    sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

  const url = new URL(req.url);

  console.log("Middleware — Admin flag:", isAdmin, "URL:", url.pathname);

  // Always redirect admin to /admin when visiting home
  if (url.pathname === "/" && isAdmin) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  //  Block non-admins from /admin
  if (url.pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // Protect private routes
  if (!isPublic(req)) await auth.protect();

  return NextResponse.next();
});

export const config = {
  matcher: [
    // Match everything except static files
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
