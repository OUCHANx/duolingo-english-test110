"use client";

import { useState } from "react";
import type {
  GradeOutput,
  ReadSelectAnswer,
  ReadSelectPayload,
  ReadingQuestion,
} from "@/lib/types";
import { gradeReadSelect } from "@/lib/graders";
import { Button } from "@/components/ui/Button";

export function ReadAndSelect({
  question,
  onGraded,
}: {
  question: ReadingQuestion;
  onGraded: (g: GradeOutput, ua: string) => void;
}) {
  const payload = question.payload as ReadSelectPayload;
  const [picked, setPicked] = useState<ReadSelectAnswer>({});
  const [submitted, setSubmitted] = useState(false);

  const submit = () => {
    const g = gradeReadSelect(payload, picked);
    setSubmitted(true);
    onGraded(g, JSON.stringify(picked));
  };

  return (
    <div>
      <p className="mb-3 text-sm text-ink-soft">
        実在する英単語を<strong>すべて</strong>選んでください（偽単語を選ぶと減点）。
      </p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {payload.words.map((w) => {
          const isPicked = !!picked[w.id];
          let cls =
            "border-surface-border bg-white text-ink hover:border-brand-300";
          if (submitted) {
            if (w.isReal) {
              cls = isPicked
                ? "border-accent-500 bg-accent-50 text-accent-700"
                : "border-warn bg-amber-50 text-amber-700"; // 見落とし
            } else {
              cls = isPicked
                ? "border-danger bg-red-50 text-red-700" // 誤選択
                : "border-surface-border bg-surface-muted text-ink-faint";
            }
          } else if (isPicked) {
            cls = "border-brand-500 bg-brand-50 text-brand-700";
          }
          return (
            <button
              key={w.id}
              type="button"
              disabled={submitted}
              onClick={() => setPicked((p) => ({ ...p, [w.id]: !p[w.id] }))}
              className={`rounded-xl border px-3 py-2.5 text-sm font-medium transition ${cls}`}
            >
              {w.text}
              {submitted && w.isReal ? (
                <span className="ml-1 text-[10px]">実在</span>
              ) : null}
            </button>
          );
        })}
      </div>

      {!submitted ? (
        <Button className="mt-4" fullWidth onClick={submit}>
          答え合わせ
        </Button>
      ) : (
        <p className="mt-4 rounded-xl bg-surface-muted p-3 text-xs text-ink-soft">
          緑=正しく選べた実在語 / 黄=見落とした実在語 / 赤=誤って選んだ偽単語
        </p>
      )}
    </div>
  );
}
