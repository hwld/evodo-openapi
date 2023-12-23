import { testClient } from "hono/testing";
import { signupSession } from "./signup-session";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { describe, expect, it } from "vitest";
import { signupSessions } from "../../../services/db/schema";
import { TimeSpan, createDate } from "oslo";
import { SIGNUP_SESSION_COOKIE } from "../consts";

const client = () => testClient(signupSession, { DB: testD1, KV: testKv });

describe("新規登録セッションの取得", () => {
  it("新規登録セッションがあるときにはtrueを返す", async () => {
    const [signupSession] = await testDb
      .insert(signupSessions)
      .values({
        id: "sessionId",
        googleUserId: "",
        expires: createDate(new TimeSpan(10, "m")).getTime(),
      })
      .returning();

    const result = await client()["signup-session"].$get(undefined, {
      headers: { cookie: `${SIGNUP_SESSION_COOKIE}=${signupSession.id}` },
    });
    const exists = await result.json();

    expect(exists).toBe(true);
  });

  it("新規登録セッションがないときはfalseを返す", async () => {
    const result = await client()["signup-session"].$get();
    const exists = await result.json();

    expect(exists).toBe(false);
  });
});
