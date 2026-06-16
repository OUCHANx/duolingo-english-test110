"use client";

import { useState } from "react";
import type { WritingLog } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { formatDateShort } from "@/lib/det";

export function PhotoReviewCard({ log }: { log: WritingLog }) {
  const [open, setOpen] = useState(false);

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-ink">
            {formatDateShort(log.date)}
          </span>
          <Tag tone="green">📷 Write About the Photo</Tag>
        </div>

        {log.photoImage ? (
          <div className="text-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={log.photoImage}
              alt="写真"
              className="inline-block max-h-[300px] max-w-full rounded-xl border border-surface-border"
            />
          </div>
        ) : null}

        <div className="rounded-xl bg-surface-muted p-3">
          <div className="mb-1 text-xs font-medium text-ink-faint">
            自分の回答（{log.wordCount} words）
          </div>
          <p className="whitespace-pre-wrap text-sm text-ink">
            {log.draftText.trim() || "（未入力）"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          className="self-start text-xs font-medium text-brand-600"
        >
          {open ? "▲ 模範解答・和訳・Tips を隠す" : "▼ 模範解答・和訳・Tips を見る"}
        </button>

        {open ? (
          <div className="flex flex-col gap-3">
            {log.modelAnswer ? (
              <div className="rounded-xl border border-accent-200 bg-accent-50 p-3">
                <div className="mb-1 text-xs font-semibold text-accent-700">
                  ⭐ 模範解答（DET 110 レベル）
                </div>
                <p className="text-sm leading-7 text-ink">{log.modelAnswer}</p>
                {log.modelAnswerJa ? (
                  <div className="mt-2 border-t border-accent-200 pt-2 text-xs leading-6 text-ink-soft">
                    {log.modelAnswerJa}
                  </div>
                ) : null}
              </div>
            ) : null}

            {log.photoTips && log.photoTips.length ? (
              <div className="rounded-xl border border-surface-border p-3">
                <div className="mb-2 text-xs font-semibold text-ink-soft">
                  💡 使える表現 Tips
                </div>
                <ul className="flex flex-col gap-1.5">
                  {log.photoTips.map((t, i) => (
                    <li key={i} className="flex items-baseline gap-2 text-sm">
                      <Tag tone="blue">{t.term}</Tag>
                      <span className="text-ink-soft">{t.ja}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
