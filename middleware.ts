import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Ignore webhooks & uploads
const isIgnored = createRouteMatcher([
  "/api/webhook/clerk",
  "/api/webhook/stripe",
  "/api/uploadthing",
]);

// Public routes
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
  const isAdmin =
    sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

  const url = new URL(req.url);
  const pathname = url.pathname;
  const isUserMode = url.searchParams.get("mode") === "user";

  console.log(
    "Middleware — Admin flag:",
    isAdmin,
    "URL:",
    pathname,
    "UserMode:",
    isUserMode
  );

  // 1. Admin on home, but not in user mode → send to /admin
  if (pathname === "/" && isAdmin && !isUserMode) {
    return NextResponse.redirect(new URL("/admin", req.url));
  }

  // 2. Admin trying to view as user while on /admin → kick to /
  if (pathname.startsWith("/admin") && isAdmin && isUserMode) {
    const userUrl = new URL("/", req.url);
    userUrl.searchParams.set("mode", "user");
    return NextResponse.redirect(userUrl);
  }

  // 3. Normal users can't open /admin
  if (pathname.startsWith("/admin") && !isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // 4. Protect private routes
  if (!isPublic(req)) await auth.protect();

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
