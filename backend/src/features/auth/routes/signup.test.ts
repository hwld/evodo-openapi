import { testClient } from "hono/testing";
import { signup } from "./signUp";
import { testD1, testDb } from "../../../../setup-jest";
import { sessions, signupSessions, users } from "../../../db/schema";
import { TimeSpan, createDate } from "oslo/.";
import { eq } from "drizzle-orm";
import { parseSetCookie } from "../../../lib/cookie";
import { LOGIN_SESSION_COOKIE } from "../consts";

const client = () => testClient(signup, { DB: testD1 });

describe("新規登録", () => {
  it("新規登録セッションがあるときには新規登録でき、ログインセッションが開始される。", async () => {
    const username = "newUser";
    const profile = "newProfile";
    const [signupSession] = await testDb
      .insert(signupSessions)
      .values({
        id: "session",
        googleUserId: "",
        expires: createDate(new TimeSpan(10, "m")).getTime(),
      })
      .returning();

    const result = await client().signup.$post({
      cookie: { signup_session: signupSession.id },
      json: { username, profile },
    });
    const { userId } = await result.json();

    const user = await testDb.query.users.findFirst({
      where: eq(users.id, userId),
    });
    expect(user?.name).toBe(username);
    expect(user?.profile).toBe(profile);

    const cookie = parseSetCookie(result.headers.get("set-cookie") ?? "");
    const loginSession = await testDb.query.sessions.findFirst({
      where: eq(sessions.id, cookie[LOGIN_SESSION_COOKIE].value),
    });
    expect(loginSession?.userId).toBe(user?.id);
  });

  it("新規登録セッションがないと登録は失敗する", async () => {
    const result = await client().signup.$post({
      cookie: { signup_session: "" },
      json: { username: "username", profile: "profile" },
    });

    expect(result.ok).toBe(false);

    const allUsers = await testDb.query.users.findMany();
    expect(allUsers.length).toBe(0);

    const allLoginSessions = await testDb.query.sessions.findMany();
    expect(allLoginSessions.length).toBe(0);
  });
});
