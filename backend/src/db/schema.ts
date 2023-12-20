// テーブル以外をexportしない
import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { luciaTableNames } from "../auth/auth";

export const users = sqliteTable(luciaTableNames.user, {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  googleId: text("google_id").unique().notNull(),
  name: text("name").notNull(),
  profile: text("profile").notNull(),
});

export const usersRelations = relations(users, ({ many }) => ({
  sessions: many(sessions),
}));

export const sessions = sqliteTable(luciaTableNames.session, {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, {
    fields: [sessions.userId],
    references: [users.id],
  }),
}));

export const signupSessions = sqliteTable("signup_sessions", {
  id: text("id").primaryKey(),
  googleUserId: text("google_user_id").unique().notNull(),
  expires: integer("expires").notNull(),
});

export const tasks = sqliteTable("tasks", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => createId()),
  title: text("title").notNull(),
  description: text("description").notNull(),
  createdAt: text("created_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  updatedAt: text("updated_at")
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
});
