import type { Config } from "jest";

const config: Config = {
  testMatch: ["**/*.test.ts"],
  preset: "ts-jest/presets/js-with-ts",
  // yamlのパッケージがimportを使ってるので、ts-jestのpresetでCJSに変換する
  // デフォルトだとnode_modulesが全部ignoreに入ってるので、yaml以外を指定する。ここの書き方なんか間違ってるかも
  // また、tsconfig.jsonでallowJsをtrueにする必要がある。
  // https://kulshekhar.github.io/ts-jest/docs/getting-started/presets/
  // importを使うパッケージを都度都度ここに書かなきゃいけない・・・
  transformIgnorePatterns: [
    "node_modules/.pnpm/(?!(yaml|lucia|oslo|@lucia|arctic))",
  ],
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
