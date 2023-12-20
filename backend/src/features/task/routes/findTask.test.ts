import { testClient } from "hono/testing";
import { testD1, testDb } from "../../../../setup-jest";
import { tasks } from "../../../db/schema";
import { findTask } from "./findTask";

const client = () => testClient(findTask, { DB: testD1 });

describe("タスクの取得", () => {
  it("idを指定してタスクを取得できる。", async () => {
    const title = "title";
    const description = "description";
    const [created] = await testDb
      .insert(tasks)
      .values({ title, description })
      .returning();

    const result = await client().tasks[":id"].$get({
      param: { id: created.id },
    });
    const finded = await result.json();

    expect(finded.title).toBe(title);
    expect(finded.description).toBe(description);
  });

  it("存在しないタスクを取得しようとするとエラー", async () => {
    const result = await client().tasks[":id"].$get({ param: { id: "no" } });
    expect(result.ok).toBe(false);
  });
});
