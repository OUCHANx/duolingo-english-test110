"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useData } from "@/context/DataContext";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import {
  ChipInput,
  Field,
  NumberStepper,
  Select,
  TextArea,
  TextInput,
} from "@/components/ui/Field";
import { SelfScore } from "./SelfScore";
import type { WritingLog } from "@/lib/types";

const TASK_OPTIONS: { value: WritingLog["detTaskType"]; label: string }[] = [
  { value: "write_about_photo", label: "Write About the Photo" },
  { value: "read_then_write", label: "Read, Then Write" },
  { value: "writing_sample", label: "Writing Sample / その他" },
];

function countWords(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

export function WritingRecordForm() {
  const router = useRouter();
  const { today, actions } = useData();

  const [date, setDate] = useState(today);
  const [detTaskType, setTaskType] =
    useState<WritingLog["detTaskType"]>("write_about_photo");
  const [prompt, setPrompt] = useState("");
  const [draftText, setDraft] = useState("");
  const [correctedVersion, setCorrected] = useState("");
  const [grammarErrors, setGrammar] = useState<string[]>([]);
  const [vocabErrors, setVocab] = useState<string[]>([]);
  const [newExpressions, setNewExpr] = useState<string[]>([]);
  const [durationMinutes, setDuration] = useState(20);
  const [selfScore, setSelfScore] = useState<number | null>(null);
  const [note, setNote] = useState("");

  const save = () => {
    actions.addWritingLog({
      date,
      detTaskType,
      prompt: prompt.trim(),
      draftText: draftText.trim(),
      correctedVersion: correctedVersion.trim() || null,
      grammarErrors,
      vocabErrors,
      newExpressions,
      wordCount: countWords(draftText),
      durationMinutes,
      selfScore: (selfScore as 1 | 2 | 3 | 4 | 5 | null) ?? null,
      note: note.trim() || null,
    });
    router.push("/writing");
  };

  return (
    <Card>
      <CardBody className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <Field label="日付" required>
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="問題タイプ" required>
            <Select
              value={detTaskType}
              onChange={(e) =>
                setTaskType(e.target.value as WritingLog["detTaskType"])
              }
            >
              {TASK_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>
                  {o.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>

        <Field label="お題 / プロンプト">
          <TextArea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="例: Describe the photo and explain..."
          />
        </Field>

        <Field label="自分の回答" hint={`${countWords(draftText)} words`}>
          <TextArea
            value={draftText}
            onChange={(e) => setDraft(e.target.value)}
            className="min-h-[120px]"
          />
        </Field>

        <Field label="ChatGPTによる修正版">
          <TextArea
            value={correctedVersion}
            onChange={(e) => setCorrected(e.target.value)}
            className="min-h-[120px]"
          />
        </Field>

        <Field label="文法ミス" hint="復習リストに自動追加されます">
          <ChipInput value={grammarErrors} onChange={setGrammar} />
        </Field>

        <Field label="語彙ミス">
          <ChipInput value={vocabErrors} onChange={setVocab} />
        </Field>

        <Field label="新しく覚えた表現" hint="復習リストに自動追加されます">
          <ChipInput value={newExpressions} onChange={setNewExpr} />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          <Field label="所要時間">
            <NumberStepper
              value={durationMinutes}
              onChange={setDuration}
              step={5}
              min={5}
              max={120}
              presets={[10, 20, 30]}
              unit="分"
            />
          </Field>
          <Field label="自己評価（1〜5）">
            <SelfScore value={selfScore} onChange={setSelfScore} />
          </Field>
        </div>

        <Field label="メモ">
          <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        <Button fullWidth onClick={save}>
          保存する
        </Button>
      </CardBody>
    </Card>
  );
}
