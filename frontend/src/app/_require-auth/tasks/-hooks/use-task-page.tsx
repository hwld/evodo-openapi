import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";
import { tasksRoute } from "../page";

export const useTaskPage = () => {
  const taskSearchParams = tasksRoute.useSearch();
  // TODO: キャッシュにないページに移動すると一瞬fallbackが表示されてしまう。
  const { data: taskPageEntry, status } = useSuspenseQuery({
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
  });

  return { taskPageEntry, status };
};
