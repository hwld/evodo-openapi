import { testClient } from "hono/testing";
import { createTask } from "./create-task";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";
import { TimeSpan, createDate } from "oslo";

const client = () => testClient(createTask, { DB: testD1, KV: testKv });

describe("タスクの作成", () => {
  it("タイトルと説明を指定してタスクを作成でき、作成したタスクが返される", async () => {
    const title = "newtask";
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$post({
      cookie: { session: session.id },
      json: { title },
    });
    const created = await result.json();

    const finded = await testDb.query.tasks.findMany();
    expect(finded.length).toBe(1);
    expect(finded[0].id).toBe(created.id);
    expect(finded[0].title).toBe(title);
  });

  it("タイトルが空文字だとタスクが作成できない", async () => {
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$post({
      cookie: { session: session.id },
      json: { title: "" },
    });
    expect(result.ok).toBe(false);
  });

  it("ログインセッションが期限切れだとタスクが作成できない", async () => {
    const user = await Factories.user({});
    const session = await Factories.loginSession({
      userId: user.id,
      expiresAt: createDate(new TimeSpan(-10, "m")),
    });

    const result = await client().tasks.$post({
      cookie: { session: session.id },
      json: { title: "task" },
    });

    expect(result.ok).toBe(false);

    const tasks = await testDb.query.tasks.findMany({});
    expect(tasks.length).toBe(0);
  });
});
