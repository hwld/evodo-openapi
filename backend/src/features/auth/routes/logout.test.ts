import { testClient } from "hono/testing";
import { logout } from "./logout";
import { testD1, testDb, testKv } from "../../../../setup-vitest";
import { parseSetCookie } from "../../../lib/cookie";
import { LOGIN_SESSION_COOKIE } from "../consts";
import { AuthAdapter } from "../../../services/auth/adapter";
import { describe, it, expect } from "vitest";
import { Factories } from "../../factories";

const client = () => testClient(logout, { DB: testD1, KV: testKv });

describe("ログアウト", () => {
  it("ログアウトするとセッションが削除される", async () => {
    const loggedInUser = await Factories.user({});
    const session = await Factories.loginSession({ userId: loggedInUser.id });

    const result = await client().logout.$post({
      cookie: { session: session.id },
    });

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    expect(cookie[LOGIN_SESSION_COOKIE].value).toBe("");

    const authAdapter = new AuthAdapter(testDb, testKv);
    const allSessions = await authAdapter.getUserSessions(loggedInUser.id);
    expect(allSessions.length).toBe(0);
  });
});
