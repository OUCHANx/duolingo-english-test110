"use client";

import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateShort, TASK_LABELS } from "@/lib/det";

export default function WritingListPage() {
  const { ready, writingLogs } = useData();
  if (!ready) return <Loading />;

  const logs = [...writingLogs].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <PageHeader
        title="Writing 記録"
        subtitle="ChatGPT 添削の記録"
        action={
          <LinkButton href="/writing/new" size="sm">
            + 追加
          </LinkButton>
        }
      />

      {logs.length === 0 ? (
        <EmptyState
          icon="✍️"
          title="まだ記録がありません"
          description="ChatGPTで添削したライティングを記録すると、文法ミスの傾向が分析され、覚えた表現が復習に回ります。"
          actionLabel="最初の記録を追加"
          actionHref="/writing/new"
        />
      ) : (
        <div className="flex flex-col gap-3">
          {logs.map((l) => (
            <Card key={l.id}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold text-ink">
                      {formatDateShort(l.date)}
                    </span>
                    <Tag tone="green">{TASK_LABELS[l.detTaskType]}</Tag>
                  </div>
                  <span className="text-xs text-ink-faint">{l.wordCount} words</span>
                </div>

                {l.prompt ? (
                  <p className="mt-2 line-clamp-2 text-sm text-ink-soft">
                    {l.prompt}
                  </p>
                ) : null}

                {l.grammarErrors.length ? (
                  <p className="mt-2 text-xs text-ink-soft">
                    ⚠️ 文法ミス: {l.grammarErrors.join(" / ")}
                  </p>
                ) : null}
                {l.newExpressions.length ? (
                  <p className="mt-1 text-xs text-ink-soft">
                    ✨ 覚えた表現: {l.newExpressions.join(" / ")}
                  </p>
                ) : null}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
