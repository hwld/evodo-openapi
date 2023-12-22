import { testClient } from "hono/testing";
import { logout } from "./logout";
import { testD1, testDb, testKv } from "../../../../setup-jest";
import { users } from "../../../services/db/schema";
import { parseSetCookie } from "../../../lib/cookie";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { TimeSpan, createDate } from "oslo/.";
import { AuthAdapter } from "../../../services/auth/adapter";

const client = () => testClient(logout, { DB: testD1, KV: testKv });

describe("ログアウト", () => {
  it("ログアウトするとセッションが削除される", async () => {
    const authAdapter = new AuthAdapter(testDb, testKv);
    const [user] = await testDb
      .insert(users)
      .values({ id: "userId", name: "", profile: "", googleId: "" })
      .returning();
    const sessionId = "sessionId";
    await authAdapter.setSession({
      id: sessionId,
      userId: user.id,
      expiresAt: createDate(new TimeSpan(1, "w")),
      attributes: {},
    });

    const result = await client().logout.$post(undefined, {
      headers: { Cookie: `${LOGIN_SESSION_COOKIE}=${sessionId}` },
    });

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const allSessions = await authAdapter.getUserSessions(user.id);
    expect(allSessions.length).toBe(0);
  });
});
