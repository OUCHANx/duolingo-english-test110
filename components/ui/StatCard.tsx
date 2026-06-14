import type { ReactNode } from "react";

type Tone = "default" | "brand" | "accent" | "warn" | "danger";

const TONES: Record<Tone, string> = {
  default: "bg-white text-ink",
  brand: "bg-brand-600 text-white",
  accent: "bg-accent-500 text-white",
  warn: "bg-warn text-white",
  danger: "bg-danger text-white",
};

export function StatCard({
  label,
  value,
  unit,
  sub,
  tone = "default",
  icon,
}: {
  label: string;
  value: ReactNode;
  unit?: string;
  sub?: ReactNode;
  tone?: Tone;
  icon?: ReactNode;
}) {
  const muted = tone === "default";
  return (
    <div
      className={`rounded-card border p-4 shadow-card ${TONES[tone]} ${muted ? "border-surface-border" : "border-transparent"}`}
    >
      <div
        className={`flex items-center gap-1 text-xs font-medium ${muted ? "text-ink-faint" : "text-white/80"}`}
      >
        {icon}
        {label}
      </div>
      <div className="mt-1 flex items-baseline gap-1">
        <span className="tabular text-2xl font-bold">{value}</span>
        {unit ? (
          <span className={`text-sm ${muted ? "text-ink-soft" : "text-white/80"}`}>
            {unit}
          </span>
        ) : null}
      </div>
      {sub ? (
        <div
          className={`mt-1 text-xs ${muted ? "text-ink-soft" : "text-white/80"}`}
        >
          {sub}
        </div>
      ) : null}
    </div>
  );
}
