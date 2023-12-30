import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { TaskSearchParams, tasksRoute } from "../page";

type UseTaskTableFilterArgs<T extends keyof TaskSearchParams> = {
  filterName: T;
};
export const useTaskTableFilter = <T extends keyof TaskSearchParams>({
  filterName,
}: UseTaskTableFilterArgs<T>) => {
  const navigate = useNavigate();
  const search = tasksRoute.useSearch();

  const changeFilter = useCallback(
    (newFilter: TaskSearchParams[T]) => {
      navigate({
        search: { ...search, page: 1, [filterName]: newFilter },
      });
    },
    [filterName, navigate, search],
  );

  const clearFilter = useCallback(() => {
    navigate({ search: { ...search, page: 1, [filterName]: undefined } });
  }, [filterName, navigate, search]);

  return { filters: search[filterName], changeFilter, clearFilter };
};
