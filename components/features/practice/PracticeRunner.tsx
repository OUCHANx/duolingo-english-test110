"use client";

import { useMemo, useRef, useState } from "react";
import { useData } from "@/context/DataContext";
import type {
  DetTaskType,
  GradeOutput,
  ListeningQuestion,
  ReadingQuestion,
  Skill,
} from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReadAndSelect } from "./ReadAndSelect";
import { ReadAndComplete } from "./ReadAndComplete";
import { CompleteTheSentences } from "./CompleteTheSentences";
import { InteractiveReading } from "./InteractiveReading";
import { ListenAndType } from "./ListenAndType";
import { ResultSummary } from "./ResultSummary";

type AnyQuestion = ReadingQuestion | ListeningQuestion;

export function PracticeRunner({
  taskType,
  skill,
  questions,
  backHref,
}: {
  taskType: DetTaskType;
  skill: Skill;
  questions: AnyQuestion[];
  backHref: string;
}) {
  const { actions } = useData();
  const [index, setIndex] = useState(0);
  const [graded, setGraded] = useState<
    Record<number, { grade: GradeOutput; ua: string }>
  >({});
  const [finished, setFinished] = useState(false);
  const [runKey, setRunKey] = useState(0);
  const startRef = useRef<number>(Date.now());

  const total = questions.length;
  const current = questions[index];
  const currentGraded = graded[index];

  const onGraded = (grade: GradeOutput, ua: string) => {
    setGraded((g) => ({ ...g, [index]: { grade, ua } }));
  };

  const finish = (finalGraded: typeof graded) => {
    const results = Object.entries(finalGraded).map(([i, v]) => ({
      questionId: questions[Number(i)].id,
      grade: v.grade,
      userAnswer: v.ua,
    }));
    const durationMinutes = Math.max(
      1,
      Math.round((Date.now() - startRef.current) / 60000),
    );
    actions.recordPracticeSession({ taskType, skill, durationMinutes, results });
    setFinished(true);
  };

  const next = () => {
    if (index + 1 < total) {
      setIndex(index + 1);
    } else {
      finish(graded);
    }
  };

  const retry = () => {
    setIndex(0);
    setGraded({});
    setFinished(false);
    startRef.current = Date.now();
    setRunKey((k) => k + 1);
  };

  const summary = useMemo(() => {
    let correct = 0;
    let items = 0;
    const fronts = new Set<string>();
    for (const v of Object.values(graded)) {
      correct += v.grade.correctCount;
      items += v.grade.itemCount;
      for (const s of v.grade.reviewSeeds) fronts.add(s.front);
    }
    return { correct, items, reviewAdded: fronts.size };
  }, [graded]);

  if (total === 0) {
    return (
      <EmptyState
        icon="📭"
        title="この形式の問題がまだありません"
        description="別の形式を試すか、設定からデータをリセットすると初期問題が入ります。"
        actionLabel="戻る"
        actionHref={backHref}
      />
    );
  }

  if (finished) {
    return (
      <ResultSummary
        correct={summary.correct}
        total={summary.items}
        reviewAdded={summary.reviewAdded}
        backHref={backHref}
        onRetry={retry}
      />
    );
  }

  const renderView = () => {
    switch (taskType) {
      case "read_and_select":
        return (
          <ReadAndSelect
            key={`${runKey}-${index}`}
            question={current as ReadingQuestion}
            onGraded={onGraded}
          />
        );
      case "read_and_complete":
        return (
          <ReadAndComplete
            key={`${runKey}-${index}`}
            question={current as ReadingQuestion}
            onGraded={onGraded}
          />
        );
      case "complete_the_sentences":
        return (
          <CompleteTheSentences
            key={`${runKey}-${index}`}
            question={current as ReadingQuestion}
            onGraded={onGraded}
          />
        );
      case "interactive_reading":
        return (
          <InteractiveReading
            key={`${runKey}-${index}`}
            question={current as ReadingQuestion}
            onGraded={onGraded}
          />
        );
      case "listen_and_type":
        return (
          <ListenAndType
            key={`${runKey}-${index}`}
            question={current as ListeningQuestion}
            onGraded={onGraded}
          />
        );
      default:
        return <p className="text-sm text-ink-faint">未対応の形式です。</p>;
    }
  };

  return (
    <div className="flex flex-col gap-4">
      {/* 進捗バー */}
      <div>
        <div className="mb-1 flex items-center justify-between text-xs text-ink-faint">
          <span>
            {index + 1} / {total}
          </span>
          <LinkButton href={backHref} variant="ghost" size="sm">
            中断
          </LinkButton>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-muted">
          <div
            className="h-full rounded-pill bg-brand-500 transition-all"
            style={{ width: `${((index + (currentGraded ? 1 : 0)) / total) * 100}%` }}
          />
        </div>
      </div>

      <Card>
        <CardBody>{renderView()}</CardBody>
      </Card>

      {currentGraded ? (
        <Button fullWidth variant="success" onClick={next}>
          {index + 1 < total ? "次へ →" : "結果を見る"}
        </Button>
      ) : null}
    </div>
  );
}
