import { testClient } from "hono/testing";
import { session } from "./session";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { users } from "../../../services/db/schema";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { TimeSpan, createDate } from "oslo";
import { parseSetCookie } from "../../../lib/cookie";
import { AuthAdapter } from "../../../services/auth/adapter";
import { describe, it, expect } from "vitest";

const client = () => testClient(session, { DB: testD1, KV: testKv });

describe("セッションの取得", () => {
  it("ログインしているユーザーを取得できる", async () => {
    const authAdapter = new AuthAdapter(testDb, testKv);
    const [loggedInUser] = await testDb
      .insert(users)
      .values({ name: "username", profile: "profile", googleId: "" })
      .returning();
    const sessionId = "sessionId";
    await authAdapter.setSession({
      id: sessionId,
      userId: loggedInUser.id,
      expiresAt: createDate(new TimeSpan(1, "w")),
      attributes: {},
    });

    const result = await client().session.$get(undefined, {
      headers: { cookie: `${LOGIN_SESSION_COOKIE}=${sessionId}` },
    });
    const { session } = await result.json();

    expect(session?.user.id).toBe(loggedInUser.id);
    expect(session?.user.name).toBe(loggedInUser.name);
  });

  it("ログインしていなければnullが返される", async () => {
    const result = await client().session.$get();
    const { session } = await result.json();

    expect(session).toBeNull();
  });

  it("セッションの期限が切れていればnullが返され、sessionが削除される", async () => {
    const authAdapter = new AuthAdapter(testDb, testKv);
    const [loggedInUser] = await testDb
      .insert(users)
      .values({ name: "name", profile: "profile", googleId: "googleId" })
      .returning();
    const sessionId = "sessionId";
    await authAdapter.setSession({
      id: sessionId,
      userId: loggedInUser.id,
      expiresAt: createDate(new TimeSpan(-1, "w")),
      attributes: {},
    });

    const result = await client().session.$get(undefined, {
      headers: { cookie: `${LOGIN_SESSION_COOKIE}=${sessionId}` },
    });

    const { session } = await result.json();
    expect(session).toBeNull();

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const allSessions = await authAdapter.getUserSessions(loggedInUser.id);
    expect(allSessions.length).toBe(0);
  });
});
