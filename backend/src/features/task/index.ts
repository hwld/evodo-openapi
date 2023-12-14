import { appRouter } from "../../app";
import { createTask } from "./createTask";
import { deleteTask } from "./deleteTask";
import { findTask } from "./findTask";
import { findTasks } from "./findTasks";
import { updateTask } from "./updateTask";

export const taskRoute = appRouter()
  .route("/", findTasks)
  .route("/", createTask)
  .route("/", findTask)
  .route("/", deleteTask)
  .route("/", updateTask);
