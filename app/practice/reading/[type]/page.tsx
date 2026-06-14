"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PracticeRunner } from "@/components/features/practice/PracticeRunner";
import { TASK_LABELS } from "@/lib/det";
import {
  generateReadCompleteFromVocab,
  generateReadSelectSets,
} from "@/lib/generate";
import type { DetTaskType } from "@/lib/types";

const READING_TYPES: DetTaskType[] = [
  "read_and_select",
  "read_and_complete",
  "complete_the_sentences",
  "interactive_reading",
];

export default function ReadingRunnerPage() {
  const params = useParams<{ type: string }>();
  const { ready, readingQuestions, dailyReading } = useData();
  const taskType = (params.type ?? "").replace(/-/g, "_") as DetTaskType;

  const questions = useMemo(() => {
    // Routine がクラウド生成した当該形式の問題（あれば最優先で合流）
    const daily = dailyReading.filter((q) => q.taskType === taskType);
    // 動的形式は毎回新しく生成、それ以外（Complete the Sentences / Interactive Reading）は手作り問題から
    const fallback =
      taskType === "read_and_select"
        ? generateReadSelectSets(3)
        : taskType === "read_and_complete"
          ? generateReadCompleteFromVocab(10)
          : readingQuestions.filter((q) => q.taskType === taskType);
    const pool = [...daily, ...fallback].sort(() => Math.random() - 0.5);
    return pool.slice(0, taskType === "read_and_select" ? 4 : 10);
  }, [readingQuestions, dailyReading, taskType]);

  if (!ready) return <Loading />;

  if (!READING_TYPES.includes(taskType)) {
    return (
      <EmptyState
        icon="🔍"
        title="形式が見つかりません"
        actionLabel="Reading 一覧へ"
        actionHref="/practice/reading"
      />
    );
  }

  return (
    <div>
      <PageHeader title={TASK_LABELS[taskType]} subtitle="Reading 演習" />
      <PracticeRunner
        taskType={taskType}
        skill="reading"
        questions={questions}
        backHref="/practice/reading"
      />
    </div>
  );
}
