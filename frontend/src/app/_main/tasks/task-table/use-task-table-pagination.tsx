import { useNavigate, useSearch } from "@tanstack/react-router";
import { useCallback } from "react";

export const useTaskTablePagination = () => {
  const navigate = useNavigate();
  const search = useSearch({ from: "/requireAuth/" as const });

  const changePage = useCallback(
    (page: number) => {
      navigate({ search: { ...search, page } });
    },
    [navigate, search],
  );

  return { currentPage: search.page, changePage };
};
