# evodo-openapi

<img src="https://raw.githubusercontent.com/hwld/evodo-openapi/main/images/evodo-openapi.png" alt="screenshot">

## 概要

hono+OpenAPI を試すために作った Todo リスト  
monorepo で作ってるけど、OpenAPI を試したいから`hono RPC`ではなくて`@hono/openapi-zod`を使う。

## 使用する技術(想定)

- TypeScript
- hono
- @hono/openapi-zod
- vite
- React
- openapi-zod-client
- lucia + oslo + arctic
- vitest

## インフラ(想定)

- Cloudflare Workers
- Cloudflare Pages

## メモ

- drizzleのスキーマをリセットした場合は、`backend/.wrangler/state/v3/d1`にあるsqliteファイルを手動で削除してから`pnpm migrations:apply`をする
