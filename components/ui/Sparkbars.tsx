export function Sparkbars({
  data,
  height = 36,
  tone = "brand",
  labels,
}: {
  data: number[];
  height?: number;
  tone?: "brand" | "accent";
  labels?: string[];
}) {
  const max = Math.max(1, ...data);
  const color = tone === "brand" ? "bg-brand-500" : "bg-accent-500";
  return (
    <div className="flex items-end gap-1" style={{ height }}>
      {data.map((v, i) => (
        <div key={i} className="flex flex-1 flex-col items-center justify-end">
          <div
            className={`w-full rounded-t ${v > 0 ? color : "bg-surface-border"}`}
            style={{
              height: `${Math.max(3, (v / max) * height)}px`,
            }}
            title={labels ? `${labels[i]}: ${v}` : `${v}`}
          />
        </div>
      ))}
    </div>
  );
}

/** 横棒（カテゴリ別の割合など） */
export function BarRow({
  label,
  value,
  max,
  tone = "brand",
  valueLabel,
}: {
  label: string;
  value: number;
  max: number;
  tone?: "brand" | "accent" | "warn";
  valueLabel?: string;
}) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  const color =
    tone === "brand"
      ? "bg-brand-500"
      : tone === "accent"
        ? "bg-accent-500"
        : "bg-warn";
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-xs">
        <span className="text-ink-soft">{label}</span>
        <span className="tabular text-ink-faint">{valueLabel ?? value}</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-pill bg-surface-muted">
        <div
          className={`h-full rounded-pill ${color} transition-all`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
