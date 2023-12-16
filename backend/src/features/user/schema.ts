import { z } from "@hono/zod-openapi";

export const UserSchema = z
  .object({ id: z.string(), name: z.string() })
  .openapi("User");
