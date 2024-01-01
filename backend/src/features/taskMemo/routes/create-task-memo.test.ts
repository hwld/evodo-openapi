import { testClient } from "hono/testing";
import { createTaskMemo } from "./create-task-memo";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { desc } from "drizzle-orm";
import { describe, expect, it } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(createTaskMemo, { DB: testD1, KV: testKv });

describe("タスクメモの作成", () => {
  it("自分のタスクにメモを追加できる", async () => {
    const content = "メモ";
    const user = await Factories.user({});
    const task = await Factories.task({ authorId: user.id });
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":taskId"].memos.$post({
      cookie: { session: session.id },
      json: { content },
      param: { taskId: task.id },
    });
    const { createdTaskMemo } = await result.json();

    const finded = await testDb.query.taskMemos.findMany();
    expect(finded.length).toBe(1);
    expect(finded[0].id).toBe(createdTaskMemo.id);
    expect(finded[0].content).toBe(content);
  });

  it("他人のタスクにメモを追加できない", async () => {
    const otherUser = await Factories.user({});
    const otherUserTask = await Factories.task({ authorId: otherUser.id });
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":taskId"].memos.$post({
      cookie: { session: session.id },
      param: { taskId: otherUserTask.id },
      json: { content: "メモ" },
    });

    expect(result.ok).toBe(false);

    const memos = await testDb.query.taskMemos.findMany({});
    expect(memos.length).toBe(0);
  });
});
