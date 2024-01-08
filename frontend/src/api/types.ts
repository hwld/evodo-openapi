import { z } from "zod";
import { schemas } from "./schema";
import { ApiOf } from "@zodios/core";
import { api } from ".";

export type Api = ApiOf<typeof api>;

export type Task = z.infer<typeof schemas.Task>;
export type TaskMemo = z.infer<typeof schemas.TaskMemo>;
export type Session = z.infer<typeof schemas.Session>;
