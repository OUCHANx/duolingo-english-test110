// =============================================================
// 単語帳ページ用：学習語彙リストと「覚えた」進捗（localStorage）
// =============================================================
import { REAL_WORDS } from "./wordbank";
import { meaningOf } from "./dictionary";

export interface VocabEntry {
  word: string;
  ja: string;
}

let _cache: VocabEntry[] | null = null;

/** REAL_WORDS を意味つき・アルファベット順で返す（意味のある語のみ）。 */
export function getStudyVocab(): VocabEntry[] {
  if (_cache) return _cache;
  const list: VocabEntry[] = [];
  for (const w of REAL_WORDS) {
    const ja = meaningOf(w);
    if (ja) list.push({ word: w, ja });
  }
  list.sort((a, b) => (a.word < b.word ? -1 : a.word > b.word ? 1 : 0));
  _cache = list;
  return list;
}

const KNOWN_KEY = "det:v1:vocab_known";

export function loadKnown(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    const raw = window.localStorage.getItem(KNOWN_KEY);
    if (raw) {
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) return new Set(arr as string[]);
    }
  } catch {
    /* ignore */
  }
  return new Set();
}

export function saveKnown(set: Set<string>): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KNOWN_KEY, JSON.stringify([...set]));
  } catch {
    /* ignore */
  }
}
