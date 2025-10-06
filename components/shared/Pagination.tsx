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

  const onClick = (btnType: "next" | "prev") => {
    let newPage = Number(page);

    if (btnType === "next" && newPage < totalPages) newPage++;
    if (btnType === "prev" && newPage > 1) newPage--;

    const newUrl = formUrlQuery({
      params: searchParams.toString(),
      key: urlParamName,
      value: String(newPage),
    });

    router.push(newUrl, { scroll: false });
  };

  return (
    <div className="flex justify-center items-center gap-3 mt-8">
      <Button
        className="w-28"
        size="lg"
        variant="outline"
        onClick={() => onClick("prev")}
        disabled={Number(page) <= 1}
      >
        Previous
      </Button>
      <span className="text-sm font-medium text-gray-600">
        Page {page} of {totalPages}
      </span>
      <Button
        className="w-28"
        size="lg"
        variant="outline"
        onClick={() => onClick("next")}
        disabled={Number(page) >= totalPages}
      >
        Next
      </Button>
    </div>
  );
};

export default Pagination;
