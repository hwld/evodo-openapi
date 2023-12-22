import { testClient } from "hono/testing";
import { session } from "./session";
import { testD1, testDb, testKv } from "../../../../setup-jest";
import { users } from "../../../db/schema";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { TimeSpan, createDate } from "oslo/.";
import { parseSetCookie } from "../../../lib/cookie";
import { AuthAdapter } from "../../../auth/adapter";

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
    const { user } = await result.json();

    expect(user?.id).toBe(loggedInUser.id);
    expect(user?.name).toBe(loggedInUser.name);
  });

  it("ログインしていなければnullが返される", async () => {
    const result = await client().session.$get();
    const { user } = await result.json();

    expect(user).toBeNull();
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

    const { user } = await result.json();
    expect(user).toBeNull();

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const allSessions = await authAdapter.getUserSessions(loggedInUser.id);
    expect(allSessions.length).toBe(0);
  });
});
