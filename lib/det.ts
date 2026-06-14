// =============================================================
// DET ドメイン定数・マッピング・日付ユーティリティ（唯一の真実源）
// =============================================================
import type {
  DetTaskType,
  LogCategory,
  Skill,
  SubScore,
  WeaknessTag,
} from "./types";

// ---------- 目標のデフォルト ----------
export const DEFAULT_DEADLINE = "2026-09-30";
export const DEFAULT_TARGET = 110;

// ---------- タスク種別 → 寄与サブスコア（ここだけが正）----------
export const TASK_SUBSCORE_MAP: Record<DetTaskType, readonly SubScore[]> = {
  read_and_select: ["literacy", "comprehension"],
  read_and_complete: ["literacy", "comprehension"],
  complete_the_sentences: ["literacy", "comprehension"],
  interactive_reading: ["literacy", "comprehension"],
  listen_and_type: ["comprehension", "conversation"],
  interactive_listening: ["comprehension", "conversation"],
  read_aloud: ["conversation", "production"],
  write_about_photo: ["literacy", "production"],
  speak_about_photo: ["conversation", "production"],
  read_then_write: ["literacy", "production"],
  read_then_speak: ["conversation", "production"],
  listen_then_speak: ["conversation", "production"],
  writing_sample: ["literacy", "production"],
  speaking_sample: ["conversation", "production"],
};

// ---------- タスク種別 → 技能 ----------
export const TASK_SKILL_MAP: Partial<Record<DetTaskType, Skill>> = {
  read_and_select: "reading",
  read_and_complete: "reading",
  complete_the_sentences: "reading",
  interactive_reading: "reading",
  listen_and_type: "listening",
  interactive_listening: "listening",
  read_aloud: "speaking",
  write_about_photo: "writing",
  read_then_write: "writing",
  writing_sample: "writing",
  speak_about_photo: "speaking",
  read_then_speak: "speaking",
  listen_then_speak: "speaking",
  speaking_sample: "speaking",
};

// ---------- 表示ラベル ----------
export const TASK_LABELS: Record<DetTaskType, string> = {
  read_and_select: "Read and Select",
  read_and_complete: "Read and Complete",
  complete_the_sentences: "Complete the Sentences",
  interactive_reading: "Interactive Reading",
  listen_and_type: "Listen and Type",
  interactive_listening: "Interactive Listening",
  read_aloud: "Read Aloud",
  write_about_photo: "Write About the Photo",
  speak_about_photo: "Speak About the Photo",
  read_then_write: "Read, Then Write",
  read_then_speak: "Read, Then Speak",
  listen_then_speak: "Listen, Then Speak",
  writing_sample: "Writing Sample",
  speaking_sample: "Speaking Sample",
};

export const SUBSCORE_LABELS: Record<SubScore, string> = {
  literacy: "Literacy",
  comprehension: "Comprehension",
  conversation: "Conversation",
  production: "Production",
};

export const SKILL_LABELS: Record<Skill, string> = {
  reading: "Reading",
  listening: "Listening",
  writing: "Writing",
  speaking: "Speaking",
};

export const LOG_CATEGORY_LABELS: Record<LogCategory, string> = {
  reading: "Reading",
  listening: "Listening",
  speaking: "Speaking / Cambly",
  writing: "Writing / ChatGPT",
  vocabulary: "Vocabulary",
  mock: "Mock Test",
  review: "復習",
};

export const LOG_CATEGORIES: LogCategory[] = [
  "reading",
  "listening",
  "speaking",
  "writing",
  "vocabulary",
  "mock",
  "review",
];

export const WEAKNESS_TAG_LABELS: Record<WeaknessTag, string> = {
  vocab: "語彙",
  spelling: "スペル",
  grammar: "文法",
  collocation: "語法・コロケーション",
  "reading-detail": "精読・該当箇所",
  "reading-gist": "大意・要約",
  inference: "推論",
  cohesion: "文の結束・語順",
  "listen-phoneme": "音の聞き分け",
  "listen-funcword": "機能語の脱落",
  "listen-chunk": "聞き落とし",
  "listen-numeral": "数字・固有名詞",
};

// ---------- 弱点タグ → 表示カテゴリ（一方向ロールアップ）----------
export type WeaknessCategory =
  | "vocabulary"
  | "grammar"
  | "reading"
  | "listening";

export const TAG_CATEGORY_MAP: Record<WeaknessTag, WeaknessCategory> = {
  vocab: "vocabulary",
  spelling: "vocabulary",
  grammar: "grammar",
  collocation: "grammar",
  "reading-detail": "reading",
  "reading-gist": "reading",
  inference: "reading",
  cohesion: "reading",
  "listen-phoneme": "listening",
  "listen-funcword": "listening",
  "listen-chunk": "listening",
  "listen-numeral": "listening",
};

export const CATEGORY_LABELS: Record<WeaknessCategory, string> = {
  vocabulary: "語彙・スペル",
  grammar: "文法・語法",
  reading: "読解",
  listening: "リスニング",
};

// ---------- スコア目安線（マイルストーン）----------
export interface Milestone {
  date: string;
  target: number;
}
export const MILESTONES: Milestone[] = [
  { date: "2026-06-30", target: 95 },
  { date: "2026-07-31", target: 100 },
  { date: "2026-08-31", target: 105 },
  { date: "2026-09-30", target: 110 },
];

export const SUBSCORES: SubScore[] = [
  "literacy",
  "comprehension",
  "conversation",
  "production",
];
export const SKILLS: Skill[] = ["reading", "listening", "writing", "speaking"];

// =============================================================
// 日付ユーティリティ（「今日」は JST 固定）
// =============================================================
function pad(n: number): string {
  return n < 10 ? `0${n}` : `${n}`;
}

/** 今日（Asia/Tokyo）を 'YYYY-MM-DD' で返す */
export function todayISO(): string {
  // en-CA ロケールは YYYY-MM-DD 形式
  return new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Tokyo" });
}

/** タイムスタンプ用の現在時刻（ISO） */
export function nowISO(): string {
  return new Date().toISOString();
}

function parseISO(d: string): number {
  const [y, m, day] = d.split("-").map(Number);
  return Date.UTC(y, (m ?? 1) - 1, day ?? 1);
}

/** to - from の日数 */
export function diffDays(from: string, to: string): number {
  return Math.round((parseISO(to) - parseISO(from)) / 86400000);
}

export function addDays(d: string, n: number): string {
  const t = new Date(parseISO(d) + n * 86400000);
  return `${t.getUTCFullYear()}-${pad(t.getUTCMonth() + 1)}-${pad(
    t.getUTCDate(),
  )}`;
}

const WEEKDAYS_JP = ["日", "月", "火", "水", "木", "金", "土"];

/** 'YYYY-MM-DD' を曜日（0=日）で返す */
export function weekdayOf(d: string): number {
  return new Date(parseISO(d)).getUTCDay();
}

/** 表示用 '6/14(土)' */
export function formatDateShort(d: string): string {
  const [, m, day] = d.split("-").map(Number);
  return `${m}/${day}(${WEEKDAYS_JP[weekdayOf(d)]})`;
}

/** 5点刻みに丸める（DET スコア） */
export function round5(n: number): number {
  return Math.round(n / 5) * 5;
}

export function clamp(n: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, n));
}
