"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  DailyLog,
  DetTaskType,
  ExerciseResult,
  GradeOutput,
  ListeningQuestion,
  LogCategory,
  MockScore,
  ReadingQuestion,
  ReviewItem,
  ReviewSeed,
  Skill,
  SpeakingLog,
  StudySession,
  StudyTask,
  UserGoal,
  WritingLog,
} from "@/lib/types";
import { repos } from "@/lib/repository";
import { seedContentIfEmpty } from "@/lib/seed";
import { enrichedBack } from "@/lib/dictionary";
import { fetchDailyQuestions } from "@/lib/dailyQuestions";
import { todayISO } from "@/lib/det";
import {
  applyReview,
  dueCount,
  freshSrs,
  getDueReviews,
  type ReviewResult,
} from "@/lib/srs";
import { computeWeaknessProfile, generateDailyMenu } from "@/lib/scoring";

interface DataState {
  ready: boolean;
  today: string;
  goal: UserGoal | null;
  dailyLogs: DailyLog[];
  readingQuestions: ReadingQuestion[];
  listeningQuestions: ListeningQuestion[];
  studySessions: StudySession[];
  exerciseResults: ExerciseResult[];
  speakingLogs: SpeakingLog[];
  writingLogs: WritingLog[];
  mockScores: MockScore[];
  reviewItems: ReviewItem[];
  studyTasks: StudyTask[];
}

