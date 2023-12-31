import { testClient } from "hono/testing";
import { signupSession } from "./signup-session";
import { testD1, testKv } from "../../../../setup-vitest";
import { describe, expect, it } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(signupSession, { DB: testD1, KV: testKv });

describe("新規登録セッションの取得", () => {
  it("新規登録セッションがあるときにはtrueを返す", async () => {
    const signupSession = await Factories.signupSession({});

    const result = await client()["signup-session"].$get({
      cookie: { signup_session: signupSession.id },
    });
    const { exists } = await result.json();

    expect(exists).toBe(true);
  });

  it("新規登録セッションがないときはfalseを返す", async () => {
    const result = await client()["signup-session"].$get({
      cookie: { signup_session: "" },
    });
    const { exists } = await result.json();

    expect(exists).toBe(false);
  });
});
