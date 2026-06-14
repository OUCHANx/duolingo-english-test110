"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, NumberStepper, TextArea, TextInput } from "@/components/ui/Field";
import { DEFAULT_DEADLINE, DEFAULT_TARGET } from "@/lib/det";

export default function SettingsPage() {
  const router = useRouter();
  const { ready, goal, today, actions } = useData();

  const [target, setTarget] = useState(DEFAULT_TARGET);
  const [deadline, setDeadline] = useState(DEFAULT_DEADLINE);
  const [startedAt, setStartedAt] = useState(today);
  const [weekly, setWeekly] = useState(300);
  const [note, setNote] = useState("");
  const [confirmReset, setConfirmReset] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (goal) {
      setTarget(goal.targetOverall);
      setDeadline(goal.deadline);
      setStartedAt(goal.startedAt);
      setWeekly(goal.weeklyStudyMinutesTarget);
      setNote(goal.note ?? "");
    } else {
      setStartedAt(today);
    }
  }, [goal, today]);

  if (!ready) return <Loading />;

  const save = () => {
    actions.saveGoal({
      targetOverall: target,
      deadline,
      startedAt,
      weeklyStudyMinutesTarget: weekly,
      isActive: true,
      note: note.trim() || null,
    });
    setSaved(true);
    setTimeout(() => router.push("/"), 600);
  };

  return (
    <div className="flex flex-col gap-4">
      <PageHeader title="目標・設定" subtitle="DET 110 達成プランの基本設定" />

      <Card>
        <CardBody className="flex flex-col gap-4">
          <SectionTitle>🎯 目標</SectionTitle>

          <Field label="目標スコア（Overall）" required>
            <NumberStepper
              value={target}
              onChange={setTarget}
              step={5}
              min={10}
              max={160}
              presets={[100, 105, 110, 120]}
            />
          </Field>

          <div className="grid grid-cols-2 gap-3">
            <Field label="目標期限" required>
              <TextInput
                type="date"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
              />
            </Field>
            <Field label="学習開始日">
              <TextInput
                type="date"
                value={startedAt}
                onChange={(e) => setStartedAt(e.target.value)}
              />
            </Field>
          </div>

          <Field label="週あたりの学習目標">
            <NumberStepper
              value={weekly}
              onChange={setWeekly}
              step={30}
              min={60}
              max={1200}
              presets={[180, 300, 420, 600]}
              unit="分"
            />
          </Field>

          <Field label="メモ">
            <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
          </Field>

          <Button fullWidth onClick={save}>
            {saved ? "保存しました ✓" : "保存する"}
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-2">
          <SectionTitle>📊 現在スコア</SectionTitle>
          <p className="text-sm text-ink-soft">
            模試・テストのスコアは「スコア進捗」から記録します。
          </p>
          <Button variant="secondary" onClick={() => router.push("/progress")}>
            スコア進捗へ
          </Button>
        </CardBody>
      </Card>

      <Card>
        <CardBody className="flex flex-col gap-2">
          <SectionTitle>⚠️ データ管理</SectionTitle>
          <p className="text-xs text-ink-soft">
            すべての学習データを削除し、初期サンプル問題に戻します（取り消せません）。
          </p>
          {confirmReset ? (
            <div className="flex gap-2">
              <Button
                variant="danger"
                fullWidth
                onClick={() => {
                  actions.resetAllData();
                  setConfirmReset(false);
                }}
              >
                本当に削除する
              </Button>
              <Button variant="ghost" onClick={() => setConfirmReset(false)}>
                やめる
              </Button>
            </div>
          ) : (
            <Button variant="ghost" onClick={() => setConfirmReset(true)}>
              すべてのデータをリセット
            </Button>
          )}
        </CardBody>
      </Card>

      <p className="px-2 text-center text-xs text-ink-faint">
        データはこの端末のブラウザ（localStorage）に保存されます。
      </p>
    </div>
  );
}
