"use client";

import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import { ScoreTrendChart } from "@/components/features/progress/ScoreTrendChart";
import { MockScoreForm } from "@/components/features/progress/MockScoreForm";
import { buildGoalLine, evaluatePace } from "@/lib/scoring";
import {
  DEFAULT_DEADLINE,
  DEFAULT_TARGET,
  SUBSCORES,
  SUBSCORE_LABELS,
  formatDateShort,
} from "@/lib/det";

const KIND_LABEL: Record<string, string> = {
  official: "公式",
  practice_test: "Practice",
  self_estimate: "推定",
};

export default function ProgressPage() {
  const { ready, goal, mockScores, today, actions } = useData();
  if (!ready) return <Loading />;

  const target = goal?.targetOverall ?? DEFAULT_TARGET;
  const deadline = goal?.deadline ?? DEFAULT_DEADLINE;
  const sorted = [...mockScores].sort((a, b) =>
    a.date < b.date ? -1 : a.date > b.date ? 1 : 0,
  );
  const startDate = goal?.startedAt ?? sorted[0]?.date ?? today;

  const goalLine = buildGoalLine(goal, mockScores, today);
  const actuals = sorted.map((m) => ({ date: m.date, value: m.overall }));
  const pace = evaluatePace(mockScores, goal, today);
  const latest = sorted[sorted.length - 1] ?? null;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="スコア進捗" subtitle={`目標 ${target} / 期限 ${formatDateShort(deadline)}`} />

      <Card>
        <CardBody>
          <SectionTitle
            action={
              <Tag
                tone={
                  pace.status === "ahead"
                    ? "green"
                    : pace.status === "behind"
                      ? "red"
                      : pace.status === "on_track"
                        ? "blue"
                        : "gray"
                }
              >
                {pace.status === "ahead"
                  ? "目安より先行"
                  : pace.status === "behind"
                    ? "目安より遅れ"
                    : pace.status === "on_track"
                      ? "ほぼ目安どおり"
                      : "データ待ち"}
              </Tag>
            }
          >
            スコア推移（点線＝目安ライン）
          </SectionTitle>
          <ScoreTrendChart
            goalLine={goalLine}
            actuals={actuals}
            startDate={startDate}
            endDate={deadline}
          />
          <div className="mt-2 flex items-center justify-between text-xs text-ink-soft">
            <span>今日の目安ライン {pace.expectedToday}</span>
            <span>
              {latest
                ? `直近 ${latest.overall}（目安差 ${pace.delta > 0 ? "+" : ""}${pace.delta.toFixed(0)}）`
                : "実績未入力"}
            </span>
          </div>
        </CardBody>
      </Card>

      {latest ? (
        <div className="grid grid-cols-4 gap-2">
          {SUBSCORES.map((s) => (
            <div
              key={s}
              className="rounded-card border border-surface-border bg-white p-2 text-center shadow-card"
            >
              <div className="text-[10px] text-ink-faint">{SUBSCORE_LABELS[s]}</div>
              <div className="tabular text-lg font-bold text-ink">
                {latest.subScores[s]}
              </div>
            </div>
          ))}
        </div>
      ) : null}

      <MockScoreForm />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">記録一覧</h2>
        {sorted.length === 0 ? (
          <p className="rounded-card border border-dashed border-surface-border bg-white py-8 text-center text-sm text-ink-faint">
            模試・テストのスコアを記録すると、推移がグラフになります。
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {[...sorted].reverse().map((m) => (
              <Card key={m.id}>
                <CardBody className="flex items-center gap-3 py-3">
                  <div className="w-14 shrink-0 text-xs font-medium text-ink-faint">
                    {formatDateShort(m.date)}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="tabular text-lg font-bold text-ink">
                      {m.overall}
                    </span>
                    <Tag tone="gray">{KIND_LABEL[m.kind] ?? m.kind}</Tag>
                  </div>
                  <div className="ml-auto flex items-center gap-3">
                    <span className="hidden text-xs text-ink-faint sm:inline">
                      L{m.subScores.literacy} / C{m.subScores.comprehension} / Cv
                      {m.subScores.conversation} / P{m.subScores.production}
                    </span>
                    <button
                      type="button"
                      onClick={() => actions.deleteMockScore(m.id)}
                      className="text-xs text-ink-faint hover:text-danger"
                    >
                      削除
                    </button>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
