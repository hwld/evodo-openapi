import { testClient } from "hono/testing";
import { testD1, testKv } from "../../../../setup-vitest";
import { findTask } from "./find-task";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(findTask, { DB: testD1, KV: testKv });

describe("タスクの取得", () => {
  it("idを指定してタスクを取得できる。", async () => {
    const title = "title";
    const description = "description";
    const user = await Factories.user({});
    const task = await Factories.task({ authorId: user.id });
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":id"].$get({
      cookie: { session: session.id },
      param: { id: task.id },
    });
    const finded = await result.json();

    expect(finded.title).toBe(title);
    expect(finded.description).toBe(description);
  });

  it("存在しないタスクを取得しようとするとエラー", async () => {
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks[":id"].$get({
      cookie: { session: session.id },
      param: { id: "no" },
    });
    expect(result.ok).toBe(false);
  });
});
