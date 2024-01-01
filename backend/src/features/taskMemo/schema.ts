import { z } from "zod";

export const TaskMemoSchema = z
  .object({
    id: z.string(),
    taskId: z.string(),
    authorId: z.string(),
    content: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("TaskMemo");

export const CreateTaskMemoInputSchema = z
  .object({
    content: z.string().min(1).max(500),
  })
  .openapi("CreateTaskMemoInput");
