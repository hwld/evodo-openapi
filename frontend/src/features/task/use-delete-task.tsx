import { api } from "@/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export const useDeleteTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId }: { taskId: string }) => {
      return api.delete("/tasks/:id", undefined, {
        params: { id: taskId },
      });
    },
    onError: async () => {
      toast.error("タスクを削除できませんでした。");
    },
    onSettled: () => {
      return client.invalidateQueries();
    },
  });
};
