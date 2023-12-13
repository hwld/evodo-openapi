import { z } from "@hono/zod-openapi";

export const TaskSchema = z
  .object({
    id: z.string(),
    title: z.string(),
    description: z.string(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })
  .openapi("Task");
