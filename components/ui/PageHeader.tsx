import type { ReactNode } from "react";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <div>
        <h1 className="text-xl font-bold text-ink">{title}</h1>
        {subtitle ? (
          <p className="mt-0.5 text-sm text-ink-soft">{subtitle}</p>
        ) : null}
      </div>
      {action}
    </div>
  );
}

export function Loading() {
  return (
    <div className="flex items-center justify-center py-20 text-sm text-ink-faint">
      読み込み中…
    </div>
  );
}
