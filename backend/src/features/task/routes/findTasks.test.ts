import { testClient } from "hono/testing";
import { findTasks } from "./findTasks";
import { testD1, testDb } from "../../../../setup-jest";
import { desc } from "drizzle-orm";
import { tasksTable } from "../../../db/schema";

const client = () => testClient(findTasks, { DB: testD1 });

describe("タスクをすべて収録", () => {
  it("作成された全てのタスクを取得できる", async () => {
    await testDb.insert(tasksTable).values([
      { title: "1", description: "" },
      { title: "2", description: "" },
      { title: "3", description: "" },
    ]);

    const result = await client().tasks.$get();
    const allTasks = await result.json();

    expect(allTasks.length).toBe(3);
  });

  it("タスクがない場合は空の配列が帰ってくる", async () => {
    const result = await client().tasks.$get();
    const allTasks = await result.json();

    expect(allTasks.length).toBe(0);
  });
});
