import { testClient } from "hono/testing";
import { cancelSignup } from "./cancel-signup";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { signupSessions } from "../../../services/db/schema";
import { parseSetCookie } from "../../../lib/cookie";
import { SIGNUP_SESSION_COOKIE } from "../consts";
import { describe, expect, it } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(cancelSignup, { DB: testD1, KV: testKv });

describe("新規登録のキャンセル", () => {
  it("新規登録をキャンセルすると新規登録セッションが削除される", async () => {
    const signupSession = await Factories.signupSession({});

    const result = await client().signup.cancel.$post({
      cookie: { signup_session: signupSession.id },
    });

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[SIGNUP_SESSION_COOKIE].value).toBe("");

    const allSessions = await testDb.select().from(signupSessions);
    expect(allSessions.length).toBe(0);
  });
});
