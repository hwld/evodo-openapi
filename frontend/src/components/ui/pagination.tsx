import { calcPageRange } from "@/lib/calc-page-range";
import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontal,
} from "lucide-react";

type Props = {
  currentPage: number;
  totalPages: number;
  onChangePage: (page: number) => void;
};
export const Pagination: React.FC<Props> = ({
  currentPage,
  totalPages,
  onChangePage,
}) => {
  const { pageRange, after, before } = calcPageRange({
    currentPage,
    totalPages,
    displayPages: 9,
  });

  const handleChangePage = (page: number) => {
    onChangePage(page);
  };

  const first = currentPage === 1;
  const last = currentPage === totalPages;

  const handleGoFirstPage = () => {
    if (first) {
      return;
    }
    onChangePage(1);
  };

  const handleGoPrevPage = () => {
    if (first) {
      return;
    }
    onChangePage(currentPage - 1);
  };

  const handleGoNextPage = () => {
    if (last) {
      return;
    }
    onChangePage(currentPage + 1);
  };

  const handleGoLastPage = () => {
    if (last) {
      return;
    }
    onChangePage(totalPages);
  };

  return (
    <div className="flex gap-1 items-center">
      <Button
        size="icon"
        onClick={handleGoFirstPage}
        variant="outline"
        className="pr-[1px]"
        disabled={first}
      >
        <ChevronsLeftIcon size={15} />
      </Button>
      <Button
        size="icon"
        onClick={handleGoPrevPage}
        variant="outline"
        className="pr-[1px]"
        disabled={first}
      >
        <ChevronLeftIcon size={15} />
      </Button>
      {before && <MoreHorizontal size={15} className="mx-1" />}
      {pageRange.map((page, i) => {
        return (
          <PagionationItem
            key={i}
            active={page === currentPage}
            page={page}
            onClick={handleChangePage}
          />
        );
      })}
      {after && <MoreHorizontal size={15} className="mx-1" />}
      <Button
        size="icon"
        onClick={handleGoNextPage}
        variant="outline"
        className="pr-[1px]"
        disabled={last}
      >
        <ChevronRightIcon size={15} />
      </Button>
      <Button
        size="icon"
        onClick={handleGoLastPage}
        variant="outline"
        className="pr-[1px]"
        disabled={last}
      >
        <ChevronsRightIcon size={15} />
      </Button>
    </div>
  );
};

type PagionationItemProps = {
  page: number;
  active?: boolean;
  disabled?: boolean;
  onClick?: (page: number) => void;
};
const PagionationItem: React.FC<PagionationItemProps> = ({
  page,
  active,
  onClick,
}) => {
  const handleClick = () => {
    onClick?.(page);
  };

  return (
    <button
      disabled={active}
      className={cn(
        "text-sm flex justify-center items-center w-8 h-8 border border-border rounded select-none transition-colors",
        active
          ? "text-primary-foreground bg-primary pointer-events-none"
          : "pointer-events-auto hover:bg-accent",
      )}
      onClick={handleClick}
    >
      {page}
    </button>
  );
};
