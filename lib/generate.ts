// =============================================================
// 問題の自動生成（毎回新しい問題を出すための生成器）
//   Read and Select / Read and Complete / Listen and Type に対応。
//   生成物は永続化しない（その場の演習用）。id は uid()。
// =============================================================
import type {
  ClozeBlank,
  ClozePayload,
  ListeningQuestion,
  ReadSelectWord,
  ReadingQuestion,
} from "./types";
import { uid } from "./id";
import { REAL_WORDS, FAKE_WORDS } from "./wordbank";
import { SENTENCES } from "./sentencebank";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sample<T>(arr: T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

const T = "2026-01-01T00:00:00.000Z";

// クローズで空所にしない語
const CLOZE_STOP = new Set([
  "about", "above", "after", "again", "along", "among", "around", "because",
  "before", "being", "below", "between", "during", "every", "their", "there",
  "these", "those", "through", "under", "until", "while", "would", "could",
  "should", "which", "where", "whose", "other", "another", "really",
]);

// ---------- Read and Select ----------
export function generateReadSelect(
  realCount = 8,
  fakeCount = 6,
): ReadingQuestion {
  const reals: ReadSelectWord[] = sample(REAL_WORDS, realCount).map(
    (text, i) => ({ id: `r${i}`, text, isReal: true }),
  );
  const fakes: ReadSelectWord[] = sample(FAKE_WORDS, fakeCount).map(
    (text, i) => ({ id: `f${i}`, text, isReal: false }),
  );
  const words = shuffle([...reals, ...fakes]);
  return {
    id: uid(),
    userId: null,
    createdAt: T,
    updatedAt: T,
    taskType: "read_and_select",
    difficulty: "medium",
    cefr: null,
    prompt: "実在する英単語をすべて選んでください。",
    passage: null,
    payload: { words, timeLimitSec: 70 },
    tags: ["vocab"],
    source: "generated",
  };
}

export function generateReadSelectSets(sets = 3): ReadingQuestion[] {
  return Array.from({ length: sets }, () => generateReadSelect());
}

// ---------- Read and Complete（クローズ自動生成）----------
function buildCloze(sentence: string): ClozePayload | null {
  // 空白も保持して分割（join で復元できる）
  const tokens = sentence.split(/(\s+)/);
  const candidates: number[] = [];
  tokens.forEach((tok, i) => {
    const letters = tok.replace(/[^a-zA-Z]/g, "");
    if (
      letters.length >= 5 &&
      /^[a-zA-Z]+$/.test(letters) &&
      !CLOZE_STOP.has(letters.toLowerCase())
    ) {
      candidates.push(i);
    }
  });
  if (candidates.length === 0) return null;

  const chosen = sample(candidates, Math.min(2, candidates.length)).sort(
    (a, b) => a - b,
  );
  const blanks: ClozeBlank[] = [];
  chosen.forEach((idx, k) => {
    const tok = tokens[idx];
    const m = tok.match(/^([a-zA-Z]+)(.*)$/);
    if (!m) return;
    const word = m[1];
    const trail = m[2] ?? "";
    const id = `b${k}`;
    const keepHead = Math.max(2, Math.ceil(word.length / 2));
    blanks.push({ id, full: word, keepHead });
    tokens[idx] = `{{${id}}}${trail}`;
  });
  if (blanks.length === 0) return null;
  return { text: tokens.join(""), blanks };
}

export function generateReadComplete(count = 8): ReadingQuestion[] {
  const out: ReadingQuestion[] = [];
  for (const s of sample(SENTENCES, count + 4)) {
    if (out.length >= count) break;
    const payload = buildCloze(s);
    if (!payload) continue;
    out.push({
      id: uid(),
      userId: null,
      createdAt: T,
      updatedAt: T,
      taskType: "read_and_complete",
      difficulty: "medium",
      cefr: null,
      prompt: "空所に入る語の残りを入力してください。",
      passage: null,
      payload,
      tags: ["vocab", "spelling"],
      source: "generated",
    });
  }
  return out;
}

// ---------- Listen and Type ----------
export function generateListenType(count = 8): ListeningQuestion[] {
  return sample(SENTENCES, count).map((transcript) => ({
    id: uid(),
    userId: null,
    createdAt: T,
    updatedAt: T,
    taskType: "listen_and_type",
    difficulty: "medium",
    cefr: null,
    audioUrl: null,
    transcript,
    prompt: null,
    payload: { rate: 0.9, voiceHint: "en-US", maxReplays: 3 },
    tags: ["listen-chunk"],
    source: "generated",
  }));
}
