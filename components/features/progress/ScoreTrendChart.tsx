"use client";

import { diffDays } from "@/lib/det";

interface Pt {
  date: string;
  value: number;
}

export function ScoreTrendChart({
  goalLine,
  actuals,
  startDate,
  endDate,
}: {
  goalLine: Pt[];
  actuals: Pt[];
  startDate: string;
  endDate: string;
}) {
  const W = 320;
  const H = 180;
  const padL = 28;
  const padR = 10;
  const padT = 12;
  const padB = 22;

  const totalDays = Math.max(1, diffDays(startDate, endDate));
  const all = [...goalLine, ...actuals].map((p) => p.value);
  const yMin = Math.min(70, ...all) - 2;
  const yMax = Math.max(115, ...all) + 3;

  const x = (date: string) =>
    padL + (diffDays(startDate, date) / totalDays) * (W - padL - padR);
  const y = (v: number) =>
    padT + (1 - (v - yMin) / (yMax - yMin)) * (H - padT - padB);

  const toPath = (pts: Pt[]) =>
    pts
      .filter((p) => p.date >= startDate && p.date <= endDate)
      .map((p, i) => `${i === 0 ? "M" : "L"} ${x(p.date).toFixed(1)} ${y(p.value).toFixed(1)}`)
      .join(" ");

  // y軸グリッド（10刻み）
  const gridVals: number[] = [];
  for (let v = Math.ceil(yMin / 10) * 10; v <= yMax; v += 10) gridVals.push(v);

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      className="w-full"
      preserveAspectRatio="xMidYMid meet"
    >
      {gridVals.map((v) => (
        <g key={v}>
          <line
            x1={padL}
            x2={W - padR}
            y1={y(v)}
            y2={y(v)}
            stroke="#eef2f7"
            strokeWidth={1}
          />
          <text x={4} y={y(v) + 3} fontSize={9} fill="#94a3b8">
            {v}
          </text>
        </g>
      ))}

      {/* 目安ライン（点線） */}
      <path
        d={toPath(goalLine)}
        fill="none"
        stroke="#94a3b8"
        strokeWidth={1.5}
        strokeDasharray="4 3"
      />

      {/* 実績ライン */}
      {actuals.length > 0 ? (
        <>
          <path d={toPath(actuals)} fill="none" stroke="#2563eb" strokeWidth={2.5} />
          {actuals
            .filter((p) => p.date >= startDate && p.date <= endDate)
            .map((p, i) => (
              <circle
                key={i}
                cx={x(p.date)}
                cy={y(p.value)}
                r={3}
                fill="#2563eb"
              />
            ))}
        </>
      ) : null}
    </svg>
  );
}
