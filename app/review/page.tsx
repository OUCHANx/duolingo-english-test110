"use client";

import { useState } from "react";
import { useData, useDueReviews } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { EmptyState } from "@/components/ui/EmptyState";
import { ReviewQueue } from "@/components/features/review/ReviewQueue";
import { ReviewListItem } from "@/components/features/review/ReviewListItem";
import type { StudyChannel } from "@/lib/types";

type Filter = "all" | StudyChannel;

const FILTERS: { value: Filter; label: string }[] = [
  { value: "all", label: "すべて" },
  { value: "app", label: "演習" },
  { value: "cambly", label: "Cambly" },
  { value: "chatgpt", label: "Writing" },
];

export default function ReviewPage() {
  const { ready, reviewItems, actions } = useData();
  const due = useDueReviews();
  const [filter, setFilter] = useState<Filter>("all");
  const [showArchived, setShowArchived] = useState(false);

  if (!ready) return <Loading />;

  const list = reviewItems
    .filter((r) => (showArchived ? r.archived : !r.archived))
    .filter((r) => filter === "all" || r.sourceChannel === filter)
    .sort((a, b) => (a.dueDate < b.dueDate ? -1 : 1));

  return (
    <div className="flex flex-col gap-4">
      <PageHeader
        title="復習リスト"
        subtitle="間隔反復（SRS）で定着させる"
      />

      {/* 今日の復習 */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">
          今日の復習（{due.length}件）
        </h2>
        {due.length > 0 ? (
          <ReviewQueue items={due} />
        ) : reviewItems.length === 0 ? (
          <EmptyState
            icon="🔁"
            title="復習アイテムはまだありません"
            description="演習の間違い、聞き取れなかった語、Cambly・Writingで直された表現が自動で追加されます。"
            actionLabel="演習を始める"
            actionHref="/practice/reading"
          />
        ) : (
          <Card>
            <CardBody className="flex flex-col items-center gap-1 py-8 text-center">
              <span className="text-2xl">✅</span>
              <p className="text-sm font-semibold text-ink">
                今日の復習は完了！
              </p>
              <p className="text-xs text-ink-soft">次回の出題まで待ちましょう。</p>
            </CardBody>
          </Card>
        )}
      </div>

      {/* 全アイテム */}
      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-ink-soft">
            {showArchived ? "卒業した項目" : "登録済みの項目"}
          </h2>
          <button
            type="button"
            onClick={() => setShowArchived((s) => !s)}
            className="text-xs text-brand-600"
          >
            {showArchived ? "← 学習中に戻る" : "卒業済みを見る →"}
          </button>
        </div>

        <div className="mb-3 flex flex-wrap gap-1.5">
          {FILTERS.map((f) => (
            <button
              key={f.value}
              type="button"
              onClick={() => setFilter(f.value)}
              className={`rounded-pill px-3 py-1 text-xs font-medium transition ${
                filter === f.value
                  ? "bg-brand-600 text-white"
                  : "bg-surface-muted text-ink-soft hover:bg-brand-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <p className="rounded-card border border-dashed border-surface-border bg-white py-8 text-center text-sm text-ink-faint">
            該当する項目はありません。
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {list.map((r) => (
              <ReviewListItem
                key={r.id}
                item={r}
                onEdit={actions.editReviewBack}
                onArchive={actions.archiveReview}
                onDelete={actions.deleteReview}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
