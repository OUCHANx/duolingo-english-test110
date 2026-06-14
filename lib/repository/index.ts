import type {
  UserGoal,
  DailyLog,
  ReadingQuestion,
  ListeningQuestion,
  StudySession,
  ExerciseResult,
  SpeakingLog,
  WritingLog,
  MockScore,
  ReviewItem,
  StudyTask,
} from "../types";
import { GenericRepository } from "./genericRepository";
import { LocalStorageAdapter } from "./localStorage";
import type { StorageAdapter } from "./adapter";

// コレクション名（= 将来の Supabase テーブル名 snake_case）
export const COLLECTIONS = {
  userGoals: "user_goals",
  dailyLogs: "daily_logs",
  readingQuestions: "reading_questions",
  listeningQuestions: "listening_questions",
  studySessions: "study_sessions",
  exerciseResults: "exercise_results",
  speakingLogs: "speaking_logs",
  writingLogs: "writing_logs",
  mockScores: "mock_scores",
  reviewItems: "review_items",
  studyTasks: "study_tasks",
} as const;

// ここを差し替えれば Supabase 等に移行できる唯一の境界
const adapter: StorageAdapter = new LocalStorageAdapter();

export const repos = {
  userGoals: new GenericRepository<UserGoal>(COLLECTIONS.userGoals, adapter),
  dailyLogs: new GenericRepository<DailyLog>(COLLECTIONS.dailyLogs, adapter),
  readingQuestions: new GenericRepository<ReadingQuestion>(
    COLLECTIONS.readingQuestions,
    adapter,
  ),
  listeningQuestions: new GenericRepository<ListeningQuestion>(
    COLLECTIONS.listeningQuestions,
    adapter,
  ),
  studySessions: new GenericRepository<StudySession>(
    COLLECTIONS.studySessions,
    adapter,
  ),
  exerciseResults: new GenericRepository<ExerciseResult>(
    COLLECTIONS.exerciseResults,
    adapter,
  ),
  speakingLogs: new GenericRepository<SpeakingLog>(
    COLLECTIONS.speakingLogs,
    adapter,
  ),
  writingLogs: new GenericRepository<WritingLog>(
    COLLECTIONS.writingLogs,
    adapter,
  ),
  mockScores: new GenericRepository<MockScore>(COLLECTIONS.mockScores, adapter),
  reviewItems: new GenericRepository<ReviewItem>(
    COLLECTIONS.reviewItems,
    adapter,
  ),
  studyTasks: new GenericRepository<StudyTask>(
    COLLECTIONS.studyTasks,
    adapter,
  ),
};

export type Repos = typeof repos;
