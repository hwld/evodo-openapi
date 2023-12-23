import { testClient } from "hono/testing";
import { session } from "./session";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { parseSetCookie } from "../../../lib/cookie";
import { AuthAdapter } from "../../../services/auth/adapter";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";
import { TimeSpan, createDate } from "oslo";

const client = () => testClient(session, { DB: testD1, KV: testKv });

describe("セッションの取得", () => {
  it("ログインしているユーザーを取得できる", async () => {
    await Factories.loginSession({
      userId: (await Factories.user({})).id,
    });
    const loggedInUser = await Factories.user({});
    const loginSession = await Factories.loginSession({
      userId: loggedInUser.id,
    });

    const result = await client().session.$get({
      cookie: { session: loginSession.id },
    });
    const { session } = await result.json();

    expect(session?.user.id).toBe(loggedInUser.id);
    expect(session?.user.name).toBe(loggedInUser.name);
  });

  it("ログインしていなければnullが返される", async () => {
    const result = await client().session.$get({ cookie: { session: "" } });
    const { session } = await result.json();

    expect(session).toBeNull();
  });

  it("セッションの期限が切れていればnullが返され、sessionが削除される", async () => {
    const loggedInUser = await Factories.user({});
    const loginSession = await Factories.loginSession({
      userId: loggedInUser.id,
      expiresAt: createDate(new TimeSpan(-1, "w")),
    });

    const result = await client().session.$get({
      cookie: { session: loginSession.id },
    });

    const { session } = await result.json();
    expect(session).toBeNull();

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const authAdapter = new AuthAdapter(testDb, testKv);
    const allSessions = await authAdapter.getUserSessions(loggedInUser.id);
    expect(allSessions.length).toBe(0);
  });
});
