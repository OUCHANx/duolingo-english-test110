// =============================================================
// 集計・分析・今日のメニュー自動生成（すべて純粋関数）
// =============================================================
import type {
  DetTaskType,
  ExerciseResult,
  LogCategory,
  MockScore,
  PaceResult,
  ReviewItem,
  Skill,
  SpeakingLog,
  StudySession,
  StudyTask,
  SubScore,
  UserGoal,
  WeaknessProfile,
  WeaknessTag,
  WritingLog,
} from "./types";
import {
  MILESTONES,
  SKILLS,
  SUBSCORES,
  TASK_SUBSCORE_MAP,
  addDays,
  clamp,
  diffDays,
  weekdayOf,
} from "./det";
import { dueCount } from "./srs";

export interface AnalyticsData {
  goal: UserGoal | null;
  studySessions: StudySession[];
  exerciseResults: ExerciseResult[];
  speakingLogs: SpeakingLog[];
  writingLogs: WritingLog[];
  mockScores: MockScore[];
  reviewItems: ReviewItem[];
}

// ---------- 統一アクティビティ台帳 ----------
export interface Activity {
  date: string;
  category: LogCategory;
  minutes: number;
}

export function buildActivities(d: {
  studySessions: StudySession[];
  speakingLogs: SpeakingLog[];
  writingLogs: WritingLog[];
}): Activity[] {
  const out: Activity[] = [];
  for (const s of d.studySessions) {
    out.push({ date: s.date, category: s.category, minutes: s.durationMinutes });
  }
  for (const s of d.speakingLogs) {
    out.push({ date: s.date, category: "speaking", minutes: s.durationMinutes });
  }
  for (const w of d.writingLogs) {
    out.push({ date: w.date, category: "writing", minutes: w.durationMinutes });
  }
  return out;
}

// ---------- 連続学習日数 ----------
export function activityDateSet(
  activities: Activity[],
  mockScores: MockScore[] = [],
): Set<string> {
  const set = new Set<string>();
  for (const a of activities) if (a.minutes > 0) set.add(a.date);
  for (const m of mockScores) set.add(m.date);
  return set;
}

