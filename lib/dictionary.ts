// =============================================================
// 簡易 英→日 辞書（復習カードに意味を表示するため）
//   seed の語彙を網羅。未収録語は手動編集で補える。
// =============================================================
import type { ReviewItem } from "./types";
import { VOCAB } from "./vocab";
import { VOCAB2 } from "./vocab2";
import { VOCAB3 } from "./vocab3";
import { VOCAB4 } from "./vocab4";

const BASE_EN_JA: Record<string, string> = {
  // Read and Select（実在語）
  meticulous: "細心の、几帳面な",
  resilient: "回復力のある、立ち直りが早い",
  obscure: "不明瞭な、目立たない",
  conscientious: "良心的な、誠実な",
  pragmatic: "実利的な、現実的な",
  ephemeral: "つかの間の、はかない",
  verbose: "冗長な、言葉数の多い",
  diligent: "勤勉な、熱心な",

  // Read and Complete（クローズ）/ Complete the Sentences
  believe: "信じる、思う",
  practice: "練習（する）、実践",
  review: "見直す、再検討する、復習",
  decision: "決定、決断",
  analyze: "分析する",
  analyzed: "分析した",
  misleading: "誤解を招く、紛らわしい",
  improve: "改善する、向上させる",
  health: "健康",
  risky: "危険な、リスクのある",
  effective: "効果的な、有効な",
  consistent: "一貫した、矛盾のない",
  solution: "解決（策）",
  detailed: "詳細な",
  analysis: "分析",

  // Listen and Type（内容語）
  library: "図書館",
  close: "閉まる、閉じる",
  weekday: "平日",
  buy: "買う",
  bought: "買った",
  coffee: "コーヒー",
  cup: "カップ、（一）杯",
  piece: "一片、一切れ",
  cake: "ケーキ",
  leave: "去る、出発する、残す",
  ship: "船",
  sail: "航海する、出航する",
  meeting: "会議、打ち合わせ",
  schedule: "予定する、計画",
  scheduled: "予定された",
  march: "3月、行進",
  fourteenth: "14番目、14日",
  three: "3",
  thirty: "30",
  nine: "9",
  researcher: "研究者",
  find: "見つける、わかる",
  found: "見つけた、わかった",
  regular: "規則的な、定期的な",
  sleep: "睡眠、眠る",
  memory: "記憶、思い出",
  focus: "集中（する）、焦点",
  despite: "〜にもかかわらず",
  rain: "雨",
  committee: "委員会",
  decide: "決める、決定する",
  decided: "決めた",
  continue: "続ける、継続する",
  outdoor: "屋外の",
  event: "出来事、イベント",
  proposal: "提案、企画",
  final: "最終の",

  // 追加の DET レベル語彙（自動生成・復習に使用）
  abundant: "豊富な",
  adequate: "十分な、適切な",
  ambiguous: "曖昧な",
  anticipate: "予期する、見越す",
  arbitrary: "恣意的な、任意の",
  articulate: "明確に述べる",
  candid: "率直な",
  coherent: "首尾一貫した",
  compelling: "説得力のある、引き込まれる",
  comprehensive: "包括的な",
  concise: "簡潔な",
  controversial: "議論を呼ぶ",
  crucial: "極めて重要な",
  deliberate: "意図的な、慎重な",
  diminish: "減少する、減らす",
  elaborate: "入念な、詳しく述べる",
  eloquent: "雄弁な",
  empirical: "経験的な、実証的な",
  endeavor: "努力（する）",
  enhance: "高める、向上させる",
  explicit: "明示的な、明確な",
  feasible: "実現可能な",
  fluctuate: "変動する",
  fundamental: "基本的な、根本的な",
  genuine: "本物の、誠実な",
  hypothesis: "仮説",
  implicit: "暗黙の",
  inevitable: "避けられない",
  infer: "推論する",
  innovative: "革新的な",
  intricate: "複雑な、入り組んだ",
  intuitive: "直感的な",
  lucid: "明快な",
  mitigate: "緩和する",
  notion: "概念、考え",
  nuance: "微妙な違い",
  objective: "客観的な、目標",
  plausible: "もっともらしい",
  profound: "深遠な、重大な",
  prominent: "著名な、目立つ",
  prudent: "思慮深い、慎重な",
  redundant: "余分な、冗長な",
  relevant: "関連のある",
  reluctant: "気が進まない",
  robust: "頑健な、強固な",
  scrutinize: "精査する",
  significant: "重要な、著しい",
  spontaneous: "自発的な、衝動的な",
  subtle: "微妙な、繊細な",
  sufficient: "十分な",
  tedious: "退屈な、骨の折れる",
  tentative: "仮の、ためらいがちな",
  thorough: "徹底的な",
  versatile: "多才な、用途の広い",
  viable: "実行可能な",
  vivid: "鮮やかな、生き生きした",
  acquire: "習得する、獲得する",
  assess: "評価する、査定する",
  constraint: "制約",
  emphasize: "強調する",
  estimate: "見積もる、推定",
  evident: "明白な",
  illustrate: "説明する、例示する",
  maintain: "維持する、主張する",
  obstacle: "障害（物）",
  perceive: "知覚する、理解する",
  reinforce: "強化する",
  resolve: "解決する、決意",
  sustain: "維持する、支える",
  tendency: "傾向",
  utilize: "活用する",
};

