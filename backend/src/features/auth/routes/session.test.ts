import { testClient } from "hono/testing";
import { session } from "./session";
import { testD1, testDb } from "../../../../setup-jest";
import { sessions, users } from "../../../db/schema";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { TimeSpan, createDate } from "oslo/.";
import { parseSetCookie } from "../../../lib/cookie";

const client = () => testClient(session, { DB: testD1 });

describe("セッションの取得", () => {
  it("ログインしているユーザーを取得できる", async () => {
    const [loggedInUser] = await testDb
      .insert(users)
      .values({ name: "username", profile: "profile", googleId: "" })
      .returning();
    const [session] = await testDb
      .insert(sessions)
      .values({
        id: "sessionId",
        userId: loggedInUser.id,
        expiresAt: createDate(new TimeSpan(2, "w")).getTime(),
      })
      .returning();

    const result = await client().session.$get(undefined, {
      headers: { cookie: `${LOGIN_SESSION_COOKIE}=${session.id}` },
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

  it("セッションの期限が切れていれば、nullが返され、sessionが削除される", async () => {
    const [loggedInUser] = await testDb
      .insert(users)
      .values({ name: "name", profile: "profile", googleId: "googleId" })
      .returning();
    const [session] = await testDb
      .insert(sessions)
      .values({
        id: "sessionId",
        userId: loggedInUser.id,
        expiresAt: Math.floor(
          createDate(new TimeSpan(-1, "d")).getTime() / 1000,
        ),
      })
      .returning();

    const result = await client().session.$get(undefined, {
      headers: { cookie: `${LOGIN_SESSION_COOKIE}=${session.id}` },
    });

    const { user } = await result.json();
    expect(user).toBeNull();

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const allSessions = await testDb.select().from(sessions);
    expect(allSessions.length).toBe(0);
  });
});