export function calcStreak(dates: Set<string>, today: string): number {
  let streak = 0;
  // 今日未学習でも昨日まで継続中扱い
  let cursor = dates.has(today) ? today : addDays(today, -1);
  while (dates.has(cursor)) {
    streak++;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

// ---------- 学習量（分）----------
export function minutesInRange(
  activities: Activity[],
  fromInclusive: string,
  toInclusive: string,
): number {
  return activities
    .filter((a) => a.date >= fromInclusive && a.date <= toInclusive)
    .reduce((sum, a) => sum + a.minutes, 0);
}

export function timeBalance(activities: Activity[]): Record<LogCategory, number> {
  const base: Record<LogCategory, number> = {
    reading: 0,
    listening: 0,
    speaking: 0,
    writing: 0,
    vocabulary: 0,
    mock: 0,
    review: 0,
  };
  for (const a of activities) base[a.category] += a.minutes;
  return base;
}

// ---------- 今日の完了率（所要時間で加重）----------
export function calcTodayCompletion(
  tasks: StudyTask[],
  today: string,
): { done: number; total: number; pct: number } {
  const todays = tasks.filter((t) => t.scheduledDate === today);
  const total = todays.reduce((s, t) => s + Math.max(1, t.estimatedMinutes), 0);
  const done = todays
    .filter((t) => t.status === "done")
    .reduce((s, t) => s + Math.max(1, t.estimatedMinutes), 0);
  return {
    done: todays.filter((t) => t.status === "done").length,
    total: todays.length,
    pct: total === 0 ? 0 : Math.round((done / total) * 100),
  };
}

// ---------- 弱点分析 ----------
function safeRatio(correct: number, total: number): number | null {
  return total === 0 ? null : correct / total;
}

export function computeWeaknessProfile(
  d: AnalyticsData,
  today: string,
): WeaknessProfile {
  const results = d.exerciseResults;

  // サブスコア別正答率
  const subAgg: Record<SubScore, { c: number; t: number }> = {
    literacy: { c: 0, t: 0 },
    comprehension: { c: 0, t: 0 },
    conversation: { c: 0, t: 0 },
    production: { c: 0, t: 0 },
  };
  for (const r of results) {
    for (const sub of TASK_SUBSCORE_MAP[r.taskType] ?? []) {
      subAgg[sub].c += r.correctCount;
      subAgg[sub].t += r.itemCount;
    }
  }
  const subScoreAccuracy = {} as Record<SubScore, number | null>;
  for (const s of SUBSCORES) subScoreAccuracy[s] = safeRatio(subAgg[s].c, subAgg[s].t);

  // 技能別正答率
  const skillAgg: Record<Skill, { c: number; t: number }> = {
    reading: { c: 0, t: 0 },
    listening: { c: 0, t: 0 },
    writing: { c: 0, t: 0 },
    speaking: { c: 0, t: 0 },
  };
  for (const r of results) {
    skillAgg[r.skill].c += r.correctCount;
    skillAgg[r.skill].t += r.itemCount;
  }
  const skillAccuracy = {} as Record<Skill, number | null>;
  for (const s of SKILLS) skillAccuracy[s] = safeRatio(skillAgg[s].c, skillAgg[s].t);

  // タスク別正答率
  const taskAccuracy: WeaknessProfile["taskAccuracy"] = {};
  for (const r of results) {
    const cur = taskAccuracy[r.taskType] ?? { correct: 0, total: 0 };
    cur.correct += r.correctCount;
    cur.total += r.itemCount;
    taskAccuracy[r.taskType] = cur;
  }

  // タグ別の誤り数 + リスニング内訳
  const tagErrors: Partial<Record<WeaknessTag, number>> = {};
  const listenBreakdown = {
    phoneme: 0,
    funcword: 0,
    chunk: 0,
    numeral: 0,
    spelling: 0,
  };
  for (const r of results) {
    for (const o of r.itemOutcomes) {
      if (o.correct) continue;
      for (const tag of o.tags) {
        tagErrors[tag] = (tagErrors[tag] ?? 0) + 1;
        if (r.skill === "listening") {
          if (tag === "listen-phoneme") listenBreakdown.phoneme++;
          else if (tag === "listen-funcword") listenBreakdown.funcword++;
          else if (tag === "listen-chunk") listenBreakdown.chunk++;
          else if (tag === "listen-numeral") listenBreakdown.numeral++;
          else if (tag === "spelling") listenBreakdown.spelling++;
        }
      }
    }
  }

  // Cambly 頻出テーマ
  const themeCount = new Map<string, number>();
  for (const s of d.speakingLogs) {
    for (const t of [...s.topics, ...s.stuckQuestions]) {
      const key = t.trim();
      if (key) themeCount.set(key, (themeCount.get(key) ?? 0) + 1);
    }
  }
  const speakingThemes = [...themeCount.entries()]
    .map(([theme, count]) => ({ theme, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // Writing 頻出文法ミス
  const grammarCount = new Map<string, number>();
  for (const w of d.writingLogs) {
    for (const e of [...w.grammarErrors, ...w.vocabErrors]) {
      const key = e.trim();
      if (key) grammarCount.set(key, (grammarCount.get(key) ?? 0) + 1);
    }
  }
  const grammarErrors = [...grammarCount.entries()]
    .map(([error, count]) => ({ error, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);

  // 学習時間・量
  const activities = buildActivities(d);
  const timeBalanceMinutes = timeBalance(activities);
  const volume7dMinutes = minutesInRange(activities, addDays(today, -6), today);
  const volume30dMinutes = minutesInRange(activities, addDays(today, -29), today);

  return {
    subScoreAccuracy,
    skillAccuracy,
    taskAccuracy,
    tagErrors,
    listenBreakdown,
    speakingThemes,
    grammarErrors,
    timeBalanceMinutes,
    volume7dMinutes,
    volume30dMinutes,
    dueReviewCount: dueCount(d.reviewItems, today),
  };
}

// ---------- スコア進捗・ペース判定 ----------
/** 日付文字列の安定比較（同値で 0 を返す） */
export function byDate<T extends { date: string }>(a: T, b: T): number {
  return a.date < b.date ? -1 : a.date > b.date ? 1 : 0;
}

export interface GoalLinePoint {
  date: string;
  value: number;
}

/**
 * 目安ライン（baseline → 目標 への単調な線）。
 * 固定マイルストーンは baseline と目標の間に収まり、開始日〜期限の範囲内のものだけ採用する。
 */
export function buildGoalLine(
  goal: UserGoal | null,
  mockScores: MockScore[],
  today: string,
): GoalLinePoint[] {
  const sortedMocks = [...mockScores].sort(byDate);
  const baseline = sortedMocks[0]?.overall ?? 90;
  const startDate = goal?.startedAt ?? sortedMocks[0]?.date ?? today;
  const deadline = goal?.deadline ?? MILESTONES[MILESTONES.length - 1].date;
  const target = goal?.targetOverall ?? MILESTONES[MILESTONES.length - 1].target;

  const mids = MILESTONES.filter(
    (m) =>
      m.date > startDate &&
      m.date < deadline &&
      m.target > baseline &&
      m.target < target,
  ).map((m) => ({ date: m.date, value: m.target }));

  return [
    { date: startDate, value: baseline },
    ...mids,
    { date: deadline, value: target },
  ].sort(byDate);
}

function lerpLine(points: GoalLinePoint[], today: string): number {
  const sorted = [...points].sort(byDate);
  if (sorted.length === 0) return 0;
  if (today <= sorted[0].date) return sorted[0].value;
  if (today >= sorted[sorted.length - 1].date)
    return sorted[sorted.length - 1].value;
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (today >= a.date && today <= b.date) {
      const span = diffDays(a.date, b.date) || 1;
      const pos = diffDays(a.date, today);
      return a.value + ((b.value - a.value) * pos) / span;
    }
  }
  return sorted[sorted.length - 1].value;
}

export function evaluatePace(
  mockScores: MockScore[],
  goal: UserGoal | null,
  today: string,
): PaceResult {
  const deadline = goal?.deadline ?? MILESTONES[MILESTONES.length - 1].date;
  const daysLeft = diffDays(today, deadline);

  const line = buildGoalLine(goal, mockScores, today);
  const expectedToday = Math.round(lerpLine(line, today) * 10) / 10;

  const sortedMocks = [...mockScores].sort(byDate);
  if (sortedMocks.length === 0) {
    return {
      expectedToday,
      latestActual: null,
      delta: 0,
      status: "no_data",
      daysLeft,
    };
  }
  const latest = sortedMocks[sortedMocks.length - 1];
  const delta = latest.overall - expectedToday;
  const status = delta >= 5 ? "ahead" : delta <= -5 ? "behind" : "on_track";
  return {
    expectedToday,
    latestActual: latest.overall,
    delta,
    status,
    daysLeft,
  };
}

// =============================================================
// 今日の学習メニュー自動生成
// =============================================================
export const CAMBLY_DAYS = [2, 4, 6]; // 火・木・土
export const WRITING_DAYS = [0, 3]; // 日・水

export type NewTask = Omit<StudyTask, "id" | "userId" | "createdAt" | "updatedAt">;

function pickReadingType(p: WeaknessProfile): DetTaskType {
  const vocab = (p.tagErrors.vocab ?? 0) + (p.tagErrors.spelling ?? 0);
  const gist =
    (p.tagErrors["reading-gist"] ?? 0) +
    (p.tagErrors.inference ?? 0) +
    (p.tagErrors.cohesion ?? 0);
  const grammar =
    (p.tagErrors.grammar ?? 0) + (p.tagErrors.collocation ?? 0);
  if (gist >= vocab && gist >= grammar && gist > 0) return "interactive_reading";
  if (grammar > vocab && grammar > 0) return "complete_the_sentences";
  if (vocab > 0) return "read_and_complete";
  return "read_and_complete";
}

export interface MenuInput {
  today: string;
  goal: UserGoal | null;
  profile: WeaknessProfile;
  dueReviews: number;
}

export function generateDailyMenu(input: MenuInput): NewTask[] {
  const { today, goal, profile, dueReviews } = input;
  const deadline = goal?.deadline ?? MILESTONES[MILESTONES.length - 1].date;
  const daysLeft = Math.max(0, diffDays(today, deadline));
  const dow = weekdayOf(today);
  const isWeekend = dow === 0 || dow === 6;

  let base = isWeekend ? 45 : 25;
  if (daysLeft < 30) base *= 1.3;
  if (daysLeft < 7) base *= 1.1;
  const budget = clamp(base, 20, 75);

  const tasks: NewTask[] = [];

  // 1) 復習（あれば最小達成タスクとして先頭）
  if (dueReviews > 0) {
    tasks.push({
      title: `復習 ${Math.min(dueReviews, 20)}項目`,
      channel: "app",
      detTaskType: null,
      skill: null,
      estimatedMinutes: 10,
      status: "todo",
      reason: "review",
      priority: 90,
      scheduledDate: today,
      href: "/review",
      minViable: true,
      completedAt: null,
    });
  }

  // 2) 弱点の Reading 演習
  const readingType = pickReadingType(profile);
  const readingHref = `/practice/reading/${readingType.replace(/_/g, "-")}`;
  tasks.push({
    title: `${labelOf(readingType)} 10問`,
    channel: "app",
    detTaskType: readingType,
    skill: "reading",
    estimatedMinutes: 12,
    status: "todo",
    reason: "weakness",
    priority: 70,
    scheduledDate: today,
    href: readingHref,
    minViable: dueReviews === 0,
    completedAt: null,
  });

  // 3) Listening 演習（弱いほど優先）
  const listenWeak = (profile.skillAccuracy.listening ?? 1) <= 0.75;
  tasks.push({
    title: "Listen and Type 10問",
    channel: "app",
    detTaskType: "listen_and_type",
    skill: "listening",
    estimatedMinutes: 12,
    status: "todo",
    reason: "weakness",
    priority: listenWeak ? 75 : 60,
    scheduledDate: today,
    href: "/practice/listening/listen-and-type",
    completedAt: null,
  });

  // 4) Cambly（指定曜日）
  if (CAMBLY_DAYS.includes(dow)) {
    tasks.push({
      title: "Cambly 60分（DET形式の質問を練習）",
      channel: "cambly",
      detTaskType: "speak_about_photo",
      skill: "speaking",
      estimatedMinutes: 60,
      status: "todo",
      reason: "weakness",
      priority: 65,
      scheduledDate: today,
      href: "/speaking/new",
      completedAt: null,
    });
  }

  // 5) Writing（指定曜日）
  if (WRITING_DAYS.includes(dow)) {
    tasks.push({
      title: "ChatGPTで Write About the Photo を2問添削",
      channel: "chatgpt",
      detTaskType: "write_about_photo",
      skill: "writing",
      estimatedMinutes: 20,
      status: "todo",
      reason: "weakness",
      priority: 55,
      scheduledDate: today,
      href: "/writing/new",
      completedAt: null,
    });
  }

  // 6) 予算が余っていれば語彙メンテを追加
  const planned = tasks.reduce((s, t) => s + t.estimatedMinutes, 0);
  if (planned < budget && dueReviews === 0) {
    tasks.push({
      title: "Read and Select 15語（語彙メンテ）",
      channel: "app",
      detTaskType: "read_and_select",
      skill: "reading",
      estimatedMinutes: 8,
      status: "todo",
      reason: "maintenance",
      priority: 40,
      scheduledDate: today,
      href: "/practice/reading/read-and-select",
      completedAt: null,
    });
  }

  return tasks.sort((a, b) => b.priority - a.priority);
}

// 表示用ラベル（det.ts の循環依存を避けるため簡易版を内蔵）
function labelOf(t: DetTaskType): string {
  const map: Partial<Record<DetTaskType, string>> = {
    read_and_select: "Read and Select",
    read_and_complete: "Read and Complete",
    complete_the_sentences: "Complete the Sentences",
    interactive_reading: "Interactive Reading",
  };
  return map[t] ?? t;
}
