import { testClient } from "hono/testing";
import { updateTask } from "./update-task";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { tasks } from "../../../services/db/schema";
import { eq } from "drizzle-orm";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(updateTask, { DB: testD1, KV: testKv });

describe("タスクの更新", () => {
  it("タスクを更新できる", async () => {
    const newUser = {
      title: "newTitle",
      description: "newDescription",
      status: "done",
    } as const;
    const user = await Factories.user({});
    const task = await Factories.task({ authorId: user.id });
    const session = await Factories.loginSession({ userId: user.id });

    await client().tasks[":id"].$put({
      cookie: { session: session.id },
      param: { id: task.id },
      json: {
        title: newUser.title,
        description: newUser.description,
        status: newUser.status,
      },
    });

    const updated = await testDb.query.tasks.findFirst({
      where: eq(tasks.id, task.id),
    });
    expect(updated?.title).toBe(newUser.title);
    expect(updated?.description).toBe(newUser.description);
  });

  it("タイトルを空文字に更新できない", async () => {
    const user = await Factories.user({});
    const task = await Factories.task({ authorId: user.id });
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":id"].$put({
      cookie: { session: session.id },
      param: { id: task.id },
      json: { title: "", description: "", status: "todo" },
    });
    expect(result.ok).toBe(false);
  });

  it("他人のタスクを変更できない", async () => {
    const otherUserTask = await Factories.task({
      authorId: (await Factories.user({})).id,
      title: "title",
      description: "description",
    });
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":id"].$put({
      cookie: { session: session.id },
      param: { id: otherUserTask.id },
      json: { title: "new", description: "new", status: "done" },
    });

    expect(result.ok).toBe(false);
    const task = await testDb.query.tasks.findFirst({
      where: eq(tasks.id, otherUserTask.id),
    });
    expect(task?.title).toBe(otherUserTask.title);
    expect(task?.description).toBe(otherUserTask.description);
  });
});
