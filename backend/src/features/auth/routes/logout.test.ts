import { testClient } from "hono/testing";
import { logout } from "./logout";
import { testD1, testDb } from "../../../../setup-jest";
import { sessions, users } from "../../../db/schema";
import { parseSetCookie } from "../../../lib/cookie";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { TimeSpan, createDate } from "oslo/.";

const client = () => testClient(logout, { DB: testD1 });

describe("ログアウト", () => {
  it("ログアウトするとセッションが削除される", async () => {
    const [user] = await testDb
      .insert(users)
      .values({ id: "userId", name: "", profile: "", googleId: "" })
      .returning();
    const sessionId = "sessionId";
    const [session] = await testDb
      .insert(sessions)
      .values({
        id: sessionId,
        userId: user.id,
        expiresAt: createDate(new TimeSpan(2, "w")).getTime(),
      })
      .returning();

    const result = await client().logout.$post(undefined, {
      headers: { Cookie: `${LOGIN_SESSION_COOKIE}=${session.id}` },
    });

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const allSessions = await testDb.select().from(sessions);
    expect(allSessions.length).toBe(0);
  });
});
