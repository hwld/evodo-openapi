import { appRouter } from "../../app";
import { createTaskMemo } from "./routes/create-task-memo";
import { deleteTaskMemo } from "./routes/delete-task-memo";
import { findTaskMemos } from "./routes/find-task-memos";

export const taskMemoRoute = appRouter()
  .route("/", findTaskMemos)
  .route("/", createTaskMemo)
  .route("/", deleteTaskMemo);
