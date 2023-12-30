import { schemas } from "@/api/schema";
import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback, useMemo } from "react";
import { z } from "zod";

export type SortStatus = false | "asc" | "desc";

export const useSortTaskTable = (column: z.infer<typeof schemas.TaskSort>) => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/requireAuth/" as const });
  const sorted = search.sort === column;

  const toggleSorting = useCallback(() => {
    const order = sorted ? (search.order === "asc" ? "desc" : "asc") : "desc";
    navigate({ search: { ...search, page: 1, sort: column, order } });
  }, [column, navigate, search, sorted]);

  const sortStatus: SortStatus = useMemo(() => {
    if (sorted) {
      return search.order;
    }
    return false;
  }, [search.order, sorted]);

  return { toggleSorting, sortStatus };
};
