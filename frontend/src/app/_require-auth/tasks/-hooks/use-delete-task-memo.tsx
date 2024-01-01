import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

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
    onSuccess: () => {
      toast.success("タスクのメモを削除しました。");
    },
    onError: () => {
      toast.error("タスクのメモを削除できませんでした。");
    },
    onSettled: () => {
      return client.invalidateQueries();
    },
  });
};
