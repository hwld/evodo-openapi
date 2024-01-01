import { api } from "@/api";
import { useSuspenseQuery } from "@tanstack/react-query";

type UseTaskMemosArgs = { taskId: string };
export const useTaskMemos = ({ taskId }: UseTaskMemosArgs) => {
  const { data: taskMemos } = useSuspenseQuery({
    queryKey: ["tasks", taskId, "memos"],
    queryFn: async () => {
      const result = await api.get("/tasks/:taskId/memos", {
        params: { taskId },
      });

      return result.taskMemos;
    },
  });

  return { taskMemos };
};
