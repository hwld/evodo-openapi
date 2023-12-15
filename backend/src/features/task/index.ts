import { appRouter } from "../../app";
import { createTask } from "./routes/createTask";
import { deleteTask } from "./routes/deleteTask";
import { findTask } from "./routes/findTask";
import { findTasks } from "./routes/findTasks";
import { updateTask } from "./routes/updateTask";

export const taskRoute = appRouter()
  .route("/", findTasks)
  .route("/", createTask)
  .route("/", findTask)
  .route("/", deleteTask)
  .route("/", updateTask);
