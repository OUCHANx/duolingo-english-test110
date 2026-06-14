"use client";

import { useState } from "react";
import type {
  CompleteSentencesAnswer,
  CompleteSentencesPayload,
  GradeOutput,
  ReadingQuestion,
} from "@/lib/types";
import { gradeCompleteSentences } from "@/lib/graders";
import { Button } from "@/components/ui/Button";

export function CompleteTheSentences({
  question,
  onGraded,
}: {
  question: ReadingQuestion;
  onGraded: (g: GradeOutput, ua: string) => void;
}) {
  const payload = question.payload as CompleteSentencesPayload;
  const [answers, setAnswers] = useState<CompleteSentencesAnswer>({});
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    const g = gradeCompleteSentences(payload, answers);
    setSubmitted(true);
    onGraded(g, JSON.stringify(answers));
  };

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft">文脈に合う語句を選んでください。</p>
      {payload.gaps.map((g, gi) => (
        <div key={g.id} className="rounded-xl border border-surface-border p-3">
          <p className="text-[15px] text-ink">
            <span className="mr-1 text-ink-faint">{gi + 1}.</span>
            {g.before}{" "}
            <span className="font-semibold text-brand-600">＿＿</span> {g.after}
          </p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {g.options.map((opt, oi) => {
              const chosen = answers[g.id] === oi;
              let cls =
                "border-surface-border bg-white text-ink hover:border-brand-300";
              if (submitted) {
                if (oi === g.answerIdx)
                  cls = "border-accent-500 bg-accent-50 text-accent-700";
                else if (chosen) cls = "border-danger bg-red-50 text-red-700";
                else cls = "border-surface-border bg-surface-muted text-ink-faint";
              } else if (chosen) {
                cls = "border-brand-500 bg-brand-50 text-brand-700";
              }
              return (
                <button
                  key={oi}
                  type="button"
                  disabled={submitted}
                  onClick={() => setAnswers((a) => ({ ...a, [g.id]: oi }))}
                  className={`rounded-xl border px-3 py-2 text-sm font-medium transition ${cls}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>
          {submitted && g.explanation ? (
            <p className="mt-2 text-xs text-ink-soft">💡 {g.explanation}</p>
          ) : null}
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
