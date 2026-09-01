# やること — TODO アプリ

Next.js (App Router) + TypeScript + Tailwind CSS 4 製のシンプルな TODO アプリ。
サーバーを持たず、タスクはブラウザの `localStorage` に保存されます。

## 機能

- **追加 / 編集 / 削除** — 追加は Enter、編集は行のダブルクリック（または鉛筆アイコン）。編集中は Enter で保存、Esc で取り消し。
- **完了トグル** — チェックボックス。「すべて完了にする / すべて未完了に戻す」も可能。
- **期限** — 任意の日付を設定でき、`今日` `明日` `3日後` `2日超過` のように残り日数で表示。超過は赤、当日は黄色。
- **絞り込み** — すべて / 未完了 / 完了 のタブと、キーワード検索（`/` キーでフォーカス）。
- **並べ替え** — 行のドラッグ、またはグリップにフォーカスして上下キー。全件表示のときのみ有効。
- **元に戻す** — 削除と「完了済みを削除」は 7 秒間だけトーストから取り消せる。
- **配色** — OS 設定 / ライト / ダークを切り替え。初回ペイント前にテーマを確定するのでチラつかない。
- **タブ間同期** — 別タブでの変更を `storage` イベントで取り込む。

## 起動

```bash
npm install
npm run dev      # http://localhost:3000
```

### 静的ファイルとして配信する

`next.config.ts` で `output: "export"` を指定しているため、ビルドすると `out/` に
完全な静的サイトが書き出されます。任意の静的サーバーで配信できます。

```bash
npm run build     # out/ を生成
npm run preview   # http-server で out/ を配信 → http://localhost:8080
```

> **注意**: `npx http-server` をプロジェクト直下で引数なしに実行すると、`http-server` は
> `public/` を既定のルートにするため SVG のファイル一覧が表示されます。
> 必ず `out` を明示してください（`npm run preview` がそれを行います）。

## コマンド

| コマンド | 内容 |
| --- | --- |
| `npm run dev` | 開発サーバー（Turbopack） |
| `npm run build` | 静的書き出し（`out/`） |
| `npm run preview` | `out/` を http-server で配信（8080番） |
| `npm test` | 状態遷移と日付ユーティリティのユニットテスト |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run lint` | ESLint |

`npm start`（`next start`）は静的書き出し時には使えません。Node サーバーで動かしたい場合は
`next.config.ts` の `output: "export"` を外してください。

## 構成

```
src/
  app/
    layout.tsx          ルートレイアウト。テーマ先読みスクリプトを含む
    page.tsx            TodoApp を描画するだけ
    globals.css         Tailwind の読み込みとテーマ変数
  components/
    todo-app.tsx        画面全体の組み立て・フィルタ・取り消し
    todo-input.tsx      追加フォーム
    todo-list.tsx       一覧とドラッグ＆ドロップ
    todo-item.tsx       1 行（表示・編集・並べ替えハンドル）
    filter-bar.tsx      タブと検索
    theme-toggle.tsx    配色切り替え
    undo-toast.tsx      取り消しトースト
    icons.tsx           インライン SVG アイコン
  hooks/
    use-todos.ts        reducer と localStorage の同期
    use-theme.ts        テーマの購読と反映
  lib/
    todo-reducer.ts     状態遷移（純粋関数・テスト対象）
    storage.ts          localStorage の読み書きと検証
    date.ts             期限の表示ロジック
    types.ts            型と表示ラベル
```

状態遷移は `src/lib/todo-reducer.ts` に純粋関数として切り出してあり、React に依存せずテストできます。

## データについて

タスクは `localStorage` のキー `todo-app:v1`、配色は `todo-app:theme` に保存されます。
ブラウザやプロファイルをまたいだ同期はしません。保存できない環境（プライベートモードなど）でも
操作は続行でき、リロード時に内容が失われるだけです。
