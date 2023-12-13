import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: { target: "http://localhost:8787/doc" },
    output: {
      workspace: "./src/api/",
      target: "index.ts",
      client: "react-query",
      mode: "split",
    },
  },
});
