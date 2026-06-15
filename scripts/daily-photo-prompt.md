# Daily「Write About the Photo」生成仕様

毎日、新しい写真課題を1問つくる。**実在の写真を取得 → その画像を実際に見て（Readツールで画像を開く）→ 写真に一致した模範解答とTipsを生成**する。
出力は次の2ファイル：

- `public/daily-photo.jpg` … 当日の写真（実写真。同一オリジン配信のため public/ に保存する）
- `public/daily-photo.json` … 当日の設問・模範解答・和訳・Tips

## 手順

1. **シーンを決める**：日常で描写しやすい場面を1つ選ぶ（人＋場所＋動きがあるものが望ましい）。
   例：market / cafe / kitchen / park family / classroom / train station / street food / library / beach / farm / office / playground / concert / sports / cooking など。
   **前日までと題材が重ならないように**毎回変える（曜日や日付で変化をつける）。

2. **写真を取得**（無料・キー不要の LoremFlickr。実在写真でCORSも対応）：
   ```bash
   cd /Users/ouchan/duolingoenglishtest
   curl -sL -m 60 "https://loremflickr.com/1024/768/<keyword>?lock=<N>" -o public/daily-photo.jpg -w "%{http_code} %{size_download}\n"
   ```
   - `<keyword>` は半角カンマ区切りで複数タグ可（例 `cafe,people`）。`<N>` は日付から決める整数（同じ画像を固定するため）。
   - サイズが極端に小さい（< 15000 byte）場合は失敗とみなし、`<N>` を変えて取り直す。

3. **画像を必ず見る**：Read ツールで `public/daily-photo.jpg` を開いて内容を確認する。
   - 大きなウォーターマーク・枠・文字が画像を覆っている／真っ暗／人工的すぎて描写に向かない場合は、`<N>` か `<keyword>` を変えて2〜3回まで取り直し、**きれいで描写しやすい写真**を選ぶ。
   - 採用した写真に「実際に写っているもの」を基に以降を書く（推測で書かない）。

4. **内容を生成**（すべて写真の実際の内容に忠実に）：
   - `modelAnswer`：英語の模範解答。80〜110語。場所・人・していること・雰囲気を具体的に。自然で整った英語にするが、**難しすぎる単語は避け、中学・高校で習うレベルの語を中心に**する（DET 110 を目指す学習者が真似できる範囲）。
   - `modelAnswerJa`：modelAnswer の正確な日本語訳。
   - `tips`：5〜7個。`{ "term": 英語, "ja": 日本語の意味 }`。**中学・高校で習う、一般的ですぐ自分でも使えるようになる単語・熟語・言い換えだけ**にする（難語・専門語は不可）。その写真の描写に役立つ表現を選ぶ。
   - `prompt`：英語の設問（例：`Describe what you see in this photo in detail: where it is, who is there, what is happening, and what kind of atmosphere it has.`）。
   - `theme`：写真の内容を表す短い日本語メモ。
   - `date`：実行日の `YYYY-MM-DD`（JST）。
   - `image`：`"/daily-photo.jpg?v=<date>"`（末尾の `?v=日付` はブラウザキャッシュ対策。必ず付ける）。

5. **JSON を書き出す**：`public/daily-photo.json` を下記スキーマで丸ごと上書き。コメント・末尾カンマ禁止。

   ```json
   {
     "date": "YYYY-MM-DD",
     "image": "/daily-photo.jpg?v=YYYY-MM-DD",
     "prompt": "…",
     "theme": "…",
     "modelAnswer": "…",
     "modelAnswerJa": "…",
     "tips": [ { "term": "…", "ja": "…" } ]
   }
   ```

6. **検証**：
   ```bash
   cd /Users/ouchan/duolingoenglishtest && node -e "const j=JSON.parse(require('fs').readFileSync('public/daily-photo.json','utf8')); if(!j.modelAnswer||!Array.isArray(j.tips)||j.tips.length<5) throw new Error('invalid daily-photo.json')"
   ```
   エラーが出たら修正して再検証する。

7. **コミット&プッシュ**（画像とJSONの両方）：
   ```bash
   cd /Users/ouchan/duolingoenglishtest && git add public/daily-photo.jpg public/daily-photo.json && git commit -m "chore: daily photo $(date +%F)" && git push
   ```

## 成功条件
- きれいで描写しやすい新しい写真が `public/daily-photo.jpg` に保存されている。
- その写真に**一致した** modelAnswer / modelAnswerJa / tips（中高レベル語）が `public/daily-photo.json` にある。
- JSON が妥当で、main に commit & push 済み。
- 生成や取得に失敗した場合はコミットしないこと（前日の状態を残す）。
