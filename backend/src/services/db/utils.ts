import { sql } from "drizzle-orm";

export const currentTime = () => {
  return sql`strftime('%Y/%m/%d %H:%M:%S', 'now')`;
};

export const formatDate = (date: Date) => {
  const yyyy = `${date.getFullYear()}`;
  const mm = `${date.getMonth() + 1}`.padStart(2, "0");
  const dd = `${date.getDate()}`.padStart(2, "0");
  const h = `${date.getHours()}`.padStart(2, "0");
  const m = `${date.getMinutes()}`.padStart(2, "0");
  const s = `${date.getSeconds()}`.padStart(2, "0");

  return `${yyyy}/${mm}/${dd} ${h}:${m}:${s}`;
};
