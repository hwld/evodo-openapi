import { api } from "@/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { tasksRoute } from "../page";

export const useTaskPage = () => {
  const taskSearchParams = tasksRoute.useSearch();
  const { data: taskPageEntry } = useQuery({
    queryKey: ["tasks", { taskSearchParams }],
    queryFn: () => {
      return api.get("/tasks", {
        queries: {
          "status_filter[]": taskSearchParams.status_filter,
          sort: taskSearchParams.sort,
          order: taskSearchParams.order,
          page: taskSearchParams.page.toString(),
        },
      });
    },
    placeholderData: keepPreviousData,
  });

  return { taskPageEntry };
};
