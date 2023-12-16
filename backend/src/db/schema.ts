// テーブル以外をexportしない
import { relations, sql } from "drizzle-orm";
import { text, sqliteTable, integer } from "drizzle-orm/sqlite-core";
import { createId } from "@paralleldrive/cuid2";
import { luciaTableNames } from "../auth/lucia";

export const usersTable = sqliteTable(luciaTableNames.user, {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
});

export const usersRelations = relations(usersTable, ({ many }) => ({
  keys: many(userKeysTable),
  sessions: many(sessionsTable),
}));

export const userKeysTable = sqliteTable(luciaTableNames.key, {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  hashedPassword: text("hashed_password"),
});

export const userKeysRelations = relations(userKeysTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userKeysTable.userId],
    references: [usersTable.id],
  }),
}));

export const sessionsTable = sqliteTable(luciaTableNames.session, {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .references(() => usersTable.id, { onDelete: "cascade" })
    .notNull(),
  activeExpires: integer("active_expires").notNull(),
  idleExpires: integer("idle_expires").notNull(),
});

export const sessionsRelations = relations(sessionsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [sessionsTable.userId],
    references: [usersTable.id],
  }),
}));

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
