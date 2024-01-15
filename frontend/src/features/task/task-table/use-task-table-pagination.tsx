import { useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";
import { tasksRoute } from "../../../app/_require-auth/tasks/page";

export const useTaskTablePagination = () => {
  const navigate = useNavigate();
  const search = tasksRoute.useSearch();

  const changePage = useCallback(
    (page: number) => {
      navigate({ search: { ...search, page } });
    },
    [navigate, search],
  );

  return { currentPage: search.page, changePage };
};
