import type { Config } from "drizzle-kit";

export default {
  schema: "./src/services/db/schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    // https://medium.com/drizzle-stories/we-dont-make-mistakes-cc89f98e79fc
    // にd1の設定があるけど、ローカルのdbに向いてるわけじゃなさそうなので・・・
    url: ".wrangler/state/v3/d1/miniflare-D1DatabaseObject/8d07c1a737cca2e3aa0c5ace389a07c4276a8a8583d1070dd0b8ed2d1ff4b535.sqlite",
  },
} satisfies Config;
