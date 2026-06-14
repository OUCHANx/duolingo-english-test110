// =============================================================
// DET 110 アプリ 共有型定義（フェーズ0：唯一の語彙の正）
//   - タスク種別は DetTaskType（snake_case）だけを使う
//   - 弱点タグは WeaknessTag だけを使う
//   - ReviewItem は1つ（Leitner box + SM-2 ease のハイブリッド）
//   - すべての型に userId? を持たせ Supabase 移行に備える
// =============================================================

// ---------- 基底 ----------
export interface BaseEntity {
  id: string;
  userId?: string | null;
  createdAt: string; // ISO 文字列（Date 型は使わない）
  updatedAt: string;
}

// ---------- 列挙（リテラルユニオン）----------
export type SubScore =
  | "literacy"
  | "comprehension"
  | "conversation"
  | "production";

export type Skill = "reading" | "listening" | "writing" | "speaking";

/** 学習チャネル（保存の出典タグも兼ねる） */
export type StudyChannel = "app" | "cambly" | "chatgpt" | "mock" | "other";

export type CefrLevel = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
export type Difficulty = "easy" | "medium" | "hard";

/** 学習ログのカテゴリ（時間集計の単位） */
export type LogCategory =
  | "reading"
  | "listening"
  | "speaking"
  | "writing"
  | "vocabulary"
  | "mock"
  | "review";

/** DET タスク種別（唯一の正） */
export type DetTaskType =
  | "read_and_select"
  | "read_and_complete"
  | "complete_the_sentences"
  | "interactive_reading"
  | "listen_and_type"
  | "interactive_listening"
  | "read_aloud"
  | "write_about_photo"
  | "speak_about_photo"
  | "read_then_write"
  | "read_then_speak"
  | "listen_then_speak"
  | "writing_sample"
  | "speaking_sample";

/** 弱点タグ（全形式の誤りをここに正規化する） */
export type WeaknessTag =
  | "vocab"
  | "spelling"
  | "grammar"
  | "collocation"
  | "reading-detail"
  | "reading-gist"
  | "inference"
  | "cohesion"
  | "listen-phoneme"
  | "listen-funcword"
  | "listen-chunk"
  | "listen-numeral";

// ---------- 目標・日次 ----------
export interface UserGoal extends BaseEntity {
  targetOverall: number; // 例 110
  deadline: string; // 'YYYY-MM-DD' 例 '2026-09-30'
  startedAt: string; // 'YYYY-MM-DD'
  weeklyStudyMinutesTarget: number; // 週あたり目標学習分
  isActive: boolean;
  note: string | null;
}

export interface DailyLog extends BaseEntity {
  date: string; // 'YYYY-MM-DD' 一意（1日1件）
  reflection: string | null; // 今日の反省
  tomorrow: string | null; // 明日やること
  mood: 1 | 2 | 3 | 4 | 5 | null;
}

// ---------- 問題コンテンツ payload ----------
export interface ReadSelectWord {
  id: string;
  text: string;
  isReal: boolean;
}
export interface ReadSelectPayload {
  words: ReadSelectWord[];
  timeLimitSec?: number;
}

export interface ClozeBlank {
  id: string;
  full: string; // 正解語 例 "environment"
  keepHead: number; // 先頭から見せる文字数
}
export interface ClozePayload {
  text: string; // {{id}} プレースホルダ入りパッセージ
  blanks: ClozeBlank[];
}

export interface SentenceGap {
  id: string;
  before: string;
  after: string;
  options: string[];
  answerIdx: number;
  tag: WeaknessTag;
  explanation?: string;
}
export interface CompleteSentencesPayload {
  gaps: SentenceGap[];
}

