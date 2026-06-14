"use client";

import { useState } from "react";
import type {
  GradeOutput,
  InteractiveAnswer,
  InteractiveReadingPayload,
  ReadingQuestion,
} from "@/lib/types";
import { gradeInteractiveReading } from "@/lib/graders";
import { Button } from "@/components/ui/Button";

export function InteractiveReading({
  question,
  onGraded,
}: {
  question: ReadingQuestion;
  onGraded: (g: GradeOutput, ua: string) => void;
}) {
  const payload = question.payload as InteractiveReadingPayload;
  const [answers, setAnswers] = useState<InteractiveAnswer>({});
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    const g = gradeInteractiveReading(payload, answers);
    setSubmitted(true);
    onGraded(g, JSON.stringify(answers));
  };

  const choice = (
    qid: string,
    options: { key: string | number; label: string }[],
    correctKey: string | number,
  ) => (
    <div className="mt-2 flex flex-col gap-2">
      {options.map((o) => {
        const chosen = answers[qid] === o.key;
        let cls = "border-surface-border bg-white text-ink hover:border-brand-300";
        if (submitted) {
          if (o.key === correctKey)
            cls = "border-accent-500 bg-accent-50 text-accent-700";
          else if (chosen) cls = "border-danger bg-red-50 text-red-700";
          else cls = "border-surface-border bg-surface-muted text-ink-faint";
        } else if (chosen) {
          cls = "border-brand-500 bg-brand-50 text-brand-700";
        }
        return (
          <button
            key={o.key}
            type="button"
            disabled={submitted}
            onClick={() => setAnswers((a) => ({ ...a, [qid]: o.key }))}
            className={`rounded-xl border px-3 py-2 text-left text-sm font-medium transition ${cls}`}
          >
            {o.label}
          </button>
        );
      })}
    </div>
  );

  return (
    <div className="flex flex-col gap-4">
      {payload.title ? (
        <h3 className="text-base font-bold text-ink">{payload.title}</h3>
      ) : null}
      <div className="rounded-xl border border-surface-border bg-surface-muted p-4 text-[15px] leading-7 text-ink">
        {payload.paragraphs.map((p, i) => (
          <p key={i} className={i > 0 ? "mt-3" : ""}>
            {p}
          </p>
        ))}
      </div>

      {payload.questions.map((q, qi) => (
        <div key={q.id} className="rounded-xl border border-surface-border p-3">
          <p className="text-sm font-medium text-ink">
            <span className="mr-1 text-ink-faint">Q{qi + 1}.</span>
            {q.kind === "completeSentence"
              ? `${q.before} ＿＿ ${q.after}`
              : "prompt" in q && q.prompt
                ? q.prompt
                : q.kind === "insertSentence"
                  ? `次の文を挿入する位置：「${q.sentence}」`
                  : "要約として最も適切なものを選んでください。"}
          </p>

          {q.kind === "highlight"
            ? choice(
                q.id,
                q.spans.map((s) => ({ key: s.id, label: s.text })),
                q.answerSpanId,
              )
            : q.kind === "insertSentence"
              ? choice(
                  q.id,
                  q.slots.map((s, i) => ({ key: i, label: s })),
                  q.answerSlot,
                )
              : choice(
                  q.id,
                  q.options.map((o, i) => ({ key: i, label: o })),
                  q.answerIdx,
                )}
        </div>
      ))}

      {!submitted ? (
        <Button fullWidth onClick={submit}>
          答え合わせ
        </Button>
      ) : null}
    </div>
  );
}
