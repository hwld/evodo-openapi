import { testClient } from "hono/testing";
import { cancelSignup } from "./cancelSignup";
import { testD1, testDb, testKv } from "../../../../setup-jest";
import { signupSessions } from "../../../db/schema";
import { TimeSpan, createDate } from "oslo/.";
import { parseSetCookie } from "../../../lib/cookie";
import { SIGNUP_SESSION_COOKIE } from "../consts";

const client = () => testClient(cancelSignup, { DB: testD1, KV: testKv });

describe("新規登録のキャンセル", () => {
  it("新規登録をキャンセルすると新規登録セッションが削除される", async () => {
    const [session] = await testDb
      .insert(signupSessions)
      .values({
        id: "id",
        googleUserId: "",
        expires: createDate(new TimeSpan(1, "w")).getTime(),
      })
      .returning();

    const result = await client().signup.cancel.$post({
      cookie: { signup_session: session.id },
    });

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[SIGNUP_SESSION_COOKIE].value).toBe("");

    const allSessions = await testDb.select().from(signupSessions);
    expect(allSessions.length).toBe(0);
  });
});
