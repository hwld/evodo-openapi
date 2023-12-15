import { testClient } from "hono/testing";
import { testD1, testDb } from "../../../../setup-jest";
import { tasksTable } from "../../../db/schema";
import { deleteTask } from "./deleteTask";

const client = () => testClient(deleteTask, { DB: testD1 });

describe("タスクの削除", () => {
  it("タスクを削除でき、削除したタスクが返される", async () => {
    const task = (
      await testDb
        .insert(tasksTable)
        .values({ title: "title", description: "" })
        .returning()
    )[0];

    const result = await client().tasks[":id"].$delete({
      param: { id: task.id },
    });
    const deleted = await result.json();

    const finded = await testDb.query.tasksTable.findMany();
    expect(finded.length).toBe(0);
    expect(deleted.id).toBe(task.id);
  });

  it("存在しないタスクを削除しようとするとエラーが返される", async () => {
    const result = await client().tasks[":id"].$delete({ param: { id: "no" } });
    expect(result.ok).toBe(false);
  });
});
