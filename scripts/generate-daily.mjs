// =============================================================
// DET アプリの毎日コンテンツをクラウド(GitHub Actions)で生成するスクリプト。
//   A) public/daily-questions.json … Reading/Listening 問題
//   B) public/daily-photo.jpg + public/daily-photo.json … Write About the Photo
// Anthropic API(Claude)で生成。ANTHROPIC_API_KEY 環境変数が必要。
// 各パートは独立。片方が失敗しても他方は実行する（変更があったファイルだけ commit する）。
// =============================================================
import Anthropic from "@anthropic-ai/sdk";
import { readFileSync, writeFileSync } from "node:fs";

const client = new Anthropic(); // ANTHROPIC_API_KEY を環境から読む
const MODEL = "claude-haiku-4-5"; // コスト最適・vision対応

// JST の今日(YYYY-MM-DD)。Actions は UTC で動くため +9h する。
const TODAY = new Date(Date.now() + 9 * 3600 * 1000).toISOString().slice(0, 10);

function textOf(message) {
  return message.content
    .filter((b) => b.type === "text")
    .map((b) => b.text)
    .join("");
}

function stripFences(s) {
  return s
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();
}

// ---------- A) Reading/Listening 問題 ----------
async function generateQuestions() {
  const spec = readFileSync("scripts/daily-questions-prompt.md", "utf8");
  let example = "";
  try {
    example = readFileSync("public/daily-questions.json", "utf8");
  } catch {
    example = "";
  }

  const prompt = `あなたは DET(Duolingo English Test) 対策アプリの問題作成者です。
以下の【仕様】に厳密に従い、新しい daily-questions.json の中身を生成してください。
構造は【現在のファイル(例)】と完全に同じ形にし、内容(トピック・語彙・題材)は前回と重ならないよう毎回変えてください。
- generatedAt は "${TODAY}"。id は daily-<type>-<n> 形式で重複させない。
- 難易度は B2〜C1 中心。
- 出力は **生のJSONのみ**（マークダウンのコードフェンスや説明文を一切付けない）。

【仕様】
${spec}

【現在のファイル(例 / この構造に合わせる)】
${example}`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 14000,
    messages: [{ role: "user", content: prompt }],
  });

  const parsed = JSON.parse(stripFences(textOf(res)));
  if (
    !parsed ||
    !Array.isArray(parsed.readingQuestions) ||
    !Array.isArray(parsed.listeningQuestions) ||
    parsed.readingQuestions.length === 0 ||
    parsed.listeningQuestions.length === 0
  ) {
    throw new Error("invalid daily-questions.json shape");
  }
  parsed.generatedAt = TODAY;
  writeFileSync("public/daily-questions.json", JSON.stringify(parsed, null, 2));
  console.log(
    `questions OK: reading=${parsed.readingQuestions.length} listening=${parsed.listeningQuestions.length}`,
  );
}

// ---------- B) Write About the Photo ----------
const PHOTO_KEYWORDS = [
  "farmers market",
  "cafe people",
  "kitchen cooking",
  "park family",
  "classroom students",
  "train station",
  "street food",
  "library reading",
  "beach summer",
  "farm animals",
  "office meeting",
  "playground children",
  "outdoor concert",
  "sports stadium",
  "city street night",
  "bakery shop",
  "garden flowers",
  "mountain hiking",
  "fishing harbor",
  "art museum",
];

const PHOTO_SCHEMA = {
  type: "object",
  additionalProperties: false,
  properties: {
    theme: { type: "string" },
    modelAnswer: { type: "string" },
    modelAnswerJa: { type: "string" },
    tips: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        properties: { term: { type: "string" }, ja: { type: "string" } },
        required: ["term", "ja"],
      },
    },
  },
  required: ["theme", "modelAnswer", "modelAnswerJa", "tips"],
};

function dayIndex(dateStr) {
  let h = 0;
  for (const ch of dateStr) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

async function fetchPhoto() {
  const base = dayIndex(TODAY);
  const keyword = PHOTO_KEYWORDS[base % PHOTO_KEYWORDS.length];
  // 取得できる/十分なサイズになるまで lock を変えて数回試す
  for (let i = 0; i < 4; i++) {
    const lock = (base % 90) + 1 + i;
    const url = `https://loremflickr.com/1024/768/${encodeURIComponent(keyword)}?lock=${lock}`;
    try {
      const r = await fetch(url);
      if (!r.ok) continue;
      const buf = Buffer.from(await r.arrayBuffer());
      if (buf.length < 15000) continue; // 小さすぎ=失敗扱い
      writeFileSync("public/daily-photo.jpg", buf);
      return { keyword, base64: buf.toString("base64") };
    } catch {
      // 次の lock を試す
    }
  }
  throw new Error("could not fetch a usable photo");
}

async function generatePhoto() {
  const { keyword, base64 } = await fetchPhoto();

  const instruction = `この写真は DET の「Write About the Photo」(写真を1分で英語描写する課題)用です。写真の実際の内容だけに基づいて、日本語/英語で次を作ってください。
- theme: 写真の内容を表す短い日本語メモ。
- modelAnswer: 英語の模範解答(80〜110語)。場所・人や物・していること・雰囲気を具体的に。自然だが**難しすぎる単語は避け、中学・高校で習うレベルの語を中心に**。
- modelAnswerJa: modelAnswer の正確な日本語訳。
- tips: 5〜7個。各 {term:英語, ja:日本語の意味}。**中学・高校で習う、一般的ですぐ使える単語・熟語・言い換えだけ**。その写真の描写に役立つもの。
写真に写っていないものは書かないこと。`;

  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 2000,
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: { type: "base64", media_type: "image/jpeg", data: base64 },
          },
          { type: "text", text: instruction },
        ],
      },
    ],
    output_config: { format: { type: "json_schema", schema: PHOTO_SCHEMA } },
  });

  const gen = JSON.parse(textOf(res));
  if (!gen.modelAnswer || !Array.isArray(gen.tips) || gen.tips.length < 5) {
    throw new Error("invalid daily-photo content");
  }
  const out = {
    date: TODAY,
    image: `/daily-photo.jpg?v=${TODAY}`,
    prompt:
      "Describe what you see in this photo in detail: where it is, who is there, what is happening, and what kind of atmosphere it has.",
    theme: gen.theme || null,
    modelAnswer: gen.modelAnswer,
    modelAnswerJa: gen.modelAnswerJa || null,
    tips: gen.tips,
  };
  writeFileSync("public/daily-photo.json", JSON.stringify(out, null, 2));
  console.log(`photo OK: keyword="${keyword}" tips=${gen.tips.length}`);
}

// ---------- main ----------
let failures = 0;
try {
  await generateQuestions();
} catch (e) {
  failures++;
  console.error("questions FAILED:", e.message);
}
try {
  await generatePhoto();
} catch (e) {
  failures++;
  console.error("photo FAILED:", e.message);
}
// 両方失敗したときだけ非ゼロ終了(ワークフローを赤くする)。片方成功なら緑のまま commit。
if (failures >= 2) process.exit(1);
