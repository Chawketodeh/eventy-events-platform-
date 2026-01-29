import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { currentUser } from "@clerk/nextjs/server";
import Image from "next/image";
import Link from "next/link";

//  Fix: Next.js 15.5+ expects `searchParams` as a Promise
type PageProps = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

export const dynamic = "force-dynamic";

export default async function Home({ searchParams }: PageProps) {
  const user = await currentUser();
  const userId = user?.id || null;
  const isAdmin = user?.publicMetadata?.isAdmin === true || user?.publicMetadata?.isAdmin === "true";

  //  Await the Promise before using
  const resolvedSearchParams = await searchParams;

  const page = Number(resolvedSearchParams?.page) || 1;
  const searchText = (resolvedSearchParams?.query as string) || "";
  const category = (resolvedSearchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    limit: 6,
    page,
  });

  return (
    <>
      <section className="bg-secondary bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">
              Discover and Book Exciting Events Near You with Eventy!
            </h1>
            <p className="p-regular-20 md:p-regular-24 text-lg">
              Find concerts, workshops, and community gatherings tailored to
              your interests.
            </p>
            <Button
              size="lg"
              asChild
              className="button bg-primary-500 text-primary-foreground sm:w-fit w-full py-5 px-10 text-lg sm:py-2 sm:text-base rounded-full font-semibold"
            >
              <Link href="#events">Get Started</Link>
            </Button>
          </div>

          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="object-contain max-h-[70vh] object-center 2xl:max-h-[50vh]"
          />
        </div>
      </section>

      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12"
      >
        <h2 className="h2-bold">
          Trusted by <br />
          Thousands of Events{" "}
        </h2>

        <div className="flex w-full flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
          emptyTitle="No events found"
          emptyStateSubtext="Come back later"
          collectionType="All_Events"
          limit={6}
          page={page}
          totalPages={events?.totalPages || 0}
          userId={userId}
          isAdmin={isAdmin}
        />
      </section>
    </>
  );
}
