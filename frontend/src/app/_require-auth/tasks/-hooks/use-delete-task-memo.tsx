import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useDeleteTaskMemo = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      taskMemoId,
    }: {
      taskId: string;
      taskMemoId: string;
    }) => {
      return api.delete("/tasks/:taskId/memos/:taskMemoId", undefined, {
        params: { taskId, taskMemoId },
      });
    },
    onSettled: () => {
      return client.invalidateQueries();
    },
  });
};
