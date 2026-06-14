"use client";

import { useMemo } from "react";
import { useParams } from "next/navigation";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { EmptyState } from "@/components/ui/EmptyState";
import { PracticeRunner } from "@/components/features/practice/PracticeRunner";
import { TASK_LABELS } from "@/lib/det";
import { generateListenType } from "@/lib/generate";
import type { DetTaskType } from "@/lib/types";

const LISTENING_TYPES: DetTaskType[] = ["listen_and_type"];

export default function ListeningRunnerPage() {
  const params = useParams<{ type: string }>();
  const { ready, listeningQuestions, dailyListening } = useData();
  const taskType = (params.type ?? "").replace(/-/g, "_") as DetTaskType;

  const questions = useMemo(() => {
    const daily = dailyListening.filter((q) => q.taskType === taskType);
    const fallback =
      taskType === "listen_and_type"
        ? generateListenType(8)
        : listeningQuestions.filter((q) => q.taskType === taskType);
    return [...daily, ...fallback].sort(() => Math.random() - 0.5).slice(0, 10);
  }, [listeningQuestions, dailyListening, taskType]);

  if (!ready) return <Loading />;

  if (!LISTENING_TYPES.includes(taskType)) {
    return (
      <EmptyState
        icon="🔍"
        title="形式が見つかりません"
        actionLabel="Listening 一覧へ"
        actionHref="/practice/listening"
      />
    );
  }

  return (
    <div>
      <PageHeader title={TASK_LABELS[taskType]} subtitle="Listening 演習" />
      <PracticeRunner
        taskType={taskType}
        skill="listening"
        questions={questions}
        backHref="/practice/listening"
      />
    </div>
  );
}
