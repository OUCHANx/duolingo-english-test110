// =============================================================
// Listen and Type 用：トークン単位 diff（聞き取りミスの分類）
// =============================================================
import type { DiffToken, WeaknessTag } from "./types";

const FUNCTION_WORDS = new Set([
  "a", "an", "the", "of", "to", "and", "in", "on", "at", "is", "are",
  "was", "were", "for", "with", "as", "by", "it", "its", "from", "or",
  "but", "be", "this", "that", "he", "she", "they",
]);

const NUMBER_WORDS = new Set([
  "zero", "one", "two", "three", "four", "five", "six", "seven", "eight",
  "nine", "ten", "eleven", "twelve", "thirteen", "fourteen", "fifteen",
  "sixteen", "seventeen", "eighteen", "nineteen", "twenty", "thirty",
  "forty", "fifty", "sixty", "seventy", "eighty", "ninety", "hundred",
  "thousand", "million", "first", "second", "third", "fourth", "fifth",
]);

/** lowercase・句読点除去（' は保持）・空白正規化 */
export function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .replace(/[^a-z0-9'\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .split(" ")
    .filter((t) => /[a-z0-9]/.test(t)); // 裸のアポストロフィ等（英数字を含まない）を除外
}

/** 文字単位の編集距離 */
export function levenshtein(a: string, b: string): number {
  const m = a.length;
  const n = b.length;
  if (m === 0) return n;
  if (n === 0) return m;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1,
        dp[i][j - 1] + 1,
        dp[i - 1][j - 1] + cost,
      );
    }
  }
  return dp[m][n];
}

/** Needleman–Wunsch ベースのトークン整列 → 編集列 */
export function alignTokens(ref: string[], hyp: string[]): DiffToken[] {
  const m = ref.length;
  const n = hyp.length;
  const dp = Array.from({ length: m + 1 }, () => new Array<number>(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = ref[i - 1] === hyp[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(
        dp[i - 1][j] + 1, // del
        dp[i][j - 1] + 1, // ins
        dp[i - 1][j - 1] + cost, // match/sub
      );
    }
  }
  // バックトレース
  const out: DiffToken[] = [];
  let i = m;
  let j = n;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0) {
      const cost = ref[i - 1] === hyp[j - 1] ? 0 : 1;
      if (dp[i][j] === dp[i - 1][j - 1] + cost) {
        out.push({
          op: cost === 0 ? "match" : "sub",
          ref: ref[i - 1],
          hyp: hyp[j - 1],
          refIdx: i - 1,
          hypIdx: j - 1,
        });
        i--;
        j--;
        continue;
      }
    }
    if (i > 0 && dp[i][j] === dp[i - 1][j] + 1) {
      out.push({ op: "del", ref: ref[i - 1], refIdx: i - 1 });
      i--;
      continue;
    }
    out.push({ op: "ins", hyp: hyp[j - 1], hypIdx: j - 1 });
    j--;
  }
  return out.reverse();
}

function isNumberToken(t: string): boolean {
  return /\d/.test(t) || NUMBER_WORDS.has(t);
}

/** 誤りトークンを弱点タグに分類 */
export function classifyDiff(d: DiffToken): WeaknessTag | undefined {
  if (d.op === "match") return undefined;

  if (d.op === "del") {
    if (d.ref && FUNCTION_WORDS.has(d.ref)) return "listen-funcword";
    if (d.ref && isNumberToken(d.ref)) return "listen-numeral";
    return "listen-chunk";
  }
  if (d.op === "ins") {
    // 余計に入力した語：機能語なら機能語、数字なら数字、それ以外は chunk（del と対称）
    if (d.hyp && FUNCTION_WORDS.has(d.hyp)) return "listen-funcword";
    if (d.hyp && isNumberToken(d.hyp)) return "listen-numeral";
    return "listen-chunk";
  }
  // sub
  const ref = d.ref ?? "";
  const hyp = d.hyp ?? "";
  if (isNumberToken(ref) || isNumberToken(hyp)) return "listen-numeral";
  const dist = levenshtein(ref, hyp);
  // 語幹が近い（綴り違い）
  if (ref[0] === hyp[0] && dist <= 2 && Math.abs(ref.length - hyp.length) <= 1) {
    return "spelling";
  }
  // 音の取り違え（短い置換）
  if (dist <= 3) return "listen-phoneme";
  return "listen-chunk";
}

/** Word Error Rate 由来のスコア材料 */
export function werCounts(diff: DiffToken[]): {
  sub: number;
  del: number;
  ins: number;
  refLen: number;
} {
  let sub = 0;
  let del = 0;
  let ins = 0;
  let refLen = 0;
  for (const d of diff) {
    if (d.op !== "ins") refLen++;
    if (d.op === "sub") sub++;
    else if (d.op === "del") del++;
    else if (d.op === "ins") ins++;
  }
  return { sub, del, ins, refLen };
}
