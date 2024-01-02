// テーブル以外をexportしない
import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer, int } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { currentTime } from "./utils";

export const users = sqliteTable("users", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  googleId: text("google_id").unique().notNull(),
  name: text("name").notNull(),
  profile: text("profile").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  tasks: many(tasks),
  taskMemos: many(taskMemos),
}));

export const signupSessions = sqliteTable("signup_sessions", {
  id: text("id").primaryKey(),
  googleUserId: text("google_user_id").unique().notNull(),
  /** ミリ秒 */
  expires: integer("expires").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  status: text("status", { enum: ["done", "todo"] })
    .notNull()
    .default("todo"),
  // 小さい数字ほど優先順位が低い
  // intを使うことも考えたが、drizzle側で優先順位の範囲を限定したかったため、enumのtextを使う。
  // 2桁以上の数字を追加すると並び順がおかしくなるので使用できない。("2"よりも"10"のほうが小さいとみなされてしまう。)
  priority: text("priority", { enum: ["1", "2", "3"] })
    .notNull()
    .default("2"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  authorId: text("author_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(${currentTime()})`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(${currentTime()})`),
});

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  author: one(users, { fields: [tasks.authorId], references: [users.id] }),
  memos: many(taskMemos),
}));

export const taskMemos = sqliteTable("taskMemos", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  content: text("content").notNull().default(""),
  taskId: text("task_id")
    .notNull()
    .references(() => tasks.id, { onDelete: "cascade" }),
  authorId: text("author_id")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),

  createdAt: text("created_at")
    .notNull()
    .default(sql`(${currentTime()})`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`(${currentTime()})`),
});

export const taskMemosRelations = relations(taskMemos, ({ one }) => ({
  task: one(tasks, { fields: [taskMemos.taskId], references: [tasks.id] }),
  author: one(users, { fields: [taskMemos.authorId], references: [users.id] }),
}));
