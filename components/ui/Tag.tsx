import type { ReactNode } from "react";

type Tone = "blue" | "green" | "gray" | "amber" | "red";

const TONES: Record<Tone, string> = {
  blue: "bg-brand-50 text-brand-700",
  green: "bg-accent-50 text-accent-700",
  gray: "bg-surface-muted text-ink-soft",
  amber: "bg-amber-50 text-amber-700",
  red: "bg-red-50 text-red-700",
};

export function Tag({
  children,
  tone = "gray",
  className = "",
}: {
  children: ReactNode;
  tone?: Tone;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center rounded-pill px-2 py-0.5 text-xs font-medium ${TONES[tone]} ${className}`}
    >
      {children}
    </span>
  );
}
