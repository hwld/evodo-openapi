import { TaskSearchParams } from "@/routes";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

type UseTaskTableFilterArgs<T extends keyof TaskSearchParams> = {
  filterName: T;
};
export const useTaskTableFilter = <T extends keyof TaskSearchParams>({
  filterName,
}: UseTaskTableFilterArgs<T>) => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/requireAuth/" as const });

  const changeFilter = useCallback(
    (newFilter: TaskSearchParams[T]) => {
      navigate({
        search: { ...search, [filterName]: newFilter },
      });
    },
    [filterName, navigate, search],
  );

  const clearFilter = useCallback(() => {
    navigate({ search: { ...search, [filterName]: undefined } });
  }, [filterName, navigate, search]);

  return { filters: search[filterName], changeFilter, clearFilter };
};