export type IRQuestion =
  | {
      kind: "completeSentence";
      id: string;
      before: string;
      after: string;
      options: string[];
      answerIdx: number;
      tag: WeaknessTag;
    }
  | {
      kind: "highlight";
      id: string;
      prompt: string;
      spans: { id: string; text: string }[];
      answerSpanId: string;
    }
  | {
      kind: "identifyIdea";
      id: string;
      prompt: string;
      options: string[];
      answerIdx: number;
    }
  | {
      kind: "insertSentence";
      id: string;
      sentence: string;
      slots: string[];
      answerSlot: number;
    }
  | {
      kind: "summarize";
      id: string;
      prompt?: string;
      options: string[];
      answerIdx: number;
    };

export interface InteractiveReadingPayload {
  title?: string;
  paragraphs: string[];
  questions: IRQuestion[];
}

export interface ListenTypePayload {
  rate?: number; // SpeechSynthesis 読み上げ速度（0.9 程度）
  voiceHint?: "en-US" | "en-GB";
  maxReplays?: number;
}

export type ReadingPayload =
  | ReadSelectPayload
  | ClozePayload
  | CompleteSentencesPayload
  | InteractiveReadingPayload;

// ---------- 問題型 ----------
export interface ReadingQuestion extends BaseEntity {
  taskType:
    | "read_and_select"
    | "read_and_complete"
    | "complete_the_sentences"
    | "interactive_reading";
  difficulty: Difficulty;
  cefr: CefrLevel | null;
  prompt: string;
  passage: string | null;
  payload: ReadingPayload;
  tags: WeaknessTag[];
  source: string | null;
  isSeed?: boolean;
}

export interface ListeningQuestion extends BaseEntity {
  taskType: "listen_and_type" | "interactive_listening" | "listen_then_speak";
  difficulty: Difficulty;
  cefr: CefrLevel | null;
  audioUrl: string | null;
  transcript: string; // 正解スクリプト
  prompt: string | null;
  payload?: ListenTypePayload | InteractiveReadingPayload;
  tags: WeaknessTag[];
  source: string | null;
  isSeed?: boolean;
}

// ---------- 演習結果（明細ログ）----------
export interface StudySession extends BaseEntity {
  date: string; // 'YYYY-MM-DD'
  channel: StudyChannel; // 通常 'app'
  category: LogCategory; // 時間集計のカテゴリ
  taskTypes: DetTaskType[];
  durationMinutes: number;
  itemCount: number;
  correctCount: number;
  accuracy: number | null; // 0..1 キャッシュ
  isManual: boolean; // /log からの手動時間記録か
  note: string | null;
}

export interface ItemOutcome {
  ref: string; // 小問id / 語トークンid
  correct: boolean;
  expected: string;
  given: string;
  partial?: number; // 部分点 0..1（クローズ等の表示用）
  tags: WeaknessTag[];
}

export interface ExerciseResult extends BaseEntity {
  sessionId: string;
  questionId: string;
  taskType: DetTaskType;
  skill: Skill; // reading | listening
  isCorrect: boolean;
  score: number | null; // 0..1
  correctCount: number;
  itemCount: number;
  userAnswer: string; // JSON 文字列で柔軟に保存
  itemOutcomes: ItemOutcome[];
  timeSpentSec: number;
}

// ---------- Cambly / ChatGPT 記録 ----------
export interface SpeakingLog extends BaseEntity {
  date: string;
  tutorName: string | null;
  durationMinutes: number;
  topics: string[];
  detTaskFocus: DetTaskType[];
  stuckQuestions: string[];
  correctedExpressions: string[];
  pronunciationNotes: string[];
  selfScore: 1 | 2 | 3 | 4 | 5 | null;
  nextImprovement: string | null;
  note: string | null;
}

export interface WritingLog extends BaseEntity {
  date: string;
  detTaskType: "write_about_photo" | "read_then_write" | "writing_sample";
  prompt: string;
  draftText: string;
  correctedVersion: string | null;
  grammarErrors: string[];
  vocabErrors: string[];
  newExpressions: string[];
  wordCount: number;
  durationMinutes: number;
  selfScore: 1 | 2 | 3 | 4 | 5 | null;
  note: string | null;
}

