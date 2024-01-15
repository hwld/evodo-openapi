import { api } from "@/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const taskQueryOptions = (taskId: string) =>
  queryOptions({
    queryKey: ["tasks", taskId],
    queryFn: () => {
      return api.get("/tasks/:id", { params: { id: taskId } });
    },
  });

export const useTask = ({ taskId }: { taskId: string }) => {
  const { data: task } = useSuspenseQuery(taskQueryOptions(taskId));

  return { task };
};
