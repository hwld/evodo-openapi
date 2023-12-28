import { sql } from "drizzle-orm";

export const currentTime = () => {
  return sql`DATETIME('now', 'localtime')`;
};
