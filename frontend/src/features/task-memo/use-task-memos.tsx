import { api } from "@/api";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";

export const taskMemosQueryOptions = (taskId: string) =>
  queryOptions({
    queryKey: ["tasks", taskId, "memos"],
    queryFn: async () => {
      const result = await api.get("/tasks/:taskId/memos", {
        params: { taskId },
      });

      return result.taskMemos;
    },
  });

type UseTaskMemosArgs = { taskId: string };
export const useTaskMemos = ({ taskId }: UseTaskMemosArgs) => {
  const { data: taskMemos } = useSuspenseQuery(taskMemosQueryOptions(taskId));

  return { taskMemos };
};
