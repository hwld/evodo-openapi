import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    // https://medium.com/drizzle-stories/we-dont-make-mistakes-cc89f98e79fc
    // にd1の設定があるけど、ローカルのdbに向いてるわけじゃなさそうなので・・・
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/d1c8be631b887896afd4bb09b48706852a5381e2268fb8c1445b1a6347170fb6.sqlite",
  },
} satisfies Config;
