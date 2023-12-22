import { testClient } from "hono/testing";
import { testD1, testDb } from "../../../../setup-jest";
import { tasks } from "../../../services/db/schema";
import { deleteTask } from "./delete-task";

const client = () => testClient(deleteTask, { DB: testD1 });

describe("タスクの削除", () => {
  it("タスクを削除でき、削除したタスクが返される", async () => {
    const [task] = await testDb
      .insert(tasks)
      .values({ title: "title", description: "" })
      .returning();

    const result = await client().tasks[":id"].$delete({
      param: { id: task.id },
    });
    const deleted = await result.json();

    const finded = await testDb.query.tasks.findMany();
    expect(finded.length).toBe(0);
    expect(deleted.id).toBe(task.id);
  });

  it("存在しないタスクを削除しようとするとエラーが返される", async () => {
    const result = await client().tasks[":id"].$delete({ param: { id: "no" } });
    expect(result.ok).toBe(false);
  });
});
