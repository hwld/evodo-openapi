import { testClient } from "hono/testing";
import { findTasks } from "./find-tasks";
import { testD1, testKv } from "../../../../setup-vitest";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(findTasks, { DB: testD1, KV: testKv });

describe("タスクをすべて収録", () => {
  it("作成された全てのタスクを取得できる", async () => {
    const user = await Factories.user({});
    await Promise.all(
      [...new Array(3)].map(() => Factories.task({ authorId: user.id })),
    );
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$get({
      cookie: { session: session.id },
    });
    const allTasks = await result.json();

    expect(allTasks.length).toBe(3);
  });

  it("タスクがない場合は空の配列が帰ってくる", async () => {
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$get({
      cookie: { session: session.id },
    });
    const allTasks = await result.json();

    expect(allTasks.length).toBe(0);
  });
});
