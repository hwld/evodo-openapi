import { testClient } from "hono/testing";
import { createTask } from "./createTask";
import { testD1, testDb } from "../../../../setup-jest";

const client = () => testClient(createTask, { DB: testD1 });

describe("タスクの作成", () => {
  it("タイトルと説明を指定してタスクを作成でき、作成したタスクが返される", async () => {
    const title = "newtask";
    const description = "description";

    const result = await client().tasks.$post({
      json: { title, description },
    });
    const created = await result.json();

    const finded = await testDb.query.tasks.findMany();
    expect(finded.length).toBe(1);
    expect(finded[0].id).toBe(created.id);
    expect(finded[0].title).toBe(title);
    expect(finded[0].description).toBe(description);
  });

  it("タイトルが空文字だとタスクが作成できない", async () => {
    const result = await client().tasks.$post({
      json: { title: "", description: "" },
    });
    expect(result.ok).toBe(false);
  });
});