// 既存の基本語彙 + 自動生成の追加語彙（vocab.ts）をマージ
export const EN_JA: Record<string, string> = {
  ...BASE_EN_JA,
  ...VOCAB,
  ...VOCAB2,
  ...VOCAB3,
  ...VOCAB4,
};

function normalize(word: string): string {
  return word.toLowerCase().replace(/[^a-z]/g, "");
}

/** 英単語の日本語訳を返す（語形変化は簡易フォールバック）。無ければ null。 */
export function meaningOf(word: string): string | null {
  const w = normalize(word);
  if (!w) return null;
  if (EN_JA[w]) return EN_JA[w];

  const candidates: string[] = [];
  if (w.endsWith("ies")) candidates.push(w.slice(0, -3) + "y");
  if (w.endsWith("es")) candidates.push(w.slice(0, -2));
  if (w.endsWith("s")) candidates.push(w.slice(0, -1));
  if (w.endsWith("ied")) candidates.push(w.slice(0, -3) + "y");
  if (w.endsWith("ed")) {
    candidates.push(w.slice(0, -2));
    candidates.push(w.slice(0, -1));
  }
  if (w.endsWith("ing")) {
    candidates.push(w.slice(0, -3));
    candidates.push(w.slice(0, -3) + "e");
  }
  for (const c of candidates) if (EN_JA[c]) return EN_JA[c];
  return null;
}

const GENERIC_BACKS = new Set([
  "実在する英単語（意味を確認）",
  "実在する英単語",
]);

function hasJapanese(s: string): boolean {
  return /[぀-ヿ㐀-鿿]/.test(s);
}

/**
 * 既存の単語カードに日本語訳を補完するための新しい back を返す。
 * 補完不要・不可なら null。
 */
export function enrichedBack(item: ReviewItem): string | null {
  if (item.kind !== "word") return null;
  const isGeneric = GENERIC_BACKS.has(item.back.trim());
  // 既に日本語が入っていて、汎用プレースホルダでもないなら触らない
  if (hasJapanese(item.back) && !isGeneric) return null;

  const isCloze = item.front.includes("_");
  const word = isCloze
    ? item.back.replace(/[^a-zA-Z]/g, "")
    : item.front.replace(/[^a-zA-Z]/g, "");
  const m = meaningOf(word);
  if (!m) return null;
  return isCloze ? `${word}（${m}）` : m;
}
