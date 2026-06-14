# 毎日の問題生成タスク（Routine 用）

あなたは DET（Duolingo English Test）対策アプリの問題作成者です。
このリポジトリの `public/daily-questions.json` を、**今日付けの新しい問題**で上書きしてください。

## 手順
1. 既存の `public/daily-questions.json` を読んで形式（スキーマ）を把握する。
2. 下記ルールに従い、**新しく多様な問題**を生成して JSON 全体を作り直す。
3. `public/daily-questions.json` に書き出す（整形済み・有効な JSON）。
4. `node -e "JSON.parse(require('fs').readFileSync('public/daily-questions.json','utf8'))"` で JSON が壊れていないか検証する。
5. 変更を commit して push する（コミットメッセージ例: `chore: daily questions YYYY-MM-DD`）。

## 生成ルール
- `generatedAt` は実行日の `"YYYY-MM-DD"`。
- 毎回**前回と異なる**題材・語彙・文にする（トピックは学習/科学/環境/仕事/健康/技術/日常など幅広く）。
- 難易度は B2〜C1 中心。英文は自然でひとつの完結した文。
- id は重複しないよう `daily-<type>-<n>` 形式（例 `daily-ir-1`）。
- 各形式の数の目安：read_and_select 2、read_and_complete 4、complete_the_sentences 2、interactive_reading 1〜2、listen_and_type 6。
- **特に Interactive Reading と Complete the Sentences を重視**（内蔵の自動生成では作れない、文脈・解説つきの良問を）。

## スキーマ（型）
`readingQuestions[]` の各要素：
- 共通: `id`(string), `userId`(null), `createdAt`/`updatedAt`(ISO文字列), `difficulty`("easy"|"medium"|"hard"), `cefr`("B1"|"B2"|"C1"|null), `prompt`(string), `passage`(null), `tags`(string[]), `source`("daily")
- `taskType` と `payload` の対応:
  - `read_and_select`: `payload = { timeLimitSec: 70, words: [{id, text, isReal:boolean}] }`（実在語と、英語らしいが**実在しない偽単語**を半々程度）
  - `read_and_complete`: `payload = { text: "... {{b1}} ... {{b2}} ...", blanks: [{id:"b1", full:"正解語", keepHead: 先頭から見せる文字数}] }`（keepHead は語長の約半分、最低2）
  - `complete_the_sentences`: `payload = { gaps: [{id, before, after, options:string[4], answerIdx, tag:("grammar"|"collocation"|"vocab"|"cohesion"), explanation:"日本語の短い解説"}] }`
  - `interactive_reading`: `payload = { title, paragraphs: string[3前後], questions: IRQuestion[] }`
    - IRQuestion の kind 別:
      - `identifyIdea`: `{kind, id, prompt, options:string[], answerIdx}`
      - `completeSentence`: `{kind, id, before, after, options:string[], answerIdx, tag}`
      - `highlight`: `{kind, id, prompt, spans:[{id,text}], answerSpanId}`（spans の text は本文中の語句）
      - `insertSentence`: `{kind, id, sentence, slots:string[], answerSlot}`
      - `summarize`: `{kind, id, prompt, options:string[], answerIdx}`

`listeningQuestions[]` の各要素：
- `id, userId:null, createdAt, updatedAt, taskType:"listen_and_type", difficulty, cefr, audioUrl:null, transcript:"英文", prompt:null, tags:["listen-chunk"], source:"daily", payload:{rate:0.9, voiceHint:"en-US", maxReplays:3}`

## 注意
- `tags` に使える値: vocab / spelling / grammar / collocation / reading-detail / reading-gist / inference / cohesion / listen-phoneme / listen-funcword / listen-chunk / listen-numeral。
- 偽単語は実在語にならないよう注意（不安なら無難な綴りの造語に）。
- JSON にコメントや末尾カンマを入れない。
