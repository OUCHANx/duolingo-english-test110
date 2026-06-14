"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useData } from "@/context/DataContext";
import { Loading } from "@/components/ui/PageHeader";
import { CountdownCard } from "@/components/features/dashboard/CountdownCard";
import { TodayPlanCard } from "@/components/features/dashboard/TodayPlanCard";
import { StreakCard } from "@/components/features/dashboard/StreakCard";
import { SubscorePreview } from "@/components/features/dashboard/SubscorePreview";
import { formatDateShort } from "@/lib/det";

const QUICK = [
  { href: "/practice/reading", label: "Reading 演習", icon: "📖" },
  { href: "/practice/listening", label: "Listening 演習", icon: "🎧" },
  { href: "/vocab", label: "単語帳", icon: "📚" },
  { href: "/speaking/new", label: "Cambly 記録", icon: "🗣️" },
  { href: "/writing/new", label: "Writing 記録", icon: "✍️" },
];

export default function DashboardPage() {
  const { ready, goal, today, actions } = useData();

  useEffect(() => {
    if (ready) actions.ensureTodayMenu();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, today]);

  if (!ready) return <Loading />;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-ink-soft">こんにちは 👋</p>
          <p className="text-lg font-bold text-ink">{formatDateShort(today)}</p>
        </div>
      </div>

      {!goal ? (
        <Link
          href="/settings"
          className="rounded-card border border-brand-100 bg-brand-50 p-4 text-sm text-brand-700"
        >
          <span className="font-semibold">はじめに目標を設定しましょう。</span>
          <br />
          目標スコア・期限・現在地を登録すると、残り日数や毎日のメニューが正確になります。→
        </Link>
      ) : null}

      <CountdownCard />
      <TodayPlanCard />
      <StreakCard />
      <SubscorePreview />

      <div>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">クイック操作</h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {QUICK.map((q) => (
            <Link
              key={q.href}
              href={q.href}
              className="flex flex-col items-center gap-1 rounded-card border border-surface-border bg-white px-3 py-4 text-center shadow-card transition hover:border-brand-200 hover:bg-brand-50"
            >
              <span className="text-2xl">{q.icon}</span>
              <span className="text-xs font-medium text-ink-soft">{q.label}</span>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
