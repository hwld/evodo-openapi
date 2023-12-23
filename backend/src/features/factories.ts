import { InferInsertModel } from "drizzle-orm";
import { signupSessions, tasks, users } from "../services/db/schema";
import { testDb, testKv } from "../../setup-vitest";
import { AuthAdapter } from "../services/auth/adapter";
import { TimeSpan, createDate } from "oslo";
import { DatabaseSession } from "lucia";

// 一旦全部ここに入れるけど、大きくなりすぎたら分割するかも
export const Factories = {
  user: async (user: Partial<InferInsertModel<typeof users>>) => {
    const [createdUser] = await testDb
      .insert(users)
      .values({
        id: crypto.randomUUID(),
        name: "user",
        profile: "profile",
        googleId: "googleId",
        ...user,
      })
      .returning();
    return createdUser;
  },

  task: async (
    task: Partial<InferInsertModel<typeof tasks>> & { authorId: string },
  ) => {
    const [createdTask] = await testDb
      .insert(tasks)
      .values({
        id: crypto.randomUUID(),
        title: "title",
        description: "description",
        updatedAt: new Date().toUTCString(),
        ...task,
      })
      .returning();

    return createdTask;
  },

  loginSession: async (
    session: { userId: string } & Partial<DatabaseSession>,
  ) => {
    const authAdapter = new AuthAdapter(testDb, testKv);
    const sessionId = crypto.randomUUID();

    await authAdapter.setSession({
      id: sessionId,
      expiresAt: createDate(new TimeSpan(1, "w")),
      attributes: {},
      ...session,
    });

    return { id: sessionId };
  },

  signupSession: async (
    session: Partial<InferInsertModel<typeof signupSessions>>,
  ) => {
    const sessionId = crypto.randomUUID();
    const [signupSession] = await testDb
      .insert(signupSessions)
      .values({
        id: sessionId,
        googleUserId: "",
        expires: createDate(new TimeSpan(10, "m")).getTime(),
        ...session,
      })
      .returning();

    return signupSession;
  },
};
