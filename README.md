# app-itonami-koke — Koke

苔 — 外からの信号（CO₂）を取り込み、構造化した vertex（glucose）として固定する一次固定の層です。炭素の登録・放出と相殺の記録を扱います。

Tauri **3.0.0-alpha.6** の独立 app（`tauri-runtime-wry`、OS の WebView）と、同じファイルの static Web ビルドです。記録はすべてこの端末の中（localStorage、key `itonami.koke.v1`）に保存し、外部へは通信しません。外部操作の宣言もありません（`dist/descriptor.json` の `operations: []`）。保存に失敗したときは画面に表示します。

## できること

| 操作 | 内容 |
| --- | --- |
| 炭素を登録 (registerCarbon) | — |
| 炭素を放出 (releaseCarbon) | — |
| 相殺を記録 (recordOffset) | — |
| 相殺の一覧 (listOffsets) | — |

記録（collection）: `cloud.itonami.koke.batch`、`cloud.itonami.koke.offset`、`cloud.itonami.koke.release`

## 補足

- koke（固定）→ hakkou（発酵）→ ki（吸収）の流れの最初の段です。各 app は独立していて、app 同士はデータを受け渡しません（それぞれの端末内の記録です）。
- domain の詳しい説明は [`docs/domain.md`](docs/domain.md)（旧 `kotoba/README.md`）にあります。

## 構成

| パス | 役割 |
| --- | --- |
| `src/domain/` | domain logic（TypeScript）。ビルド時に Node の type stripping で JS にします（bundler・依存なし） |
| `src/local-store.js` | この端末内の record store。domain が使う `read` / `write` を localStorage で実装 |
| `src/app-def.js` | 画面の操作と domain 関数・collection の対応 |
| `src/ui/` | 依存なしの UI。DOM はテキストノードだけで組み、HTML 文字列を使いません（CSP `style-src 'self'`） |
| `vendor/` | kotoba-lang/kotoba の `kotoba-client-runtime.js` / consent CSS と `PINS.json`。`scripts/build.mjs` が digest のずれで失敗します |
| `src-tauri/` | Tauri v3 host。read-only command は `awai_host_info` の 1 つだけ。filesystem・network・shell・installer 権限なし |
| `cljs/` | 旧 ClojureScript UI（amu でビルド）。この app のビルド・テストでは使いません |

## コマンド

```sh
npm ci
npm test              # build してから domain と local-only のテスト（koke.test.ts, local-only.test.mjs）
npm run build         # dist/ と SHA-256 の release.json
npm run build:desktop # native desktop 実行ファイル（bundle・署名なし）
```

## 状態と制限（AWAI-3079, 2026-11-17）

- 旧構成（Cloudflare Worker の XRPC dispatcher / adapter、`wrangler.jsonc`、`@etzhayyim/sdk`）は削除しました。履歴は git にあります。
- 検証済み: `npm test`、`npm run build`、`cargo check`（Tauri 3.0.0-alpha.6）。
- 未検証: native window の起動、`tauri build`、Android、署名、配布。アイコンは app-soshiki の仮アイコンです。
