import { z } from "zod";
import { schemas } from "./schema";

export type Task = z.infer<typeof schemas.Task>;
export type Session = z.infer<typeof schemas.Session>;
