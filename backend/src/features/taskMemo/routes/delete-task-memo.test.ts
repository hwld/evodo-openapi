import { testClient } from "hono/testing";
import { deleteTaskMemo } from "./delete-task-memo";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { describe, expect, it } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(deleteTaskMemo, { DB: testD1, KV: testKv });

describe("タスクメモの削除", () => {
  it("自分のタスクメモを削除できる", async () => {
    const user = await Factories.user({});
    const task = await Factories.task({ authorId: user.id });
    const taskMemo = await Factories.taskMemo({
      taskId: task.id,
      authorId: user.id,
    });
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":taskId"].memos[":taskMemoId"].$delete(
      {
        cookie: { session: session.id },
        param: { taskId: task.id, taskMemoId: taskMemo.id },
      },
    );

    expect(result.ok).toBe(true);

    const memos = await testDb.query.taskMemos.findMany({});
    expect(memos.length).toBe(0);
  });

  it("他人のタスクメモは削除できない", async () => {
    const otherUser = await Factories.user({});
    const otherUserTask = await Factories.task({ authorId: otherUser.id });
    const otherUserTaskMemo = await Factories.taskMemo({
      authorId: otherUser.id,
      taskId: otherUserTask.id,
    });
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":taskId"].memos[":taskMemoId"].$delete(
      {
        cookie: { session: session.id },
        param: { taskId: otherUserTask.id, taskMemoId: otherUserTaskMemo.id },
      },
    );

    expect(result.ok).toBe(false);

    const memos = await testDb.query.taskMemos.findMany({});
    expect(memos.length).toBe(1);
  });
});
