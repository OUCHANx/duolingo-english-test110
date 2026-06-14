"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import type { ReviewItem } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { ReviewResult } from "@/lib/srs";
import { WEAKNESS_TAG_LABELS } from "@/lib/det";
import { loadSpeechSettings, speak as speakEnglish } from "@/lib/speech";

const RATINGS: { result: ReviewResult; label: string; cls: string }[] = [
  { result: "again", label: "もう一度", cls: "bg-danger text-white" },
  { result: "hard", label: "難しい", cls: "bg-warn text-white" },
  { result: "good", label: "できた", cls: "bg-brand-600 text-white" },
  { result: "easy", label: "簡単", cls: "bg-accent-500 text-white" },
];

export function ReviewQueue({ items }: { items: ReviewItem[] }) {
  const { actions } = useData();
  const [queue, setQueue] = useState<ReviewItem[]>(() => items);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);

  const current = queue[index];

  const speak = (text: string) => {
    void speakEnglish(text, { rate: loadSpeechSettings().rate });
  };

  if (!current) {
    return (
      <Card>
        <CardBody className="flex flex-col items-center gap-2 py-10 text-center">
          <span className="text-3xl">🎉</span>
          <p className="text-base font-semibold text-ink">今日の復習は完了！</p>
          <p className="text-sm text-ink-soft">お疲れさまでした。</p>
        </CardBody>
      </Card>
    );
  }

  const rate = (result: ReviewResult) => {
    actions.reviewCard(current.id, result);
    setRevealed(false);
    // 「もう一度」は同一セッション内の末尾に再投入して当日中に再出題
    if (result === "again") {
      setQueue((q) => [...q, current]);
    }
    setIndex((i) => i + 1);
  };

  const isAudio = current.front.startsWith("🔊");
  // 音声は表の英単語を読み上げる（裏は日本語訳のため）
  const word = current.front.replace(/[^a-zA-Z' ]/g, " ").trim();

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="flex items-center justify-between text-xs text-ink-faint">
          <span>
            {index + 1} / {queue.length}
          </span>
          <Tag
            tone={
              current.sourceChannel === "cambly"
                ? "amber"
                : current.sourceChannel === "chatgpt"
                  ? "green"
                  : "blue"
            }
          >
            {current.sourceChannel}
          </Tag>
        </div>

        <div className="flex min-h-[120px] flex-col items-center justify-center gap-2 rounded-xl bg-surface-muted p-6 text-center">
          <div className="text-xl font-bold text-ink">{current.front}</div>
          {isAudio ? (
            <button
              type="button"
              onClick={() => speak(word)}
              className="mt-1 rounded-pill bg-brand-600 px-3 py-1 text-xs text-white"
            >
              ▶ 音声
            </button>
          ) : null}
          {revealed ? (
            <>
              <div className="mt-2 h-px w-16 bg-surface-border" />
              <div className="text-base text-ink-soft">{current.back}</div>
              {current.context ? (
                <div className="mt-1 text-xs text-ink-faint">{current.context}</div>
              ) : null}
              <div className="mt-2 flex flex-wrap justify-center gap-1">
                {current.tags.map((t) => (
                  <Tag key={t} tone="gray">
                    {WEAKNESS_TAG_LABELS[t]}
                  </Tag>
                ))}
              </div>
            </>
          ) : null}
        </div>

        {!revealed ? (
          <button
            type="button"
            onClick={() => setRevealed(true)}
            className="h-11 rounded-pill bg-brand-600 font-semibold text-white hover:bg-brand-700"
          >
            答えを見る
          </button>
        ) : (
          <div className="grid grid-cols-4 gap-2">
            {RATINGS.map((r) => (
              <button
                key={r.result}
                type="button"
                onClick={() => rate(r.result)}
                className={`h-11 rounded-pill text-xs font-semibold ${r.cls}`}
              >
                {r.label}
              </button>
            ))}
          </div>
        )}
      </CardBody>
    </Card>
  );
}
