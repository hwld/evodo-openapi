import type { Config } from "jest";

const config: Config = {
  testMatch: ["**/*.test.ts"],
  preset: "ts-jest/presets/js-with-ts",
  // yamlのパッケージがimportを使ってるので、ts-jestのpresetでCJSに変換する
  // デフォルトだとnode_modulesが全部ignoreに入ってるので、yaml以外を指定する。ここの書き方なんか間違ってるかも
  // また、tsconfig.jsonでallowJsをtrueにする必要がある。
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/
  transformIgnorePatterns: ["node_modules/.pnpm/(?!(yaml))"],
  transform: {
    "^.+\\.tsx?$": [
      "ts-jest",
      {
        useESM: true,
      },
    ],
  },
  setupFilesAfterEnv: ["<rootDir>/setup-jest.ts"],
};

module.exports = config;
