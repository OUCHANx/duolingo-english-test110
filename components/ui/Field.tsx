"use client";

import { useState, type ReactNode } from "react";

export function Field({
  label,
  hint,
  required,
  children,
}: {
  label: string;
  hint?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-1 text-sm font-medium text-ink-soft">
        {label}
        {required ? <span className="text-danger">*</span> : null}
      </span>
      {children}
      {hint ? <span className="mt-1 block text-xs text-ink-faint">{hint}</span> : null}
    </label>
  );
}

const inputClass =
  "w-full rounded-xl border border-surface-border bg-white px-3 py-2.5 text-sm text-ink outline-none transition focus:border-brand-500 focus:ring-2 focus:ring-brand-100";

export function TextInput(
  props: React.InputHTMLAttributes<HTMLInputElement>,
) {
  return <input {...props} className={`${inputClass} ${props.className ?? ""}`} />;
}

export function TextArea(
  props: React.TextareaHTMLAttributes<HTMLTextAreaElement>,
) {
  return (
    <textarea
      {...props}
      className={`${inputClass} min-h-[88px] resize-y ${props.className ?? ""}`}
    />
  );
}

export function Select(
  props: React.SelectHTMLAttributes<HTMLSelectElement>,
) {
  return (
    <select {...props} className={`${inputClass} ${props.className ?? ""}`}>
      {props.children}
    </select>
  );
}

export function NumberStepper({
  value,
  onChange,
  step = 5,
  min = 0,
  max = 999,
  presets,
  unit,
}: {
  value: number;
  onChange: (v: number) => void;
  step?: number;
  min?: number;
  max?: number;
  presets?: number[];
  unit?: string;
}) {
  const clamp = (n: number) => Math.max(min, Math.min(max, n));
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onChange(clamp(value - step))}
          className="h-10 w-10 rounded-xl border border-surface-border text-lg font-bold text-ink-soft hover:bg-surface-muted"
        >
          −
        </button>
        <div className="flex h-10 min-w-[72px] items-center justify-center rounded-xl border border-surface-border px-3">
          <span className="tabular text-base font-semibold">{value}</span>
          {unit ? <span className="ml-1 text-xs text-ink-faint">{unit}</span> : null}
        </div>
        <button
          type="button"
          onClick={() => onChange(clamp(value + step))}
          className="h-10 w-10 rounded-xl border border-surface-border text-lg font-bold text-ink-soft hover:bg-surface-muted"
        >
          +
        </button>
      </div>
      {presets && presets.length ? (
        <div className="flex flex-wrap gap-1.5">
          {presets.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onChange(p)}
              className={`rounded-pill px-3 py-1 text-xs font-medium transition ${
                value === p
                  ? "bg-brand-600 text-white"
                  : "bg-surface-muted text-ink-soft hover:bg-brand-50"
              }`}
            >
              {p}
              {unit}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

/** カンマ / Enter で配列に追加するチップ入力 */
export function ChipInput({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (v: string[]) => void;
  placeholder?: string;
}) {
  const [draft, setDraft] = useState("");

  const add = () => {
    const t = draft.trim();
    if (t && !value.includes(t)) onChange([...value, t]);
    setDraft("");
  };

  return (
    <div className="rounded-xl border border-surface-border bg-white p-2">
      {value.length ? (
        <div className="mb-2 flex flex-wrap gap-1.5">
          {value.map((v) => (
            <span
              key={v}
              className="inline-flex items-center gap-1 rounded-pill bg-brand-50 px-2 py-0.5 text-xs font-medium text-brand-700"
            >
              {v}
              <button
                type="button"
                onClick={() => onChange(value.filter((x) => x !== v))}
                className="text-brand-400 hover:text-brand-700"
                aria-label="削除"
              >
                ×
              </button>
            </span>
          ))}
        </div>
      ) : null}
      <input
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === ",") {
            e.preventDefault();
            add();
          }
        }}
        onBlur={add}
        placeholder={placeholder ?? "入力して Enter で追加"}
        className="w-full bg-transparent px-1 py-1 text-sm text-ink outline-none"
      />
    </div>
  );
}
