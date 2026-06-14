// =============================================================
// Routine（毎日のクラウド生成）が書き出す問題ファイルの読み込み。
//   public/daily-questions.json を起動時に取得し、演習プールに合流させる。
//   ファイルが無い/壊れていても安全にフォールバック（内蔵生成・seed）。
// =============================================================
import type { ListeningQuestion, ReadingQuestion } from "./types";

export interface DailyQuestions {
  generatedAt: string | null;
  readingQuestions: ReadingQuestion[];
  listeningQuestions: ListeningQuestion[];
}

const READING_TYPES = new Set([
  "read_and_select",
  "read_and_complete",
  "complete_the_sentences",
  "interactive_reading",
]);
const LISTENING_TYPES = new Set([
  "listen_and_type",
  "interactive_listening",
  "listen_then_speak",
]);

function isObj(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

/** 最低限の妥当性チェック（壊れた項目は捨てる） */
function sanitizeReading(arr: unknown): ReadingQuestion[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (q): q is ReadingQuestion =>
      isObj(q) &&
      typeof q.id === "string" &&
      typeof q.taskType === "string" &&
      READING_TYPES.has(q.taskType) &&
      isObj(q.payload),
  );
}

function sanitizeListening(arr: unknown): ListeningQuestion[] {
  if (!Array.isArray(arr)) return [];
  return arr.filter(
    (q): q is ListeningQuestion =>
      isObj(q) &&
      typeof q.id === "string" &&
      typeof q.taskType === "string" &&
      LISTENING_TYPES.has(q.taskType) &&
      typeof q.transcript === "string",
  );
}

export async function fetchDailyQuestions(): Promise<DailyQuestions | null> {
  try {
    const res = await fetch("/daily-questions.json", { cache: "no-store" });
    if (!res.ok) return null;
    const data: unknown = await res.json();
    if (!isObj(data)) return null;
    return {
      generatedAt:
        typeof data.generatedAt === "string" ? data.generatedAt : null,
      readingQuestions: sanitizeReading(data.readingQuestions),
      listeningQuestions: sanitizeListening(data.listeningQuestions),
    };
  } catch {
    return null;
  }
}
