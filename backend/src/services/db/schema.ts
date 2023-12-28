// テーブル以外をexportしない
import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
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
  done: integer("done", { mode: "boolean" }).notNull().default(false),
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

export const tasksRelations = relations(tasks, ({ one }) => ({
  author: one(users, { fields: [tasks.authorId], references: [users.id] }),
}));
