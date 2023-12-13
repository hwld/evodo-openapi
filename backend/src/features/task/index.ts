import { createHono } from "../../app";
import { createTask } from "./createTask";
import { findTasks } from "./findTasks";

const path = "/tasks";

export const taskRoute = createHono()
  .route(path, findTasks)
  .route(path, createTask);
