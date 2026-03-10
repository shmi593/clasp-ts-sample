# clasp-ts-sample

Google Apps Script (GAS) を TypeScript で開発するサンプルリポジトリ

## Overview

このリポジトリは、Google Apps Script(GAS) のコードベースを TypeScript で管理し、clasp でデプロイするためのサンプルです。

## Architecture / Structure

```
clasp-ts-sample/
├── src/
│   ├── index.ts       # エントリーポイント (GAS メイン関数を定義)
│   └── lib.ts         # ロジック関数群 (hello, getCellValue など)
├── tests/
│   └── lib.test.ts    # ユニットテスト (Vitest)
├── dist/              # ビルド出力 (rolldown)
├── build.ts           # ビルド設定スクリプト
├── tsconfig.json      # TypeScript 設定
├── biome.json         # Biome (フォーマッター/リンター) 設定
├── vitest.config.ts   # Vitest 設定
└── package.json       # プロジェクト設定
```

### ビルドフロー

1. TypeScript コードが `rolldown` でバンドルされる
2. `ts-morph` が、エクスポートされた関数を自動抽出
3. 抽出した関数ごとに GAS 呼び出し可能なラッパーを生成
   - index.ts で `export` された関数を GAS から呼び出し可能にするためのコードを自動生成
4. 最終的に `dist/index.js` に GAS で実行可能なコードが出力される

## Setup

### 必須要件

- Node.js 18+
- pnpm 10.30.3+
- Google Apps Script の有効なプロジェクト (clasp でセットアップ済み)

### 開発

```bash
# 依存関係のインストール
pnpm install

# ビルド
pnpm build

# テスト
pnpm test

# format
pnpm format

# 型チェック + Lint + format チェック
pnpm check
```

### デプロイ

```bash
# ビルド後に GAS にプッシュしてバージョンタグを付与
pnpm push
```

この実行には `clasp login` で認証済みの環境が必要です。

## Notes

- 関数は `src/index.ts` で `export` する必要があります（GAS で呼び出し可能にするため）
- `clasp push` 時に自動でバージョンタグが付与されます（Git ショートハッシュ付き）
