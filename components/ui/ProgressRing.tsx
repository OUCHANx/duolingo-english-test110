import type { ReactNode } from "react";

type Tone = "brand" | "accent" | "warn";

const STROKE: Record<Tone, string> = {
  brand: "#2563eb",
  accent: "#10b981",
  warn: "#f59e0b",
};

export function ProgressRing({
  value,
  size = 72,
  thickness = 8,
  tone = "brand",
  label,
  center,
}: {
  value: number; // 0..100
  size?: number;
  thickness?: number;
  tone?: Tone;
  label?: string;
  center?: ReactNode;
}) {
  const v = Math.max(0, Math.min(100, value));
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  const offset = c * (1 - v / 100);
  return (
    <div className="inline-flex flex-col items-center">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} className="-rotate-90">
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={thickness}
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={r}
            fill="none"
            stroke={STROKE[tone]}
            strokeWidth={thickness}
            strokeDasharray={c}
            strokeDashoffset={offset}
            strokeLinecap="round"
            className="transition-all duration-500"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          {center ?? (
            <span className="tabular text-base font-bold text-ink">
              {Math.round(v)}%
            </span>
          )}
        </div>
      </div>
      {label ? <span className="mt-1 text-xs text-ink-soft">{label}</span> : null}
    </div>
  );
}
