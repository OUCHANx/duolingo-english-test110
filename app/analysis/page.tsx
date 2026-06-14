"use client";

import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { BarRow } from "@/components/ui/Sparkbars";
import { Tag } from "@/components/ui/Tag";
import { StatCard } from "@/components/ui/StatCard";
import { computeWeaknessProfile } from "@/lib/scoring";
import {
  LOG_CATEGORY_LABELS,
  SKILL_LABELS,
  SUBSCORES,
  SUBSCORE_LABELS,
  TASK_LABELS,
  WEAKNESS_TAG_LABELS,
} from "@/lib/det";
import type { DetTaskType, LogCategory, WeaknessTag } from "@/lib/types";

export default function AnalysisPage() {
  const data = useData();
  if (!data.ready) return <Loading />;

  const p = computeWeaknessProfile(data, data.today);

  const accPct = (v: number | null) => (v === null ? null : Math.round(v * 100));

  const listenRows: { label: string; key: keyof typeof p.listenBreakdown }[] = [
    { label: "音の聞き分け", key: "phoneme" },
    { label: "機能語の脱落", key: "funcword" },
    { label: "聞き落とし", key: "chunk" },
    { label: "数字・固有名詞", key: "numeral" },
    { label: "スペル", key: "spelling" },
  ];
  const listenMax = Math.max(
    1,
    ...listenRows.map((r) => p.listenBreakdown[r.key]),
  );

  const taskEntries = Object.entries(p.taskAccuracy) as [
    DetTaskType,
    { correct: number; total: number },
  ][];

  const tagEntries = (
    Object.entries(p.tagErrors) as [WeaknessTag, number][]
  ).sort((a, b) => b[1] - a[1]);

  const timeEntries = Object.entries(p.timeBalanceMinutes).filter(
    ([, v]) => v > 0,
  ) as [LogCategory, number][];
  const timeMax = Math.max(1, ...timeEntries.map(([, v]) => v));

  const hasExercise = data.exerciseResults.length > 0;

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="弱点分析" subtitle="演習・記録から自動集計" />

      {/* 学習量サマリー */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="直近7日"
          value={Math.floor(p.volume7dMinutes / 60)}
          unit={`時間${p.volume7dMinutes % 60 ? ` ${p.volume7dMinutes % 60}分` : ""}`}
          tone="brand"
        />
        <StatCard
          label="直近30日"
          value={Math.floor(p.volume30dMinutes / 60)}
          unit={`時間${p.volume30dMinutes % 60 ? ` ${p.volume30dMinutes % 60}分` : ""}`}
          tone="accent"
        />
      </div>

      {/* サブスコア別 */}
      <Card>
        <CardBody>
          <SectionTitle>サブスコア別の正答率</SectionTitle>
          {hasExercise ? (
            <div className="flex flex-col gap-2.5">
              {SUBSCORES.map((s) => {
                const v = accPct(p.subScoreAccuracy[s]);
                return (
                  <BarRow
                    key={s}
                    label={SUBSCORE_LABELS[s]}
                    value={v ?? 0}
                    max={100}
                    tone={v === null ? "warn" : v < 70 ? "warn" : "brand"}
                    valueLabel={v === null ? "未測定" : `${v}%`}
                  />
                );
              })}
            </div>
          ) : (
            <Empty />
          )}
        </CardBody>
      </Card>

      {/* 技能別 */}
      <Card>
        <CardBody>
          <SectionTitle>技能別の正答率（アプリ演習）</SectionTitle>
          {hasExercise ? (
            <div className="flex flex-col gap-2.5">
              {(["reading", "listening"] as const).map((s) => {
                const v = accPct(p.skillAccuracy[s]);
                return (
                  <BarRow
                    key={s}
                    label={SKILL_LABELS[s]}
                    value={v ?? 0}
                    max={100}
                    tone={s === "listening" ? "accent" : "brand"}
                    valueLabel={v === null ? "未測定" : `${v}%`}
                  />
                );
              })}
            </div>
          ) : (
            <Empty />
          )}
        </CardBody>
      </Card>

      {/* 形式別 */}
      {taskEntries.length ? (
        <Card>
          <CardBody>
            <SectionTitle>形式別の正答率</SectionTitle>
            <div className="flex flex-col gap-2.5">
              {taskEntries.map(([t, v]) => (
                <BarRow
                  key={t}
                  label={TASK_LABELS[t]}
                  value={v.total ? Math.round((v.correct / v.total) * 100) : 0}
                  max={100}
                  valueLabel={`${v.total ? Math.round((v.correct / v.total) * 100) : 0}% (${v.correct}/${v.total})`}
                />
              ))}
            </div>
          </CardBody>
        </Card>
      ) : null}

      {/* Listen and Type ミス内訳 */}
      <Card>
        <CardBody>
          <SectionTitle>Listen and Type のミス傾向</SectionTitle>
          {data.exerciseResults.some((r) => r.skill === "listening") ? (
            <div className="flex flex-col gap-2.5">
              {listenRows.map((r) => (
                <BarRow
                  key={r.key}
                  label={r.label}
                  value={p.listenBreakdown[r.key]}
                  max={listenMax}
                  tone="accent"
                  valueLabel={`${p.listenBreakdown[r.key]}件`}
                />
              ))}
            </div>
          ) : (
            <Empty msg="Listen and Type を解くと傾向が出ます" />
          )}
        </CardBody>
      </Card>

      {/* 学習時間の偏り */}
      <Card>
        <CardBody>
          <SectionTitle>学習時間の偏り</SectionTitle>
          {timeEntries.length ? (
            <div className="flex flex-col gap-2.5">
              {timeEntries.map(([c, v]) => (
                <BarRow
                  key={c}
                  label={LOG_CATEGORY_LABELS[c]}
                  value={v}
                  max={timeMax}
                  valueLabel={`${Math.floor(v / 60)}h${v % 60 ? ` ${v % 60}m` : ""}`}
                />
              ))}
            </div>
          ) : (
            <Empty msg="学習時間を記録すると配分が見えます" />
          )}
        </CardBody>
      </Card>

      {/* Cambly テーマ / Writing 文法 */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card>
          <CardBody>
            <SectionTitle>Cambly で詰まるテーマ</SectionTitle>
            {p.speakingThemes.length ? (
              <div className="flex flex-wrap gap-1.5">
                {p.speakingThemes.map((t) => (
                  <Tag key={t.theme} tone="amber">
                    {t.theme} ×{t.count}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty msg="Cambly記録から集計します" />
            )}
          </CardBody>
        </Card>
        <Card>
          <CardBody>
            <SectionTitle>Writing で多いミス</SectionTitle>
            {p.grammarErrors.length ? (
              <div className="flex flex-wrap gap-1.5">
                {p.grammarErrors.map((g) => (
                  <Tag key={g.error} tone="green">
                    {g.error} ×{g.count}
                  </Tag>
                ))}
              </div>
            ) : (
              <Empty msg="Writing記録から集計します" />
            )}
          </CardBody>
        </Card>
      </div>

      {/* タグ別の弱点 */}
      {tagEntries.length ? (
        <Card>
          <CardBody>
            <SectionTitle>誤りの多いポイント</SectionTitle>
            <div className="flex flex-wrap gap-1.5">
              {tagEntries.map(([tag, n]) => (
                <Tag key={tag} tone="red">
                  {WEAKNESS_TAG_LABELS[tag]} ×{n}
                </Tag>
              ))}
            </div>
          </CardBody>
        </Card>
      ) : null}
    </div>
  );
}

function Empty({ msg = "まだデータがありません" }: { msg?: string }) {
  return <p className="py-3 text-center text-sm text-ink-faint">{msg}</p>;
}
