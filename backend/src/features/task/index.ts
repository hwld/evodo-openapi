import { appRouter } from "../../app";
import { createTask } from "./createTask";
import { findTasks } from "./findTasks";

const path = "/tasks";

export const taskRoute = appRouter()
  .route(path, findTasks)
  .route(path, createTask);
