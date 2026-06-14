"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, NumberStepper, TextArea, TextInput } from "@/components/ui/Field";
import { DEFAULT_DEADLINE, DEFAULT_TARGET } from "@/lib/det";
import {
  applyBackup,
  downloadBackup,
  readBackupFile,
  type BackupFile,
} from "@/lib/backup";

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

  // ---- バックアップ / 復元 ----
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exportMsg, setExportMsg] = useState<string | null>(null);
  const [pendingImport, setPendingImport] = useState<BackupFile | null>(null);
  const [importError, setImportError] = useState<string | null>(null);

  const handleExport = () => {
    try {
      const { keys, fileName } = downloadBackup();
      setExportMsg(`${keys} 件のデータを ${fileName} に書き出しました ✓`);
    } catch {
      setExportMsg("書き出しに失敗しました。");
    }
  };

  const handlePickFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError(null);
    setPendingImport(null);
    const f = e.target.files?.[0];
    e.target.value = ""; // 同じファイルを選び直せるようにリセット
    if (!f) return;
    try {
      const parsed = await readBackupFile(f);
      setPendingImport(parsed);
    } catch (err) {
      setImportError(err instanceof Error ? err.message : "読み込みに失敗しました。");
    }
  };

  const confirmImport = () => {
    if (!pendingImport) return;
    applyBackup(pendingImport);
    // 再読込で DataContext を作り直し、復元データを反映
    window.location.reload();
  };

  const importCount = pendingImport ? Object.keys(pendingImport.data).length : 0;

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
        <CardBody className="flex flex-col gap-3">
          <SectionTitle>💾 バックアップ・端末間の引っ越し</SectionTitle>
          <p className="text-xs text-ink-soft">
            学習データはこのブラウザ（ドメインごと）に保存されます。別の端末・ブラウザ・URL
            で同じデータを使うには、ここで<b>書き出し</b>たファイルを、移行先で
            <b>読み込み</b>ます。日々のバックアップにも使えます。
          </p>

          <div className="flex flex-col gap-1">
            <Button variant="secondary" fullWidth onClick={handleExport}>
              ⬇️ データを書き出す（バックアップ）
            </Button>
            {exportMsg ? (
              <p className="text-xs text-accent-700">{exportMsg}</p>
            ) : null}
          </div>

          <div className="flex flex-col gap-1">
            <input
              ref={fileInputRef}
              type="file"
              accept="application/json,.json"
              className="hidden"
              onChange={handlePickFile}
            />
            <Button
              variant="secondary"
              fullWidth
              onClick={() => fileInputRef.current?.click()}
            >
              ⬆️ ファイルから読み込む（復元）
            </Button>
            {importError ? (
              <p className="text-xs text-danger">{importError}</p>
            ) : null}
          </div>

          {pendingImport ? (
            <div className="flex flex-col gap-2 rounded-xl border border-brand-200 bg-brand-50 p-3">
              <p className="text-xs text-brand-700">
                このファイルには <b>{importCount} 件</b> のデータがあります
                {pendingImport.exportedAt
                  ? `（書き出し日時: ${pendingImport.exportedAt.slice(0, 16).replace("T", " ")}）`
                  : ""}
                。
                <br />
                読み込むと<b>この端末の現在のデータは上書き</b>され、ファイルの内容に置き換わります。
              </p>
              <div className="flex gap-2">
                <Button variant="primary" fullWidth onClick={confirmImport}>
                  このデータで復元する
                </Button>
                <Button variant="ghost" onClick={() => setPendingImport(null)}>
                  やめる
                </Button>
              </div>
            </div>
          ) : null}
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
        データはこの端末のブラウザ（localStorage）に保存されます。端末をまたぐときは上の
        「バックアップ・端末間の引っ越し」を使ってください。
      </p>
    </div>
  );
}
