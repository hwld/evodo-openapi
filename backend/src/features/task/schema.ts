import { z } from "@hono/zod-openapi";

export const TaskStatusSchema = z.union([z.literal("todo"), z.literal("done")]);
export const TaskSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    status: TaskStatusSchema,
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Task");

export const CreateTaskInputSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
  })
  .openapi("CreateTaskInput");

export const UpdasteTaskInputSchema = z
  .object({
    title: z.string().min(1).max(200),
    description: z.string().max(1000),
    status: TaskStatusSchema,
  })
  .openapi("UpdateTaskInput");
