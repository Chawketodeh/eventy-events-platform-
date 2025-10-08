import { IEvent } from "@/lib/database/models/event.model";
import Card from "./Card";
import Pagination from "./Pagination";

type CollectionProps = {
  data: IEvent[];
  emptyTitle: string;
  emptyStateSubtext: string;
  limit: number;
  page: number | string;
  totalPages?: number;
  urlParamName?: string;
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events";
};

const Collection = ({
  data = [],
  emptyTitle,
  emptyStateSubtext,
  page,
  totalPages = 0,
  collectionType = "All_Events",
  urlParamName = "page",
}: CollectionProps) => {
  //  Ensure unique events only
  const uniqueData = Array.from(
    new Map(
      (data || [])
        .filter((item) => item && item._id)
        .map((item) => [item._id, item])
    ).values()
  );

  const hasEvents = uniqueData.length > 0;

  return (
    <div className="flex flex-col items-center gap-10 w-full">
      {/* Show cards if there are events */}
      {hasEvents ? (
        <ul
          className="grid w-full grid-cols-1 gap-5
          sm:grid-cols-2 lg:grid-cols-3 xl:gap-10"
        >
          {uniqueData.map((event, index) => {
            const hasOrderLink = collectionType === "Events_Organized";
            const hidePrice = collectionType === "My_Tickets";

            return (
              <li key={`${event._id}-${index}`} className="flex justify-center">
                <Card
                  event={event}
                  hasOrderLink={hasOrderLink}
                  hidePrice={hidePrice}
                />
              </li>
            );
          })}
        </ul>
      ) : (
        //  Empty state still shows pagination below
        <div className="flex-center wrapper min-h-[200px] w-full flex-col gap-3 rounded-[14px] bg-gray-50 py-28 text-center">
          <h3 className="p-bold-20 md:h5-bold">{emptyTitle}</h3>
          <p className="p-regular-14 text-gray-500">{emptyStateSubtext}</p>
        </div>
      )}

      {/*  Always show pagination (even if no events) */}
      {totalPages > 1 && (
        <Pagination
          urlParamName={urlParamName}
          page={Number(page)} //  force number
          totalPages={Number(totalPages) || 1} //  make sure it’s not 0 or undefined
        />
      )}
    </div>
  );
};

export default Collection;
