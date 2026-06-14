"use client";

import { useData } from "@/context/DataContext";
import { DEFAULT_DEADLINE, DEFAULT_TARGET, diffDays, formatDateShort } from "@/lib/det";
import { evaluatePace } from "@/lib/scoring";
import { LinkButton } from "@/components/ui/Button";

export function CountdownCard() {
  const { goal, mockScores, today } = useData();
  const deadline = goal?.deadline ?? DEFAULT_DEADLINE;
  const target = goal?.targetOverall ?? DEFAULT_TARGET;
  const daysLeft = Math.max(0, diffDays(today, deadline));

  const sorted = [...mockScores].sort((a, b) => (a.date < b.date ? -1 : 1));
  const latest = sorted[sorted.length - 1] ?? null;
  const pace = evaluatePace(mockScores, goal, today);

  const gap = latest ? target - latest.overall : null;

  return (
    <div className="rounded-card bg-brand-600 p-5 text-white shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-white/80">🎯 目標まで</span>
        <span className="text-xs text-white/70">期限 {formatDateShort(deadline)}</span>
      </div>

      <div className="mt-2 flex items-end gap-4">
        <div>
          <div className="tabular text-4xl font-bold leading-none">{daysLeft}</div>
          <div className="text-xs text-white/80">日</div>
        </div>
        <div className="mb-0.5">
          <div className="tabular text-2xl font-bold leading-none">
            {gap !== null ? (gap > 0 ? `+${gap}` : `${gap}`) : "—"}
            <span className="ml-1 text-sm font-normal text-white/80">点</span>
          </div>
          <div className="text-xs text-white/80">
            {latest ? `現在 ${latest.overall} → 目標 ${target}` : `目標 ${target}`}
          </div>
        </div>
      </div>

      {latest ? (
        <div className="mt-3">
          <div className="mb-1 flex items-center justify-between text-[11px] text-white/80">
            <span>目安ライン {pace.expectedToday}</span>
            <span>
              {pace.status === "ahead"
                ? "🟢 目安より先行"
                : pace.status === "behind"
                  ? "🟠 目安より遅れ"
                  : "🟦 ほぼ目安どおり"}
            </span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-pill bg-white/25">
            <div
              className="h-full rounded-pill bg-white"
              style={{
                width: `${Math.min(100, Math.round((latest.overall / target) * 100))}%`,
              }}
            />
          </div>
        </div>
      ) : (
        <div className="mt-3">
          <LinkButton href="/progress" variant="secondary" size="sm">
            現在スコアを入力する
          </LinkButton>
        </div>
      )}
    </div>
  );
}
