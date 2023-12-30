import { testClient } from "hono/testing";
import { findTasks } from "./find-tasks";
import { testD1, testKv } from "../../../../setup-vitest";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";
import { formatDate } from "../../../services/db/utils";

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
      query: { "status_filter[]": [] },
    });
    const { tasks: allTasks } = await result.json();

    expect(allTasks.length).toBe(3);
  });

  it("指定した状態のタスクだけを取得できる", async () => {
    const user = await Factories.user({});
    const doneTaskCount = 5;
    await Promise.all([
      ...[...new Array(doneTaskCount)].map(() =>
        Factories.task({ authorId: user.id, status: "done" }),
      ),
      ...[...new Array(3)].map(() =>
        Factories.task({ authorId: user.id, status: "todo" }),
      ),
    ]);
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$get({
      cookie: { session: session.id },
      query: { "status_filter[]": ["done"] },
    });
    const { tasks: doneTasks } = await result.json();

    expect(doneTasks.length).toBe(doneTaskCount);
    expect(doneTasks.every((task) => task.status === "done")).toBe(true);
  });

  it("タスクをソートした状態で取得できる", async () => {
    const user = await Factories.user({});
    await Promise.all([
      Factories.task({
        id: "1",
        authorId: user.id,
        createdAt: formatDate(new Date("2020/1/1")),
      }),
      Factories.task({
        id: "2",
        authorId: user.id,
        createdAt: formatDate(new Date("2020/1/10")),
      }),
      Factories.task({
        id: "3",
        authorId: user.id,
        createdAt: formatDate(new Date("2021/1/1")),
      }),
    ]);
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$get({
      cookie: { session: session.id },
      query: { sort: "createdAt", order: "asc" },
    });
    const { tasks } = await result.json();

    expect(tasks.length).toBe(3);
    expect(tasks[0].id).toBe("1");
    expect(tasks[1].id).toBe("2");
    expect(tasks[2].id).toBe("3");
  });

  it("タスクがない場合は空の配列が帰ってくる", async () => {
    const user = await Factories.user({});
    const session = await Factories.loginSession({ userId: user.id });

    const result = await client().tasks.$get({
      cookie: { session: session.id },
      query: { "status_filter[]": [] },
    });
    const { tasks: allTasks } = await result.json();

    expect(allTasks.length).toBe(0);
  });
});
