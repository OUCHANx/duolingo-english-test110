# DET 110 学習管理アプリ

Duolingo English Test (DET) で **2026-09-30 までに 110点** を達成するための、毎日の学習管理・弱点分析・進捗管理アプリ。

- **Reading / Listening**：アプリ内で演習（毎回新しい問題を自動生成）
- **Speaking**：Cambly の記録を管理
- **Writing**：ChatGPT 添削の記録を管理
- 弱点分析・スコア進捗・復習（SRS）・今日のメニュー自動生成

技術：Next.js (App Router) + TypeScript + Tailwind CSS。データは最初 localStorage（後で Supabase に移行しやすい Repository 設計）。

## 開発・起動

```bash
npm install
npm run dev      # http://localhost:3000
```

本番ビルド：

```bash
npm run build && npm start
```

## 毎日の問題を自動更新（Routine）

`public/daily-questions.json` を読み込み、アプリ内の演習プールに合流させます（無ければ内蔵の自動生成にフォールバック）。

このファイルを **毎日クラウドの Routine（定期実行エージェント）で再生成**することで、毎日新しい問題（特に Interactive Reading / Complete the Sentences の良問）を補給できます。

- 生成の指示書：[`scripts/daily-questions-prompt.md`](scripts/daily-questions-prompt.md)
- Routine の設定：このリポジトリを GitHub に接続し、上記プロンプトを毎日実行 → `public/daily-questions.json` を更新してコミットするよう設定します。
- ローカルで反映：`git pull` 後、アプリを再読み込み（デプロイしている場合は自動反映）。

## 主なディレクトリ

```
app/                 各ページ（App Router）
components/ui/        汎用UI
components/features/  機能別コンポーネント
lib/                 型・採点・集計・SRS・生成・辞書・永続化
public/daily-questions.json  Routine が更新する問題ファイル
scripts/             Routine 用の生成指示書
```
