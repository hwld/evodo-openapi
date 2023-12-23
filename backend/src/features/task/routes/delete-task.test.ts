import { testClient } from "hono/testing";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { deleteTask } from "./delete-task";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(deleteTask, { DB: testD1, KV: testKv });

describe("タスクの削除", () => {
  it("タスクを削除でき、削除したタスクが返される", async () => {
    const user = await Factories.user({});
    const task = await Factories.task({ authorId: user.id });
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":id"].$delete({
      cookie: { session: session.id },
      param: { id: task.id },
    });
    const deleted = await result.json();

    const finded = await testDb.query.tasks.findMany();
    expect(finded.length).toBe(0);
    expect(deleted.id).toBe(task.id);
  });

  it("存在しないタスクを削除しようとするとエラーが返される", async () => {
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":id"].$delete({
      cookie: { session: session.id },
      param: { id: "no" },
    });
    expect(result.ok).toBe(false);
  });
});
