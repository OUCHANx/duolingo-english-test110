"use client";

import { useState } from "react";
import type {
  ClozeAnswer,
  ClozePayload,
  GradeOutput,
  ReadingQuestion,
} from "@/lib/types";
import { gradeReadComplete } from "@/lib/graders";
import { Button } from "@/components/ui/Button";

export function ReadAndComplete({
  question,
  onGraded,
}: {
  question: ReadingQuestion;
  onGraded: (g: GradeOutput, ua: string) => void;
}) {
  const payload = question.payload as ClozePayload;
  const [answers, setAnswers] = useState<ClozeAnswer>({});
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<GradeOutput | null>(null);

  const submit = () => {
    const g = gradeReadComplete(payload, answers);
    setGrade(g);
    setSubmitted(true);
    onGraded(g, JSON.stringify(answers));
  };

  // {{id}} を入力欄に展開
  const parts = payload.text.split(/(\{\{\w+\}\})/);

  return (
    <div>
      <p className="mb-3 text-sm text-ink-soft">
        空所の語の<strong>残りの文字</strong>を入力してください。
      </p>

      <div className="rounded-xl border border-surface-border bg-white p-4 text-[15px] leading-9 text-ink">
        {parts.map((part, i) => {
          const m = part.match(/\{\{(\w+)\}\}/);
          if (!m) return <span key={i}>{part}</span>;
          const blank = payload.blanks.find((b) => b.id === m[1]);
          if (!blank) return <span key={i}>{part}</span>;
          const head = blank.full.slice(0, blank.keepHead);
          const item = grade?.items.find((it) => it.ref === blank.id);
          return (
            <span key={i} className="mx-0.5 inline-flex items-baseline">
              <span className="font-semibold">{head}</span>
              {submitted ? (
                <span
                  className={`ml-0.5 rounded px-1 font-semibold ${
                    item?.correct
                      ? "bg-accent-50 text-accent-700"
                      : "bg-red-50 text-red-700"
                  }`}
                >
                  {blank.full.slice(blank.keepHead)}
                </span>
              ) : (
                <input
                  value={answers[blank.id] ?? ""}
                  onChange={(e) =>
                    setAnswers((a) => ({ ...a, [blank.id]: e.target.value }))
                  }
                  className="ml-0.5 w-24 border-b-2 border-brand-300 bg-transparent text-center font-semibold text-brand-700 outline-none focus:border-brand-600"
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
              )}
            </span>
          );
        })}
      </div>

      {!submitted ? (
        <Button className="mt-4" fullWidth onClick={submit}>
          答え合わせ
        </Button>
      ) : (
        <div className="mt-3 flex flex-wrap gap-2">
          {grade?.items.map((it) => (
            <span
              key={it.ref}
              className={`rounded-pill px-2 py-0.5 text-xs ${
                it.correct
                  ? "bg-accent-50 text-accent-700"
                  : "bg-red-50 text-red-700"
              }`}
            >
              {it.correct ? "✓" : "✗"} {it.expected}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
