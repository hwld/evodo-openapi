import { api } from "@/api";
import { schemas } from "@/api/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";

export const useCreateTask = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: (newTask: z.infer<typeof schemas.CreateTaskInput>) => {
      return api.post("/tasks", newTask);
    },
    onError: () => {
      toast.error("タスクが作成できませんでした。");
    },
    onSettled: () => {
      client.invalidateQueries();
    },
  });
};
