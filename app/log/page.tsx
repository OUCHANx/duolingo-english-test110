"use client";

import { useEffect, useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Button, LinkButton } from "@/components/ui/Button";
import { Field, NumberStepper, TextArea, TextInput } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import {
  LOG_CATEGORIES,
  LOG_CATEGORY_LABELS,
  formatDateShort,
} from "@/lib/det";
import type { LogCategory } from "@/lib/types";

interface TimelineEntry {
  id: string;
  date: string;
  label: string;
  minutes: number | null;
  detail: string | null;
  tone: "blue" | "green" | "amber" | "gray";
  deletable: boolean;
}

export default function LogPage() {
  const {
    ready,
    today,
    studySessions,
    speakingLogs,
    writingLogs,
    mockScores,
    dailyLogs,
    actions,
  } = useData();

  const [category, setCategory] = useState<LogCategory>("reading");
  const [minutes, setMinutes] = useState(30);
  const [date, setDate] = useState(today);
  const [note, setNote] = useState("");

  const todayLog = dailyLogs.find((d) => d.date === today);
  const [reflection, setReflection] = useState("");
  const [tomorrow, setTomorrow] = useState("");

  useEffect(() => {
    setReflection(todayLog?.reflection ?? "");
    setTomorrow(todayLog?.tomorrow ?? "");
  }, [todayLog]);

  const timeline = useMemo<TimelineEntry[]>(() => {
    const entries: TimelineEntry[] = [];
    for (const s of studySessions) {
      entries.push({
        id: s.id,
        date: s.date,
        label:
          LOG_CATEGORY_LABELS[s.category] + (s.isManual ? "" : " 演習"),
        minutes: s.durationMinutes,
        detail:
          s.accuracy != null ? `正答率 ${Math.round(s.accuracy * 100)}%` : s.note,
        tone: s.category === "listening" ? "green" : "blue",
        deletable: s.isManual,
      });
    }
    for (const l of speakingLogs) {
      entries.push({
        id: l.id,
        date: l.date,
        label: "Cambly",
        minutes: l.durationMinutes,
        detail: l.topics.join(", ") || null,
        tone: "amber",
        deletable: false,
      });
    }
    for (const w of writingLogs) {
      entries.push({
        id: w.id,
        date: w.date,
        label: "Writing",
        minutes: w.durationMinutes,
        detail: `${w.wordCount} words`,
        tone: "green",
        deletable: false,
      });
    }
    for (const m of mockScores) {
      entries.push({
        id: m.id,
        date: m.date,
        label: "Mock Test",
        minutes: null,
        detail: `Overall ${m.overall}`,
        tone: "gray",
        deletable: false,
      });
    }
    return entries.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, [studySessions, speakingLogs, writingLogs, mockScores]);

  if (!ready) return <Loading />;

  const saveTime = () => {
    actions.addManualSession({
      date,
      category,
      durationMinutes: minutes,
      note: note.trim() || null,
    });
    setNote("");
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="学習ログ" subtitle="毎日の学習時間と振り返りを記録" />

      {/* クイック時間記録 */}
      <Card>
        <CardBody className="flex flex-col gap-3">
          <SectionTitle>⏱️ 学習時間を記録</SectionTitle>
          <div className="flex flex-wrap gap-1.5">
            {LOG_CATEGORIES.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={`rounded-pill px-3 py-1.5 text-xs font-medium transition ${
                  category === c
                    ? "bg-brand-600 text-white"
                    : "bg-surface-muted text-ink-soft hover:bg-brand-50"
                }`}
              >
                {LOG_CATEGORY_LABELS[c]}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="時間">
              <NumberStepper
                value={minutes}
                onChange={setMinutes}
                step={5}
                min={5}
                max={300}
                presets={[15, 30, 60]}
                unit="分"
              />
            </Field>
            <Field label="日付">
              <TextInput
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </Field>
          </div>
          <Field label="完了したタスク・メモ">
            <TextInput
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="例: 単語帳 Unit 5"
            />
          </Field>
          <Button onClick={saveTime}>この時間を記録</Button>
          <div className="flex gap-2">
            <LinkButton href="/speaking/new" variant="secondary" size="sm" fullWidth>
              🗣️ Cambly を記録
            </LinkButton>
            <LinkButton href="/writing/new" variant="secondary" size="sm" fullWidth>
              ✍️ Writing を記録
            </LinkButton>
          </div>
        </CardBody>
      </Card>

      {/* 今日のメモ */}
      <Card>
        <CardBody className="flex flex-col gap-3">
          <SectionTitle>📝 今日の振り返り（{formatDateShort(today)}）</SectionTitle>
          <Field label="今日の反省">
            <TextArea
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              placeholder="うまくいったこと / 課題"
            />
          </Field>
          <Field label="明日やること">
            <TextArea
              value={tomorrow}
              onChange={(e) => setTomorrow(e.target.value)}
            />
          </Field>
          <Button
            variant="secondary"
            onClick={() =>
              actions.saveDailyNote(today, {
                reflection: reflection.trim() || null,
                tomorrow: tomorrow.trim() || null,
              })
            }
          >
            メモを保存
          </Button>
        </CardBody>
      </Card>

      {/* タイムライン */}
      <div>
        <h2 className="mb-2 text-sm font-semibold text-ink-soft">学習の記録</h2>
        {timeline.length === 0 ? (
          <p className="rounded-card border border-dashed border-surface-border bg-white py-8 text-center text-sm text-ink-faint">
            まだ記録がありません。演習や時間記録をすると、ここに並びます。
          </p>
        ) : (
          <div className="flex flex-col gap-2">
            {timeline.map((e) => (
              <Card key={e.id}>
                <CardBody className="flex items-center gap-3 py-3">
                  <div className="w-14 shrink-0 text-xs font-medium text-ink-faint">
                    {formatDateShort(e.date)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <Tag tone={e.tone}>{e.label}</Tag>
                      {e.minutes != null ? (
                        <span className="text-xs text-ink-soft">
                          {e.minutes}分
                        </span>
                      ) : null}
                    </div>
                    {e.detail ? (
                      <div className="mt-0.5 truncate text-xs text-ink-faint">
                        {e.detail}
                      </div>
                    ) : null}
                  </div>
                  {e.deletable ? (
                    <button
                      type="button"
                      onClick={() => actions.deleteSession(e.id)}
                      className="text-xs text-ink-faint hover:text-danger"
                    >
                      削除
                    </button>
                  ) : null}
                </CardBody>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
