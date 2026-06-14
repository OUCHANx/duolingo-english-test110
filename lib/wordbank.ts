// =============================================================
// Read and Select 自動生成用の語彙バンク
//   REAL_WORDS は全て dictionary.ts の EN_JA に意味あり（復習で表示される）
//   基本語彙 + 自動生成の追加語彙（vocab.ts）をマージして使う。
// =============================================================
import { VOCAB, FAKE_WORDS_EXTRA } from "./vocab";
import { VOCAB2 } from "./vocab2";
import { VOCAB3 } from "./vocab3";
import { VOCAB4 } from "./vocab4";

const BASE_REAL_WORDS: string[] = [
  "meticulous", "resilient", "obscure", "conscientious", "pragmatic",
  "ephemeral", "verbose", "diligent", "believe", "practice", "review",
  "decision", "analyze", "misleading", "improve", "effective", "consistent",
  "solution", "abundant", "adequate", "ambiguous", "anticipate", "arbitrary",
  "articulate", "candid", "coherent", "compelling", "comprehensive", "concise",
  "controversial", "crucial", "deliberate", "diminish", "elaborate", "eloquent",
  "empirical", "endeavor", "enhance", "explicit", "feasible", "fluctuate",
  "fundamental", "genuine", "hypothesis", "implicit", "inevitable", "infer",
  "innovative", "intricate", "intuitive", "lucid", "mitigate", "notion",
  "nuance", "objective", "plausible", "profound", "prominent", "prudent",
  "redundant", "relevant", "reluctant", "robust", "scrutinize", "significant",
  "spontaneous", "subtle", "sufficient", "tedious", "tentative", "thorough",
  "versatile", "viable", "vivid", "acquire", "assess", "constraint",
  "emphasize", "estimate", "evident", "illustrate", "maintain", "obstacle",
  "perceive", "reinforce", "resolve", "sustain", "tendency", "utilize",
  "committee", "continue", "memory",
];

// 実在しないが英語らしい綴りの偽単語
const BASE_FAKE_WORDS: string[] = [
  "flantern", "plendor", "quindle", "gandible", "morbund", "trasply", "blorth",
  "frindle", "snurgle", "plimber", "dracton", "vimption", "gorpith", "melction",
  "crandle", "thrandic", "gleption", "prombic", "fluxant", "fendril", "catrize",
  "dolphic", "fornate", "glemish", "hectile", "jorbant", "klentar", "lurbish",
  "mancive", "norpeth", "oblantic", "rangive", "sturnle", "tendrith", "ulmary",
  "vandle", "welkish", "grontal", "drupent", "sploon",
];

// 基本語彙 + 追加語彙をマージ（重複は除去）
export const REAL_WORDS: string[] = Array.from(
  new Set([
    ...BASE_REAL_WORDS,
    ...Object.keys(VOCAB),
    ...Object.keys(VOCAB2),
    ...Object.keys(VOCAB3),
    ...Object.keys(VOCAB4),
  ]),
);
export const FAKE_WORDS: string[] = Array.from(
  new Set([...BASE_FAKE_WORDS, ...FAKE_WORDS_EXTRA]),
);
