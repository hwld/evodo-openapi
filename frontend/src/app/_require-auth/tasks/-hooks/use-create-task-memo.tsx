import { api } from "@/api";
import { schemas } from "@/api/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";

const taskMemoFormSchema = schemas.CreateTaskMemoInput;
type TaskMemoFormData = z.infer<typeof taskMemoFormSchema>;

export const useCreateTaskMemo = () => {
  const client = useQueryClient();
  return useMutation({
    mutationFn: ({
      content,
      taskId,
    }: TaskMemoFormData & { taskId: string }) => {
      return api.post(
        "/tasks/:taskId/memos",
        { content },
        { params: { taskId } },
      );
    },
    onSettled: async () => {
      await client.invalidateQueries();
    },
  });
};
