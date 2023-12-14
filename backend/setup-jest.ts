import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Miniflare } from "miniflare";
import * as schema from "./src/db/schema";
import { SQLiteTable, getTableConfig } from "drizzle-orm/sqlite-core";

export let testD1: D1Database;
export let testDb: DrizzleD1Database<typeof schema>;
let mf: Miniflare;

beforeAll(async () => {
  mf = new Miniflare({
    name: "main",
    modules: true,
    script: "",
    // wrangler.tomlのenv.testのdatabase_idに合わせる。
    d1Databases: { DB: "test" },
    d1Persist: "./.wrangler/state/v3/d1",
  });
  testD1 = await mf.getD1Database("DB");
  testDb = drizzle(testD1, { schema });
});

afterEach(async () => {
  await testD1.exec("PRAGMA foreign_keys = false;");
  for (const key in schema) {
    const table = (schema as any)[key] as SQLiteTable;
    const tableName = getTableConfig(table).name;
    await testD1.exec(`DELETE FROM ${tableName}`);
  }
  await testD1.exec("PRAGMA foreign_keys = true;");
});

afterAll(() => {
  mf.dispose();
});
