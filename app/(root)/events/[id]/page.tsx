import CheckoutButton from "@/components/shared/CheckoutButton";
import Collection from "@/components/shared/Collection";
import {
  getEventById,
  getRelatedEventsByCategory,
} from "@/lib/actions/event.actions";
import { formatDateTime } from "@/lib/utils";
import Image from "next/image";
import EventMap from "@/components/shared/EventMap";

//  Next.js 15.5+ expects both `params` and `searchParams` as Promises
type PageProps = {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const EventDetails = async ({ params, searchParams }: PageProps) => {
  //  Await both params and searchParams
  const { id } = await params;
  const resolvedSearchParams = await searchParams;

  if (!id) {
    return <p className="text-center text-red-500">Event not found</p>;
  }

  const event = await getEventById(id);

  const relatedEvents = await getRelatedEventsByCategory({
    categoryId: event.category._id,
    eventId: event._id,
    page: resolvedSearchParams?.page as string,
  });

  return (
    <>
      <section className="flex justify-center bg-primary-50 bg-dotted-pattern bg-contain">
        <div className="grid grid-cols-1 md:grid-cols-2 2xl:max-w-7xl">
          <Image
            src={event.imageUrl}
            alt="hero image"
            height={1000}
            width={1000}
            className="h-full min-h-[300px] object-cover object-center"
          />

          <div className="flex w-full flex-col gap-8 p-5 md:p-10">
            <div className="flex flex-col gap-6">
              <h2 className="h2-bold">{event.title}</h2>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="flex gap-3">
                  <p className="p-bold-20 rounded-full bg-green-500/10 px-5 py-2 text-green-700">
                    {event.isFree ? "FREE" : `$${event.price}`}
                  </p>
                  <p className="p-medium-16 rounded-full bg-gray-500/10 px-4 py-2.5 text-gray-500">
                    {event.category?.name || "Uncategorized"}
                  </p>
                </div>

                <p className="p-medium-18 ml-2 mt-2 sm:mt-0">
                  by{" "}
                  <span className="text-primary-500">
                    {event.organizer?.firstName} {event.organizer?.lastName}
                  </span>
                </p>
              </div>
            </div>

            {/* Show checkout or expired message */}
            {new Date(event.endDateTime) < new Date() ? (
              <p className="text-red-500 text-lg">
                Event expired on {formatDateTime(event.endDateTime).dateOnly} at{" "}
                {formatDateTime(event.endDateTime).timeOnly}
              </p>
            ) : (
              <CheckoutButton event={event} />
            )}

            <div className="flex flex-col gap-5">
              <div className="flex gap-2 md:gap-3">
                <Image
                  src="/assets/icons/calendar.svg"
                  alt="calendar"
                  height={32}
                  width={32}
                />
                <div className="p-medium-16 lg:p-regular-20 flex flex-wrap items-center">
                  <p>
                    {formatDateTime(event.startDateTime).dateOnly} -{" "}
                    {formatDateTime(event.startDateTime).timeOnly}
                  </p>
                  <p>
                    {formatDateTime(event.endDateTime).dateOnly} -{" "}
                    {formatDateTime(event.endDateTime).timeOnly}
                  </p>
                </div>
              </div>

              <div className="p-regular-20 flex items gap-3">
                <Image
                  src="/assets/icons/location.svg"
                  alt="location"
                  height={32}
                  width={32}
                />
                <p className="p-medium-16 lg:p-regular-20">{event.location}</p>
              </div>
              {event.latitude && event.longitude && (
                <EventMap lat={event.latitude} lng={event.longitude} />
              )}
            </div>

            <div className="flex flex-col gap-2">
              <p className="p-bold-20 text-gray-500">What you'll learn:</p>
              <p className="p-medium-16 lg:p-regular-18">{event.description}</p>
              <p className="p-medium-16 lg:p-regular-18 truncate text-primary-500 underline">
                {event.url}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Related events */}
      <section className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Related Events</h2>
        <Collection
          data={relatedEvents?.data}
          emptyTitle="No events found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={1}
          totalPages={2}
        />
      </section>
    </>
  );
};

export default EventDetails;
