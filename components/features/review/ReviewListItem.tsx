"use client";

import { useState } from "react";
import type { ReviewItem } from "@/lib/types";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { WEAKNESS_TAG_LABELS, formatDateShort } from "@/lib/det";

export function ReviewListItem({
  item,
  onEdit,
  onArchive,
  onDelete,
}: {
  item: ReviewItem;
  onEdit: (id: string, back: string) => void;
  onArchive: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(item.back);

  const save = () => {
    const v = draft.trim();
    if (v) onEdit(item.id, v);
    setEditing(false);
  };

  return (
    <Card>
      <CardBody className="flex items-start gap-3 py-3">
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-ink">{item.front}</div>

          {editing ? (
            <div className="mt-1 flex items-center gap-2">
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") save();
                  if (e.key === "Escape") setEditing(false);
                }}
                autoFocus
                placeholder="日本語の意味を入力"
                className="w-full rounded-lg border border-brand-300 px-2 py-1 text-sm outline-none focus:border-brand-600"
              />
              <button
                type="button"
                onClick={save}
                className="shrink-0 rounded-pill bg-brand-600 px-2.5 py-1 text-xs font-semibold text-white"
              >
                保存
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => {
                setDraft(
                  item.back === "（意味を追加）" ? "" : item.back,
                );
                setEditing(true);
              }}
              className="mt-0.5 flex items-center gap-1 text-left text-xs text-ink-soft hover:text-brand-600"
              title="クリックして意味を編集"
            >
              <span>{item.back}</span>
              <span className="text-ink-faint">✏️</span>
            </button>
          )}

          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Tag
              tone={
                item.sourceChannel === "cambly"
                  ? "amber"
                  : item.sourceChannel === "chatgpt"
                    ? "green"
                    : "blue"
              }
            >
              {item.sourceChannel}
            </Tag>
            {item.tags.slice(0, 2).map((t) => (
              <Tag key={t} tone="gray">
                {WEAKNESS_TAG_LABELS[t]}
              </Tag>
            ))}
            <span className="text-[11px] text-ink-faint">
              次回 {formatDateShort(item.dueDate)} ・ box{item.box}
            </span>
          </div>
        </div>

        <div className="flex shrink-0 flex-col gap-1">
          {!item.archived ? (
            <button
              type="button"
              onClick={() => onArchive(item.id)}
              className="text-xs text-ink-faint hover:text-accent-600"
            >
              卒業
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => onDelete(item.id)}
            className="text-xs text-ink-faint hover:text-danger"
          >
            削除
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
