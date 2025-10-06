import Collection from "@/components/shared/Collection";
import { Button } from "@/components/ui/button";
import { getEventsByUser } from "@/lib/actions/event.actions";
import { getOrdersByUser } from "@/lib/actions/order.actions";
import { IOrder } from "@/lib/database/models/order.model";
import { SearchParamProps } from "@/types";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";

const profilePage = async ({ searchParams }: SearchParamProps) => {
  const sessionsClaims = await auth();
  const userId = sessionsClaims?.userId as string;

  const ordersPage = Number(searchParams?.ordersPage) || 1;
  const eventsPage = Number(searchParams?.eventsPage) || 1;

  const orders = await getOrdersByUser({ userId, page: 1 });

  const orderedEvents = orders?.data.map((order: IOrder) => order.event) || [];
  const organizedEvents = await getEventsByUser({ userId, page: 1 });
  return (
    <>
      {/*My Tickets*/}
      <section
        className="bg-secondary bg-dotted-pattern 
      bg-cover bg-center py-5 md:py-10"
      >
        <div
          className="wrapper flex items-center
        justify-center sm:justify-between"
        >
          <h3 className="h3-bold text-center sm:text-left">My Tickets</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/#events"> Explore more events</Link>
          </Button>
        </div>
      </section>

      <section className="wrapper my-8">
        <Collection
          data={orderedEvents}
          emptyTitle="No events tcikets purchased yet"
          emptyStateSubtext="No worries - plenty of exciting events to explore! "
          collectionType="My_Tickets"
          limit={3}
          page={ordersPage}
          urlParamName="ordersPage"
          totalPages={orders?.totalPages}
        />
      </section>

      <section
        className="bg-secondary bg-dotted-pattern 
      bg-cover bg-center py-5 md:py-10"
      >
        <div
          className="wrapper flex items-center
        justify-center sm:justify-between"
        >
          <h3 className="h3-bold text-center sm:text-left">Events Organized</h3>
          <Button asChild size="lg" className="button hidden sm:flex">
            <Link href="/events/create"> Create new events</Link>
          </Button>
        </div>
      </section>
      <section className="wrapper my-8">
        <Collection
          data={organizedEvents?.data}
          emptyTitle="No events have been created yet"
          emptyStateSubtext="Go create some now "
          collectionType="Events_Organized"
          limit={6}
          page={1}
          urlParamName="eventsPage"
          totalPages={organizedEvents?.totalPages}
        />
      </section>

      {/*events organized*/}
    </>
  );
};
export default profilePage;
