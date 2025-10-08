"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "../ui/button";
import { formUrlQuery } from "@/lib/utils";

type PaginationProps = {
  page: number | string;
  totalPages: number;
  urlParamName?: string;
};

const Pagination = ({
  page,
  totalPages,
  urlParamName = "page",
}: PaginationProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  //  Always trust the URL value
  const currentPage =
    Number(searchParams.get(urlParamName)) || Number(page) || 1;

  const onClick = (btnType: "next" | "prev") => {
    let newPage = currentPage;

    if (btnType === "next" && newPage < totalPages) newPage++;
    if (btnType === "prev" && newPage > 1) newPage--;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName,
      value: String(newPage),
    });

    router.push(newUrl, { scroll: false });
  };

  //  Fix logic for disabling buttons
  const disablePrev = currentPage <= 1;
  const disableNext =
    totalPages === 0 || currentPage >= totalPages || currentPage > totalPages;

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <Button
        className="w-28"
        size="lg"
        variant="outline"
        onClick={() => onClick("prev")}
        disabled={disablePrev}
      >
        Previous
      </Button>

      <span className="text-sm font-medium text-gray-600">
        Page {currentPage} of {totalPages || 1}
      </span>

      <Button
        className="w-28"
        size="lg"
        variant="outline"
        onClick={() => onClick("next")}
        disabled={disableNext}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
