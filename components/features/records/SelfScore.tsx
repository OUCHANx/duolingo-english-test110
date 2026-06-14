"use client";

export function SelfScore({
  value,
  onChange,
}: {
  value: number | null;
  onChange: (v: 1 | 2 | 3 | 4 | 5) => void;
}) {
  return (
    <div className="flex gap-1.5">
      {([1, 2, 3, 4, 5] as const).map((n) => (
        <button
          key={n}
          type="button"
          onClick={() => onChange(n)}
          className={`h-10 w-10 rounded-xl border text-sm font-semibold transition ${
            value && n <= value
              ? "border-accent-500 bg-accent-500 text-white"
              : "border-surface-border bg-white text-ink-faint hover:border-accent-300"
          }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}
