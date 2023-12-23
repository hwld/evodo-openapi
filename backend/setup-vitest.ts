import { DrizzleD1Database, drizzle } from "drizzle-orm/d1";
import { Miniflare } from "miniflare";
import * as schema from "./src/services/db/schema";
import { SQLiteTable, getTableConfig } from "drizzle-orm/sqlite-core";
import { beforeAll, beforeEach, afterAll } from "vitest";

export let testD1: D1Database;
export let testKv: KVNamespace;
export let testDb: DrizzleD1Database<typeof schema>;
let mf: Miniflare;

beforeAll(async () => {
  mf = new Miniflare({
    name: "main",
    modules: true,
    script: "",
    // wrangler.tomlのenv.testのdatabase_idに合わせる。
    d1Databases: { DB: "test" },
    // wrangler.tomlのenv.testのkv_namespacesのidに合わせる
    kvNamespaces: { KV: "test" },
    d1Persist: "./.wrangler/state/v3/d1",
  });
  testD1 = await mf.getD1Database("DB");
  testKv = (await mf.getKVNamespace("KV")) as KVNamespace;
  testDb = drizzle(testD1, { schema });
});

beforeEach(async () => {
  await testD1.exec("PRAGMA foreign_keys = false;");

  // D1のリセット
  for (const key in schema) {
    const maybeTable = (schema as any)[key];
    if (!(maybeTable instanceof SQLiteTable)) {
      continue;
    }
    const tableName = getTableConfig(maybeTable).name;
    await testD1.exec(`DELETE FROM ${tableName}`);
  }

  // Kvのリセット
  // listは最大1000件までしか取得できないので、それ以上追加してると全部消せない
  const { keys } = await testKv.list();
  await Promise.all(keys.map(({ name }) => testKv.delete(name)));

  await testD1.exec("PRAGMA foreign_keys = true;");
});

afterAll(() => {
  mf.dispose();
});
