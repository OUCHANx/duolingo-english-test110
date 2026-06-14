// =============================================================
// 採点：すべて純粋関数 (payload, answer) => GradeOutput
//   保存層から独立。弱点タグへの正規化と復習素材の生成までを担う。
// =============================================================
import type {
  ClozeAnswer,
  ClozePayload,
  CompleteSentencesAnswer,
  CompleteSentencesPayload,
  GradedItem,
  GradeOutput,
  InteractiveAnswer,
  InteractiveReadingPayload,
  IRQuestion,
  ListenTypeAnswer,
  ReadSelectAnswer,
  ReadSelectPayload,
  ReviewSeed,
  WeaknessTag,
} from "./types";
import { alignTokens, classifyDiff, levenshtein, tokenize, werCounts } from "./diff";
import { meaningOf } from "./dictionary";

// ---------- 1. Read and Select（実在語/偽単語）----------
export function gradeReadSelect(
  payload: ReadSelectPayload,
  ans: ReadSelectAnswer,
): GradeOutput {
  const items: GradedItem[] = [];
  let hit = 0;
  let falseAlarm = 0;
  let realTotal = 0;
  let correctCount = 0;
  for (const w of payload.words) {
    const picked = !!ans[w.id];
    if (w.isReal) realTotal++;
    const correct = picked === w.isReal;
    if (correct) correctCount++;
    if (w.isReal && picked) hit++;
    if (!w.isReal && picked) falseAlarm++;
    items.push({
      ref: w.id,
      correct,
      expected: w.isReal ? "実在語" : "偽単語",
      given: picked ? "実在と判定" : "見送り",
      tags: ["vocab"],
    });
  }
  const fakeTotal = payload.words.length - realTotal;
  // 命中率 − 誤警報率（「全部Yes」攻略を防ぐ）。
  // 片側が0件のセットでは指標が破綻するため、その場合は素の正答率にフォールバック。
  const score01 =
    realTotal > 0 && fakeTotal > 0
      ? Math.max(0, hit / realTotal - falseAlarm / fakeTotal)
      : payload.words.length
        ? correctCount / payload.words.length
        : 0;
  // 復習：見落とした実在語のみ
  const reviewSeeds: ReviewSeed[] = payload.words
    .filter((w) => w.isReal && !ans[w.id])
    .map((w) => ({
      kind: "word",
      front: w.text,
      back: meaningOf(w.text) ?? "（意味を追加）",
      tags: ["vocab"],
    }));
  return {
    score01,
    correctCount,
    itemCount: payload.words.length,
    items,
    reviewSeeds,
  };
}

// ---------- 2. Read and Complete（クローズ穴埋め）----------
export function gradeReadComplete(
  payload: ClozePayload,
  ans: ClozeAnswer,
): GradeOutput {
  const items: GradedItem[] = [];
  const reviewSeeds: ReviewSeed[] = [];
  let correctCount = 0;
  for (const b of payload.blanks) {
    const expectedTail = b.full.slice(b.keepHead).toLowerCase();
    const given = (ans[b.id] ?? "").trim().toLowerCase();
    const correct = given === expectedTail;
    if (correct) correctCount++;
    const sim =
      1 - levenshtein(given, expectedTail) / Math.max(expectedTail.length, 1);
    const tags: WeaknessTag[] =
      sim >= 0.8 && !correct ? ["spelling"] : ["vocab", "spelling"];
    items.push({
      ref: b.id,
      correct,
      expected: b.full,
      given: b.full.slice(0, b.keepHead) + given,
      partial: Math.max(0, sim),
      tags,
    });
    if (!correct) {
      const m = meaningOf(b.full);
      reviewSeeds.push({
        kind: "word",
        front: `${b.full.slice(0, b.keepHead)}${"_".repeat(Math.max(1, b.full.length - b.keepHead))}`,
        back: m ? `${b.full}（${m}）` : b.full,
        tags,
      });
    }
  }
  return {
    score01: payload.blanks.length
      ? correctCount / payload.blanks.length
      : 0,
    correctCount,
    itemCount: payload.blanks.length,
    items,
    reviewSeeds,
  };
}

// ---------- 3. Complete the Sentences（文脈選択）----------
export function gradeCompleteSentences(
  payload: CompleteSentencesPayload,
  ans: CompleteSentencesAnswer,
): GradeOutput {
  const items: GradedItem[] = [];
  const reviewSeeds: ReviewSeed[] = [];
  let correctCount = 0;
  for (const g of payload.gaps) {
    const given = ans[g.id];
    const correct = given === g.answerIdx;
    if (correct) correctCount++;
    items.push({
      ref: g.id,
      correct,
      expected: g.options[g.answerIdx],
      given: given != null ? g.options[given] ?? "" : "",
      tags: [g.tag],
    });
    if (!correct) {
      reviewSeeds.push({
        kind: g.tag === "grammar" ? "grammar" : "phrase",
        front: `${g.before} ___ ${g.after}`,
        back: `${g.options[g.answerIdx]}${g.explanation ? ` — ${g.explanation}` : ""}`,
        tags: [g.tag],
      });
    }
  }
  return {
    score01: payload.gaps.length ? correctCount / payload.gaps.length : 0,
    correctCount,
    itemCount: payload.gaps.length,
    items,
    reviewSeeds,
  };
}

