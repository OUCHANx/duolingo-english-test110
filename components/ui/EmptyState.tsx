import Link from "next/link";
import type { ReactNode } from "react";

export function EmptyState({
  icon = "🌱",
  title,
  description,
  actionLabel,
  actionHref,
}: {
  icon?: ReactNode;
  title: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-card border border-dashed border-surface-border bg-white px-6 py-10 text-center">
      <div className="text-3xl">{icon}</div>
      <p className="mt-2 text-sm font-semibold text-ink">{title}</p>
      {description ? (
        <p className="mt-1 max-w-xs text-xs text-ink-soft">{description}</p>
      ) : null}
      {actionLabel && actionHref ? (
        <Link
          href={actionHref}
          className="mt-4 rounded-pill bg-brand-600 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-700"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
