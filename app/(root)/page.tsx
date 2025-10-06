import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({ searchParams }: SearchParamProps) {
  const page = Number(searchParams?.page) || 1;
  const searchText = (searchParams?.query as string) || "";
  const category = (searchParams?.category as string) || "";

  const events = await getAllEvents({
    query: searchText,
    category,
    limit: 6,
    page,
  });

  return (
    <>
      <section
        className="bg-secondary bg-dotted-pattern 
        bg-contain py-5 md:py-10 "
      >
        <div
          className="wrapper grid grid-cols-1 
        gap-5 md:grid-cols-2 2xl:gap-0"
        >
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
              className="button bg-primary-500 text-primary-foreground 
              sm:w-fit w-full py-5 px-10 text-lg sm:py-2 sm:text-base rounded-full font-semibold "
            >
              <Link href="#events">Get Started</Link>
            </Button>
          </div>
          <Image
            src="/assets/images/hero.png"
            alt="hero"
            width={1000}
            height={1000}
            className="object-contain max-h-[70vh] object-center 2xl:max-h-[50vh] "
          />
        </div>
      </section>
      <section
        id="events"
        className="wrapper my-8 flex flex-col gap-8 md:gap-12 "
      >
        <h2 className="h2-bold ">
          Trusted by <br />
          Thousands of Events{" "}
        </h2>
        <div
          className="flex w-full flex-col 
        gap-5 md:flex-row"
        >
          <Search />
          <CategoryFilter />
        </div>

        <Collection
          data={events?.data}
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
}
