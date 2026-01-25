# Copilot Instructions for Eventy

**Project**: Event Management Platform built with Next.js 16, TypeScript, MongoDB, Clerk Auth, and Stripe Payments

## Architecture Overview

### Tech Stack
- **Frontend**: Next.js 16 (App Router), React 19, TailwindCSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions ("use server")
- **Database**: MongoDB + Mongoose with models in `lib/database/models/`
- **Auth**: Clerk (with admin role via `publicMetadata.isAdmin`)
- **Payments**: Stripe webhooks at `/api/webhook/stripe`
- **File Upload**: UploadThing for image uploads via `/api/uploadthing`
- **Validation**: Zod schemas in `lib/validator.ts`

### Key Service Boundaries

1. **Authentication & Authorization** (`lib/isAdminUser.ts`, `middleware.ts`)
   - Admin routes check `sessionClaims.isAdmin` in middleware (string "true" or boolean)
   - User role stored in Clerk's `publicMetadata`
   - Non-authenticated users redirected to `/sign-in`

2. **Database Connection** (`lib/database/index.ts`)
   - MongoDB connection cached globally to avoid reconnects in serverless
   - Connection timeout: 5 seconds max
   - Database name hardcoded: `"eventy"`

3. **Server Actions** (`lib/actions/*.actions.ts`)
   - All mutations use "use server" directive
   - Always call `connectToDatabase()` first
   - Use `revalidatePath(path)` after mutations for cache invalidation
   - Wrap in try-catch + `handleError()` utility
   - Return serialized JSON: `JSON.parse(JSON.stringify(data))`

4. **API Routes** (`app/api/*/route.ts`)
   - GET endpoints return NextResponse.json()
   - Use searchParams for filters (query, category, page)
   - Return 500 error on exceptions with descriptive messages

## Critical Patterns

### Creating Models & Types
1. Define **Mongoose interface** extending `Document` in `lib/database/models/event.model.ts`
   - Use `Types.ObjectId` for references (not inline objects)
   - Don't redefine `_id` in interface (Document provides it)
   - Populate references with `query.populate({ path, model, select })`

2. Create **type definitions** in `types/index.ts`
   - Named params pattern: `CreateEventParams`, `UpdateEventParams`, `DeleteEventParams`
   - Include `path: string` for `revalidatePath()` in mutations

### Server Actions Pattern
```typescript
"use server";

export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    const { userId: clerkUserId, sessionClaims } = await auth();
    if (!clerkUserId) throw new Error("Unauthorized");

    await connectToDatabase();
    const newRecord = await Model.create({ ...fields });
    revalidatePath(path);
    return JSON.parse(JSON.stringify(newRecord));
  } catch (error) {
    handleError(error);
  }
}
```

### Form Validation Pattern
- Define Zod schema in `lib/validator.ts`
- Use `@hookform/resolvers` in components: `zodResolver(schema)`
- Date fields: wrap form state in Date constructor on submission
- Geographic coords: store as optional `latitude`/`longitude` (numbers)

### Component Patterns
- **Client components**: Mark with "use client" for interactive forms
- **Server components**: Leave unmarked (default) for data fetching
- **Form uploads**: Use `useUploadThing()` hook for files before submission
- **UI components**: Import from `@/components/ui/` (shadcn prebuilt)

## Cross-Component Communication

1. **URL Parameters for Filters**
   - Query: `/api/events?query=term&category=id&page=1`
   - Always parse as `Number()` for page, use `.get("query") || ""`

2. **Organizer-Event Relationship**
   - Events reference User via `organizer: Types.ObjectId`
   - Populate with `{ path: "organizer", model: User, select: "_id clerkId firstName lastName" }`
   - Extract Clerk user metadata: `sessionClaims.firstName`, `sessionClaims.lastName`, `sessionClaims.email`

3. **Category Lookup**
   - Case-insensitive search: `Category.findOne({ name: { $regex: name, $options: "i" } })`
   - Store as ObjectId reference in events

## Build & Development

### Commands
```bash
npm run dev          # Start dev server on localhost:3000
npm run build        # Build for production
npm start            # Run production server
```

### Environment Variables
- `MONGODB_URI` - MongoDB connection string
- `CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY` - Clerk authentication
- `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` - Google Maps (loaded in root layout)
- `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` - Stripe payments
- `UPLOADTHING_SECRET`, `UPLOADTHING_APP_ID` - File uploads

### Global Middleware
- Webhook routes bypass Clerk: `/api/webhook/clerk`, `/api/webhook/stripe`, `/api/uploadthing`
- Public routes: `/`, `/events/:id`, `/sign-in`, `/sign-up`
- Admin redirect: Check `isAdmin` flag in middleware before allowing `/admin/*`

## Route Structure

- **(auth)**: Sign-in/Sign-up with Clerk Elements
- **(root)**: Main app with public event listing, user profile, orders
- **admin/**: Event management, user management (admin-only)
- **api/events**: CRUD operations
- **api/users**: User CRUD
- **api/webhook/**: Clerk user sync, Stripe payment webhooks
- **api/uploadthing/**: File upload handler

## Common Tasks

**Adding a new event field**:
1. Update `IEvent` interface in `lib/database/models/event.model.ts`
2. Add field to `EventSchema` with type and validation
3. Update `CreateEventParams`/`UpdateEventParams` in `types/index.ts`
4. Add to Zod schema in `lib/validator.ts`
5. Update form in `components/shared/EventForm.tsx`

**Adding admin-only route**:
1. Verify `isAdmin` in `middleware.ts` before allowing access
2. Double-check Clerk admin flag: `sessionClaims?.isAdmin === true || === "true"`
3. Use `isAdminUser()` helper in Server Actions if needed

**Syncing user with Clerk webhook**:
- Clerk webhooks hit `/api/webhook/clerk` and create User record if missing
- Extract fields from webhook payload: `clerkId`, `firstName`, `lastName`, `email`
