"use client";

import Link from "next/link";
import { useData } from "@/context/DataContext";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { BarRow } from "@/components/ui/Sparkbars";
import { computeWeaknessProfile } from "@/lib/scoring";
import { SUBSCORES, SUBSCORE_LABELS } from "@/lib/det";

export function SubscorePreview() {
  const data = useData();
  const profile = computeWeaknessProfile(data, data.today);

  const entries = SUBSCORES.map((s) => ({
    key: s,
    label: SUBSCORE_LABELS[s],
    acc: profile.subScoreAccuracy[s],
  }));
  const hasData = entries.some((e) => e.acc !== null);

  return (
    <Card>
      <CardBody>
        <SectionTitle
          action={
            <Link href="/analysis" className="text-xs font-medium text-brand-600">
              分析を見る →
            </Link>
          }
        >
          🧭 サブスコア別の正答率
        </SectionTitle>

        {hasData ? (
          <div className="flex flex-col gap-2.5">
            {entries.map((e) => {
              const v = e.acc === null ? 0 : Math.round(e.acc * 100);
              const tone = e.acc === null ? "warn" : v < 70 ? "warn" : "brand";
              return (
                <BarRow
                  key={e.key}
                  label={e.label}
                  value={v}
                  max={100}
                  tone={tone}
                  valueLabel={e.acc === null ? "未測定" : `${v}%`}
                />
              );
            })}
          </div>
        ) : (
          <p className="py-3 text-center text-sm text-ink-faint">
            Reading / Listening を演習すると、ここに弱点が表示されます。
          </p>
        )}
      </CardBody>
    </Card>
  );
}
