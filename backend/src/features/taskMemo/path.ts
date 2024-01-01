import { tasksPath } from "../task/path";

export const taskMemosPath = `${tasksPath}/:taskId/memos`;
export const taskMemoPath = `${taskMemosPath}/:taskMemoId`;
