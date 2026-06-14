"use client";

import { useData } from "@/context/DataContext";
import { Card, CardBody } from "@/components/ui/Card";
import { Sparkbars } from "@/components/ui/Sparkbars";
import {
  activityDateSet,
  buildActivities,
  calcStreak,
  minutesInRange,
} from "@/lib/scoring";
import { addDays } from "@/lib/det";

export function StreakCard() {
  const { studySessions, speakingLogs, writingLogs, mockScores, goal, today } =
    useData();

  const activities = buildActivities({ studySessions, speakingLogs, writingLogs });
  const dates = activityDateSet(activities, mockScores);
  const streak = calcStreak(dates, today);

  // 直近7日の各日学習量
  const last7: number[] = [];
  const labels: string[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = addDays(today, -i);
    last7.push(minutesInRange(activities, d, d));
    labels.push(d.slice(5));
  }
  const weekMinutes = last7.reduce((s, v) => s + v, 0);
  const weekTarget = goal?.weeklyStudyMinutesTarget ?? 300;
  const pct = Math.min(100, Math.round((weekMinutes / weekTarget) * 100));

  return (
    <div className="grid grid-cols-2 gap-3">
      <Card>
        <CardBody>
          <div className="text-xs font-medium text-ink-faint">🔥 連続学習</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="tabular text-3xl font-bold text-ink">{streak}</span>
            <span className="text-sm text-ink-soft">日</span>
          </div>
          <div className="mt-2">
            <Sparkbars data={last7} labels={labels} tone="brand" />
          </div>
          <div className="mt-1 text-[11px] text-ink-faint">直近7日</div>
        </CardBody>
      </Card>

      <Card>
        <CardBody>
          <div className="text-xs font-medium text-ink-faint">📊 今週の学習量</div>
          <div className="mt-1 flex items-baseline gap-1">
            <span className="tabular text-3xl font-bold text-ink">
              {Math.floor(weekMinutes / 60)}
            </span>
            <span className="text-sm text-ink-soft">
              時間{weekMinutes % 60 ? ` ${weekMinutes % 60}分` : ""}
            </span>
          </div>
          <div className="mt-3 h-2.5 w-full overflow-hidden rounded-pill bg-surface-muted">
            <div
              className={`h-full rounded-pill ${pct >= 100 ? "bg-accent-500" : "bg-brand-500"}`}
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-1 text-[11px] text-ink-faint">
            週目標 {Math.floor(weekTarget / 60)}時間 / {pct}%
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
