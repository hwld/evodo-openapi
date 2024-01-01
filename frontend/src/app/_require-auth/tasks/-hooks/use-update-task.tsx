import { api } from "@/api";
import { schemas } from "@/api/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export const useUpdateTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: async (
      data: z.infer<typeof schemas.UpdateTaskInput> & { taskId: string },
    ) => {
      return api.put(
        "/tasks/:id",
        {
          title: data.title,
          description: data.description,
          status: data.status,
        },
        { params: { id: data.taskId } },
      );
    },
    onError: () => {
      toast.error("タスクを更新できませんでした。");
    },
    onSettled: () => {
      return client.invalidateQueries();
    },
  });
};
