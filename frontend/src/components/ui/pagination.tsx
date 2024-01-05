import { Button } from "./button";
import { cn } from "@/lib/utils";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronsLeftIcon,
  ChevronsRightIcon,
  MoreHorizontal,
} from "lucide-react";
import { usePagination } from "@mantine/hooks";

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
  const pagination = usePagination({
    total: totalPages,
    page: currentPage,
    siblings: 3,
    onChange: onChangePage,
  });

  const isFirst = pagination.active === 1;
  const isLast = pagination.active === totalPages;

  const handleChangePage = (page: number) => {
    onChangePage(page);
  };

  return (
    <div className="flex gap-1 items-center">
      <Button
        size="icon"
        onClick={pagination.first}
        variant="outline"
        className="pr-[1px]"
        disabled={isFirst}
      >
        <ChevronsLeftIcon size={15} />
      </Button>
      <Button
        size="icon"
        onClick={pagination.previous}
        variant="outline"
        className="pr-[1px]"
        disabled={isFirst}
      >
        <ChevronLeftIcon size={15} />
      </Button>
      {pagination.range.map((page, i) => {
        if (page === "dots") {
          return <MoreHorizontal key={i} size={15} className="mx-1" />;
        }

        return (
          <PagionationItem
            key={i}
            active={page === pagination.active}
            page={page}
            onClick={handleChangePage}
          />
        );
      })}
      <Button
        size="icon"
        onClick={pagination.next}
        variant="outline"
        className="pr-[1px]"
        disabled={isLast}
      >
        <ChevronRightIcon size={15} />
      </Button>
      <Button
        size="icon"
        onClick={pagination.last}
        variant="outline"
        className="pr-[1px]"
        disabled={isLast}
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