interface DataActions {
  refresh: () => void;
  saveGoal: (input: Omit<UserGoal, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  addMockScore: (input: Omit<MockScore, "id" | "userId" | "createdAt" | "updatedAt">) => void;
  deleteMockScore: (id: string) => void;
  addSpeakingLog: (
    input: Omit<SpeakingLog, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => void;
  addWritingLog: (
    input: Omit<WritingLog, "id" | "userId" | "createdAt" | "updatedAt">,
  ) => void;
  addManualSession: (input: {
    date: string;
    category: LogCategory;
    durationMinutes: number;
    note: string | null;
  }) => void;
  deleteSession: (id: string) => void;
  saveDailyNote: (
    date: string,
    fields: { reflection: string | null; tomorrow: string | null },
  ) => void;
  recordPracticeSession: (params: {
    taskType: DetTaskType;
    skill: Skill;
    durationMinutes: number;
    results: { questionId: string; grade: GradeOutput; userAnswer: string }[];
  }) => void;
  ensureTodayMenu: () => void;
  regenerateTodayMenu: () => void;
  setTaskStatus: (id: string, status: StudyTask["status"]) => void;
  addReviewItem: (
    seed: ReviewSeed,
    sourceChannel: ReviewItem["sourceChannel"],
    sourceId?: string | null,
  ) => void;
  reviewCard: (id: string, result: ReviewResult) => void;
  editReviewBack: (id: string, back: string) => void;
  archiveReview: (id: string) => void;
  deleteReview: (id: string) => void;
  resetAllData: () => void;
}

type DataContextValue = DataState & {
  actions: DataActions;
  dailyReading: ReadingQuestion[];
  dailyListening: ListeningQuestion[];
  dailyGeneratedAt: string | null;
};

const DataContext = createContext<DataContextValue | null>(null);

function emptyState(): DataState {
  return {
    ready: false,
    today: todayISO(),
    goal: null,
    dailyLogs: [],
    readingQuestions: [],
    listeningQuestions: [],
    studySessions: [],
    exerciseResults: [],
    speakingLogs: [],
    writingLogs: [],
    mockScores: [],
    reviewItems: [],
    studyTasks: [],
  };
}

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<DataState>(emptyState);
  const [daily, setDaily] = useState<{
    reading: ReadingQuestion[];
    listening: ListeningQuestion[];
    generatedAt: string | null;
  }>({ reading: [], listening: [], generatedAt: null });

  const readAll = useCallback((): DataState => {
    const goals = repos.userGoals.list();
    return {
      ready: true,
      today: todayISO(),
      goal: goals.find((g) => g.isActive) ?? goals[0] ?? null,
      dailyLogs: repos.dailyLogs.list(),
      readingQuestions: repos.readingQuestions.list(),
      listeningQuestions: repos.listeningQuestions.list(),
      studySessions: repos.studySessions.list(),
      exerciseResults: repos.exerciseResults.list(),
      speakingLogs: repos.speakingLogs.list(),
      writingLogs: repos.writingLogs.list(),
      mockScores: repos.mockScores.list(),
      reviewItems: repos.reviewItems.list(),
      studyTasks: repos.studyTasks.list(),
    };
  }, []);

  const refresh = useCallback(() => {
    setState(readAll());
  }, [readAll]);

  useEffect(() => {
    seedContentIfEmpty();
    // 既存の単語カードに日本語訳を補完（辞書にある語のみ）
    for (const item of repos.reviewItems.list()) {
      const nb = enrichedBack(item);
      if (nb && nb !== item.back) repos.reviewItems.update(item.id, { back: nb });
    }
    refresh();
  }, [refresh]);

  // Routine がクラウド生成した問題ファイルを取得（あれば演習プールに合流）
  useEffect(() => {
    let alive = true;
    fetchDailyQuestions().then((d) => {
      if (alive && d) {
        setDaily({
          reading: d.readingQuestions,
          listening: d.listeningQuestions,
          generatedAt: d.generatedAt,
        });
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  // ---- 復習アイテムの重複判定（front+back を正規化して未卒業に同一があれば作らない）----
  const reviewExists = useCallback((front: string, back: string): boolean => {
    const norm = (s: string) => s.trim().toLowerCase();
    return repos.reviewItems
      .list()
      .some(
        (r) =>
          !r.archived && norm(r.front) === norm(front) && norm(r.back) === norm(back),
      );
  }, []);

  const addReviewItem = useCallback(
    (
      seed: ReviewSeed,
      sourceChannel: ReviewItem["sourceChannel"],
      sourceId: string | null = null,
    ) => {
      if (reviewExists(seed.front, seed.back)) return;
      const srs = freshSrs(todayISO());
      repos.reviewItems.create({
        kind: seed.kind,
        front: seed.front,
        back: seed.back,
        context: seed.context ?? null,
        sourceChannel,
        sourceId,
        tags: seed.tags,
        ...srs,
      });
      refresh();
    },
    [refresh, reviewExists],
  );

  const completeMatchingTask = useCallback(
    (match: (t: StudyTask) => boolean) => {
      const today = todayISO();
      const t = repos.studyTasks
        .list()
        .find(
          (x) => x.scheduledDate === today && x.status !== "done" && match(x),
        );
      if (t) repos.studyTasks.update(t.id, { status: "done", completedAt: todayISO() });
    },
    [],
  );

  const recordPracticeSession = useCallback<DataActions["recordPracticeSession"]>(
    ({ taskType, skill, durationMinutes, results }) => {
      const today = todayISO();
      let itemCount = 0;
      let correctCount = 0;
      for (const r of results) {
        itemCount += r.grade.itemCount;
        correctCount += r.grade.correctCount;
      }
      const session = repos.studySessions.create({
        date: today,
        channel: "app",
        category: skill === "listening" ? "listening" : "reading",
        taskTypes: [taskType],
        durationMinutes,
        itemCount,
        correctCount,
        accuracy: itemCount ? correctCount / itemCount : null,
        isManual: false,
        note: null,
      });

      for (const r of results) {
        repos.exerciseResults.create({
          sessionId: session.id,
          questionId: r.questionId,
          taskType,
          skill,
          isCorrect: r.grade.score01 >= 0.999,
          score: r.grade.score01,
          correctCount: r.grade.correctCount,
          itemCount: r.grade.itemCount,
          userAnswer: r.userAnswer,
          itemOutcomes: r.grade.items,
          timeSpentSec: 0,
        });
        // 復習アイテム生成
        for (const seed of r.grade.reviewSeeds) {
          if (!reviewExists(seed.front, seed.back)) {
            const srs = freshSrs(today);
            repos.reviewItems.create({
              kind: seed.kind,
              front: seed.front,
              back: seed.back,
              context: seed.context ?? null,
              sourceChannel: "app",
              sourceId: r.questionId,
              tags: seed.tags,
              ...srs,
            });
          }
        }
      }

      // 今日のメニューの対応タスクを完了扱いに
      completeMatchingTask((t) => t.detTaskType === taskType);
      refresh();
    },
    [completeMatchingTask, refresh, reviewExists],
  );

  const ensureTodayMenu = useCallback(() => {
    const today = todayISO();
    const tasks = repos.studyTasks.list();
    const hasToday = tasks.some((t) => t.scheduledDate === today);
    if (hasToday) return;

    const goal = repos.userGoals.list().find((g) => g.isActive) ?? null;
    const data = {
      goal,
      studySessions: repos.studySessions.list(),
      exerciseResults: repos.exerciseResults.list(),
      speakingLogs: repos.speakingLogs.list(),
      writingLogs: repos.writingLogs.list(),
      mockScores: repos.mockScores.list(),
      reviewItems: repos.reviewItems.list(),
    };
    const profile = computeWeaknessProfile(data, today);
    const menu = generateDailyMenu({
      today,
      goal,
      profile,
      dueReviews: dueCount(data.reviewItems, today),
    });
    for (const t of menu) repos.studyTasks.create(t);
    refresh();
  }, [refresh]);

  const regenerateTodayMenu = useCallback(() => {
    const today = todayISO();
    for (const t of repos.studyTasks.list()) {
      if (t.scheduledDate === today) repos.studyTasks.remove(t.id);
    }
    ensureTodayMenu();
  }, [ensureTodayMenu]);

  const actions: DataActions = useMemo(
    () => ({
      refresh,
      saveGoal: (input) => {
        // 既存のアクティブゴールを更新、なければ作成
        const existing = repos.userGoals.list().find((g) => g.isActive);
        if (existing) repos.userGoals.update(existing.id, input);
        else repos.userGoals.create(input);
        refresh();
      },
      addMockScore: (input) => {
        repos.mockScores.create(input);
        refresh();
      },
      deleteMockScore: (id) => {
        repos.mockScores.remove(id);
        refresh();
      },
      addSpeakingLog: (input) => {
        const log = repos.speakingLogs.create(input);
        for (const e of [...input.correctedExpressions, ...input.stuckQuestions]) {
          const front = e.trim();
          const back = "（Camblyで指摘・要復習）";
          if (front && !reviewExists(front, back)) {
            const srs = freshSrs(todayISO());
            repos.reviewItems.create({
              kind: "expression",
              front,
              back,
              context: input.topics.join(", ") || null,
              sourceChannel: "cambly",
              sourceId: log.id,
              tags: ["grammar"],
              ...srs,
            });
          }
        }
        completeMatchingTask((t) => t.channel === "cambly");
        refresh();
      },
      addWritingLog: (input) => {
        const log = repos.writingLogs.create(input);
        for (const e of [...input.newExpressions, ...input.grammarErrors]) {
          const front = e.trim();
          const back = "（ChatGPT添削・要復習）";
          if (front && !reviewExists(front, back)) {
            const srs = freshSrs(todayISO());
            repos.reviewItems.create({
              kind: "expression",
              front,
              back,
              context: input.prompt || null,
              sourceChannel: "chatgpt",
              sourceId: log.id,
              tags: ["grammar"],
              ...srs,
            });
          }
        }
        completeMatchingTask((t) => t.channel === "chatgpt");
        refresh();
      },
      addManualSession: (input) => {
        repos.studySessions.create({
          date: input.date,
          channel: "other",
          category: input.category,
          taskTypes: [],
          durationMinutes: input.durationMinutes,
          itemCount: 0,
          correctCount: 0,
          accuracy: null,
          isManual: true,
          note: input.note,
        });
        refresh();
      },
      deleteSession: (id) => {
        repos.studySessions.remove(id);
        refresh();
      },
      saveDailyNote: (date, fields) => {
        const existing = repos.dailyLogs.list().find((d) => d.date === date);
        if (existing) {
          repos.dailyLogs.update(existing.id, fields);
        } else {
          repos.dailyLogs.create({
            date,
            reflection: fields.reflection,
            tomorrow: fields.tomorrow,
            mood: null,
          });
        }
        refresh();
      },
      recordPracticeSession,
      ensureTodayMenu,
      regenerateTodayMenu,
      setTaskStatus: (id, status) => {
        repos.studyTasks.update(id, {
          status,
          completedAt: status === "done" ? todayISO() : null,
        });
        refresh();
      },
      addReviewItem,
      reviewCard: (id, result) => {
        const item = repos.reviewItems.getById(id);
        if (!item) return;
        const next = applyReview(item, result, todayISO());
        repos.reviewItems.update(id, next);
        refresh();
      },
      editReviewBack: (id, back) => {
        repos.reviewItems.update(id, { back });
        refresh();
      },
      archiveReview: (id) => {
        repos.reviewItems.update(id, { archived: true });
        refresh();
      },
      deleteReview: (id) => {
        repos.reviewItems.remove(id);
        refresh();
      },
      resetAllData: () => {
        repos.userGoals.bulkPut([]);
        repos.dailyLogs.bulkPut([]);
        repos.studySessions.bulkPut([]);
        repos.exerciseResults.bulkPut([]);
        repos.speakingLogs.bulkPut([]);
        repos.writingLogs.bulkPut([]);
        repos.mockScores.bulkPut([]);
        repos.reviewItems.bulkPut([]);
        repos.studyTasks.bulkPut([]);
        repos.readingQuestions.bulkPut([]);
        repos.listeningQuestions.bulkPut([]);
        seedContentIfEmpty();
        refresh();
      },
    }),
    [
      addReviewItem,
      completeMatchingTask,
      ensureTodayMenu,
      recordPracticeSession,
      refresh,
      regenerateTodayMenu,
      reviewExists,
    ],
  );

  const value: DataContextValue = {
    ...state,
    actions,
    dailyReading: daily.reading,
    dailyListening: daily.listening,
    dailyGeneratedAt: daily.generatedAt,
  };

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useData must be used within DataProvider");
  return ctx;
}

export function useDueReviews(): ReviewItem[] {
  const { reviewItems, today } = useData();
  return useMemo(() => getDueReviews(reviewItems, today), [reviewItems, today]);
}
