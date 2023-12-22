import { appRouter } from "../../app";
import { createTask } from "./routes/create-task";
import { deleteTask } from "./routes/delete-task";
import { findTask } from "./routes/find-task";
import { findTasks } from "./routes/find-tasks";
import { updateTask } from "./routes/update-task";

export const taskRoute = appRouter()
  .route("/", findTasks)
  .route("/", createTask)
  .route("/", findTask)
  .route("/", deleteTask)
  .route("/", updateTask);