// ---------- 4. Interactive Reading（複合小問）----------
const IR_KIND_TAG: Record<IRQuestion["kind"], WeaknessTag[]> = {
  completeSentence: ["grammar", "cohesion"],
  highlight: ["reading-detail"],
  identifyIdea: ["reading-gist"],
  insertSentence: ["cohesion", "inference"],
  summarize: ["reading-gist", "inference"],
};

export function gradeInteractiveReading(
  payload: InteractiveReadingPayload,
  ans: InteractiveAnswer,
): GradeOutput {
  const items: GradedItem[] = [];
  const reviewSeeds: ReviewSeed[] = [];
  let correctCount = 0;
  for (const q of payload.questions) {
    const given = ans[q.id];
    let correct = false;
    let expected = "";
    let givenLabel = String(given ?? "");
    switch (q.kind) {
      case "highlight":
        correct = given === q.answerSpanId;
        expected = q.spans.find((s) => s.id === q.answerSpanId)?.text ?? "";
        givenLabel = q.spans.find((s) => s.id === given)?.text ?? "";
        break;
      case "insertSentence":
        correct = given === q.answerSlot;
        expected = q.slots[q.answerSlot] ?? `位置#${q.answerSlot}`;
        givenLabel =
          typeof given === "number" ? q.slots[given] ?? "" : String(given ?? "");
        break;
      default: {
        const idx = q.answerIdx;
        correct = given === idx;
        expected = q.options[idx] ?? "";
        givenLabel =
          typeof given === "number" ? q.options[given] ?? "" : String(given ?? "");
        break;
      }
    }
    if (correct) correctCount++;
    const tags =
      q.kind === "completeSentence" && q.tag ? [q.tag] : IR_KIND_TAG[q.kind];
    items.push({ ref: q.id, correct, expected, given: givenLabel, tags });
    if (!correct) {
      const title = payload.title ?? "Interactive Reading";
      let front: string;
      switch (q.kind) {
        case "completeSentence":
          front = `${q.before} ___ ${q.after}`;
          break;
        case "highlight":
          front = `${title}：該当箇所はどこ？`;
          break;
        case "insertSentence":
          front = `「${q.sentence}」を挿入する位置は？`;
          break;
        case "identifyIdea":
          front = q.prompt;
          break;
        default:
          front = q.prompt ?? `${title}：本文の要約は？`;
          break;
      }
      reviewSeeds.push({
        kind: q.kind === "completeSentence" ? "grammar" : "phrase",
        front,
        back: expected,
        tags,
      });
    }
  }
  return {
    score01: payload.questions.length
      ? correctCount / payload.questions.length
      : 0,
    correctCount,
    itemCount: payload.questions.length,
    items,
    reviewSeeds,
  };
}

// ---------- 5. Listen and Type（ディクテーション）----------
export function gradeListenType(
  transcript: string,
  ans: ListenTypeAnswer,
): GradeOutput {
  const ref = tokenize(transcript);
  const hyp = tokenize(ans.input);
  const diff = alignTokens(ref, hyp).map((d) => ({
    ...d,
    tag: classifyDiff(d),
  }));
  const { sub, del, ins, refLen } = werCounts(diff);
  const score01 = Math.max(0, 1 - (sub + del + ins) / Math.max(refLen, 1));
  const matchCount = diff.filter((d) => d.op === "match").length;

  const items: GradedItem[] = diff
    .filter((d) => d.op !== "match")
    .map((d, i) => ({
      ref: `t${d.refIdx ?? d.hypIdx ?? i}`,
      correct: false,
      expected: d.ref ?? "∅",
      given: d.hyp ?? "∅",
      tags: d.tag ? [d.tag] : ["listen-chunk"],
    }));

  // 復習：聞き落とし/取り違えた正解語（機能語は除外）
  const reviewSeeds: ReviewSeed[] = diff
    .filter((d) => (d.op === "del" || d.op === "sub") && d.ref)
    .filter((d) => d.tag !== "listen-funcword")
    .map((d) => ({
      kind: "word",
      front: `🔊 ${d.ref}`,
      back: meaningOf(d.ref!) ?? "（意味を追加）",
      context: transcript,
      tags: [d.tag ?? "listen-chunk"],
      audio: true,
    }));

  return {
    score01,
    correctCount: matchCount,
    itemCount: refLen,
    items,
    reviewSeeds,
    diff,
  };
}
