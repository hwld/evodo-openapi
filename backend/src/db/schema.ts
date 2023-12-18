// テーブル以外をexportしない
import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { luciaTableNames } from "../auth/lucia";

export const usersTable = sqliteTable(luciaTableNames.user, {
  id: text("id").primaryKey(),
  googleId: text("google_id").unique().notNull(),
  name: text("name").notNull(),
  profile: text("profile").notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  sessions: many(sessionsTable),
}));

export const sessionsTable = sqliteTable(luciaTableNames.session, {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  expiresAt: integer("expires_at").notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

export const signupSessionsTable = sqliteTable("signup_session", {
  id: text("id").primaryKey(),
  googleUserId: text("google_user_id").unique().notNull(),
  expires: integer("expires").notNull(),
});

export const tasksTable = sqliteTable("tasks", {
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
