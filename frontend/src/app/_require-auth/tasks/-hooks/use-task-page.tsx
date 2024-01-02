import { api } from "@/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { TaskSearchParams, tasksRoute } from "../page";

export const taskPageQueryOptions = (search: TaskSearchParams) =>
  queryOptions({
    queryKey: ["tasks", search],
    queryFn: () => {
      return api.get("/tasks", {
        queries: {
          "status_filter[]": search.status_filter,
          sort: search.sort,
          order: search.order,
          page: search.page.toString(),
        },
      });
    },
  });

export const useTaskPage = () => {
  const taskSearchParams = tasksRoute.useSearch();
  const { data: taskPageEntry, status } = useSuspenseQuery(
    taskPageQueryOptions(taskSearchParams),
  );

  return { taskPageEntry, status };
};
