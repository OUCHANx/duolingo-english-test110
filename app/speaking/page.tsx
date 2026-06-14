"use client";

import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { LinkButton } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { EmptyState } from "@/components/ui/EmptyState";
import { formatDateShort } from "@/lib/det";

export default function SpeakingListPage() {
  const { ready, speakingLogs } = useData();
  if (!ready) return <Loading />;

  const logs = [...speakingLogs].sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <div>
      <PageHeader
        title="Cambly 記録"
        subtitle="Speaking の練習記録"
        action={
          <LinkButton href="/speaking/new" size="sm">
            + 追加
          </LinkButton>
        }
      />

      {logs.length === 0 ? (
        <EmptyState
          icon="🗣️"
          title="まだ記録がありません"
          description="Camblyのレッスン後に内容を記録すると、詰まったテーマや直された表現が弱点分析・復習に反映されます。"
          actionLabel="最初の記録を追加"
          actionHref="/speaking/new"
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
                    <Tag tone="amber">{l.durationMinutes}分</Tag>
                    {l.tutorName ? (
                      <span className="text-xs text-ink-faint">{l.tutorName}</span>
                    ) : null}
                  </div>
                  {l.selfScore ? (
                    <span className="text-xs text-ink-soft">
                      自己評価 {l.selfScore}/5
                    </span>
                  ) : null}
                </div>

                {l.topics.length ? (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {l.topics.map((t) => (
                      <Tag key={t} tone="blue">
                        {t}
                      </Tag>
                    ))}
                  </div>
                ) : null}

                {l.correctedExpressions.length ? (
                  <p className="mt-2 text-xs text-ink-soft">
                    ✍️ 直された表現: {l.correctedExpressions.join(" / ")}
                  </p>
                ) : null}
                {l.nextImprovement ? (
                  <p className="mt-1 text-xs text-ink-soft">
                    🎯 次回: {l.nextImprovement}
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