// ---------- 模試・復習・タスク ----------
export interface MockScore extends BaseEntity {
  date: string;
  kind: "official" | "practice_test" | "self_estimate";
  overall: number; // 10..160（5刻み）
  subScores: Record<SubScore, number>;
  source: string | null;
  note: string | null;
}

export type ReviewKind = "word" | "phrase" | "grammar" | "expression";

export interface ReviewItem extends BaseEntity {
  kind: ReviewKind;
  front: string;
  back: string;
  context: string | null;
  sourceChannel: StudyChannel; // app / cambly / chatgpt
  sourceId: string | null;
  tags: WeaknessTag[];
  // SRS（Leitner box + SM-2 ease）
  box: number; // 0..5
  ease: number; // 初期 2.5
  intervalDays: number;
  dueDate: string; // 'YYYY-MM-DD'
  lastResult: "again" | "hard" | "good" | "easy" | null;
  lastReviewedAt: string | null;
  archived: boolean; // 復習完了（卒業）
}

export type TaskReason = "weakness" | "review" | "maintenance" | "mock_prep";
export type TaskStatus = "todo" | "in_progress" | "done" | "skipped";

export interface StudyTask extends BaseEntity {
  title: string;
  channel: StudyChannel;
  detTaskType: DetTaskType | null;
  skill: Skill | null;
  estimatedMinutes: number;
  status: TaskStatus;
  reason: TaskReason;
  priority: number; // 高いほど上
  scheduledDate: string | null; // 'YYYY-MM-DD'
  reviewItemIds?: string[];
  href?: string; // ワンタップ起動先
  minViable?: boolean; // 連続日数維持の最小達成タスク
  completedAt: string | null;
}

// =============================================================
// 採点（純粋関数の入出力）
// =============================================================
export type ReadSelectAnswer = Record<string, boolean>; // wordId -> 実在と判定したか
export type ClozeAnswer = Record<string, string>; // blankId -> 入力（残り部分）
export type CompleteSentencesAnswer = Record<string, number>; // gapId -> 選択idx
export type InteractiveAnswer = Record<string, number | string>; // qId -> idx | spanId
export interface ListenTypeAnswer {
  input: string;
  replays: number;
}

export type DiffOp = "match" | "sub" | "del" | "ins";
export interface DiffToken {
  op: DiffOp;
  ref?: string;
  hyp?: string;
  refIdx?: number;
  hypIdx?: number;
  tag?: WeaknessTag;
}

export interface GradedItem {
  ref: string;
  correct: boolean;
  expected: string;
  given: string;
  partial?: number;
  tags: WeaknessTag[];
}

export interface ReviewSeed {
  kind: ReviewKind;
  front: string;
  back: string;
  context?: string | null;
  tags: WeaknessTag[];
  audio?: boolean; // 音で復習（Listen and Type 由来）
}

export interface GradeOutput {
  score01: number; // 0..1
  correctCount: number;
  itemCount: number;
  items: GradedItem[];
  reviewSeeds: ReviewSeed[];
  diff?: DiffToken[]; // listen_and_type の表示用
}

// =============================================================
// 集計・分析の派生型
// =============================================================
export interface WeaknessProfile {
  subScoreAccuracy: Record<SubScore, number | null>; // 0..1（データ無しは null）
  skillAccuracy: Record<Skill, number | null>;
  taskAccuracy: Partial<Record<DetTaskType, { correct: number; total: number }>>;
  tagErrors: Partial<Record<WeaknessTag, number>>; // タグ別の誤り数
  listenBreakdown: {
    phoneme: number;
    funcword: number;
    chunk: number;
    numeral: number;
    spelling: number;
  };
  speakingThemes: { theme: string; count: number }[];
  grammarErrors: { error: string; count: number }[];
  timeBalanceMinutes: Record<LogCategory, number>;
  volume7dMinutes: number;
  volume30dMinutes: number;
  dueReviewCount: number;
}

export interface PaceResult {
  expectedToday: number; // 目安線の現在値
  latestActual: number | null;
  delta: number;
  status: "ahead" | "on_track" | "behind" | "no_data";
  daysLeft: number;
}
