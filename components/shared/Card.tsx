import { IEvent } from "@/lib/database/models/event.model";
import { formatDateTime } from "@/lib/utils";
import { auth } from "@clerk/nextjs/server";
import { connectToDatabase } from "@/lib/database";
import User from "@/lib/database/models/user.model";
import Image from "next/image";
import Link from "next/link";
import { DeleteConfirmation } from "./DeleteConfirmation";

type CardProps = {
  event: IEvent;
  hasOrderLink?: boolean;
  hidePrice?: boolean;
};

const Card = async ({ event, hasOrderLink, hidePrice }: CardProps) => {
  const { userId: clerkUserId, sessionClaims } = await auth();

  // Check for admin privileges (from Clerk metadata)
  const isAdmin =
    sessionClaims?.isAdmin === true || sessionClaims?.isAdmin === "true";

  // Check event ownership by comparing MongoDB _ids
  let isEventCreator = false;
  if (clerkUserId && event.organizer) {
    await connectToDatabase();
    const currentUser = await User.findOne({ clerkId: clerkUserId }).select(
      "_id",
    );
    // Compare MongoDB _id (as string) with event organizer ObjectId
    isEventCreator = currentUser?._id.toString() === event.organizer.toString();
  }

  // Only show edit/delete for the event owner OR admin
  const canManageEvent = isEventCreator || isAdmin;

  return (
    <div
      className="group relative flex min-h-[380px]
  w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md
   transition-all hover:shadow-lg md:min-h-[438px]"
    >
      <Link
        href={`/events/${event._id}`}
        style={{ backgroundImage: `url(${event.imageUrl})` }}
        className="flex-center grow bg-gray-50 bg-cover bg-center text-gray-500"
      />

      {/*  Only show for admins or event owners */}
      {canManageEvent && !hidePrice && (
        <div
          className="absolute right-2 top-2 flex flex-col gap-4
        rounded-xl bg-white p-3 shadow-sm transition-all"
        >
          <Link href={`/events/${event._id}/update`}>
            <Image
              src="/assets/icons/edit.svg"
              alt="edit"
              width={20}
              height={20}
            />
          </Link>
          <DeleteConfirmation eventId={event._id.toString()} />
        </div>
      )}

      <div className="flex min-h-[230px] flex-col gap-3 p-5 md:gap-4">
        {!hidePrice && (
          <div className="flex gap-2">
            <span className="p-semibold-14 w-min rounded-full bg-green-100 px-4 py-1 text-green-60">
              {event.isFree ? "FREE" : `$${event.price}`}
            </span>
            {event.category &&
              typeof event.category === "object" &&
              "name" in event.category && (
                <p
                  className="p-semibold-14 w-min rounded-full bg-gray-500/10 px-4 py-1
               text-gray-500 line-clamp-1"
                >
                  {(event.category as any).name}
                </p>
              )}
          </div>
        )}

        <p className="p-medium-16 p-medium-18 text-gray-500">
          {formatDateTime(event.startDateTime).dateTime}
        </p>

        <Link href={`/events/${event._id}`}>
          <p className="p-medium-16 md:p-medium-20 line-clamp-2 flex-1 text-black">
            {event.title}
          </p>
        </Link>

        <div className="flex-between w-full">
          <p className="p-medium-14 md:p-medium-16 text-gray-600">Organizer</p>

          {hasOrderLink && (
            <Link href={`/orders?eventId=${event._id}`} className="flex gap-2">
              <p className="text-primary-500">Order details</p>
              <Image
                src="/assets/icons/arrow.svg"
                alt="arrow"
                width={10}
                height={10}
              />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
};

export default Card;
