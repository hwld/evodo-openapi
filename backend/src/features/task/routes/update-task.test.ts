import { testClient } from "hono/testing";
import { updateTask } from "./update-task";
import { testD1, testDb } from "../../../../setup-jest";
import { tasks } from "../../../services/db/schema";
import { eq } from "drizzle-orm";

const client = () => testClient(updateTask, { DB: testD1 });

describe("タスクの更新", () => {
  it("タスクを更新できる", async () => {
    const [created] = await testDb
      .insert(tasks)
      .values({ title: "title", description: "description" })
      .returning();
    const newTitle = "newTitle";
    const newDescription = "newDescription";

    await client().tasks[":id"].$put({
      param: { id: created.id },
      json: { title: newTitle, description: newDescription },
    });

    const updated = await testDb.query.tasks.findFirst({
      where: eq(tasks.id, created.id),
    });
    expect(updated?.title).toBe(newTitle);
    expect(updated?.description).toBe(newDescription);
  });

  it("タイトルを空文字に更新できない", async () => {
    const [created] = await testDb
      .insert(tasks)
      .values({ title: "title", description: "description" })
      .returning();

    const result = await client().tasks[":id"].$put({
      param: { id: created.id },
      json: { title: "", description: "" },
    });
    expect(result.ok).toBe(false);
  });
});
