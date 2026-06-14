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
  TextArea,
  TextInput,
} from "@/components/ui/Field";
import { SelfScore } from "./SelfScore";

export function CamblySessionForm() {
  const router = useRouter();
  const { today, actions } = useData();

  const [date, setDate] = useState(today);
  const [tutorName, setTutorName] = useState("");
  const [durationMinutes, setDuration] = useState(60);
  const [topics, setTopics] = useState<string[]>([]);
  const [stuckQuestions, setStuck] = useState<string[]>([]);
  const [correctedExpressions, setCorrected] = useState<string[]>([]);
  const [pronunciationNotes, setPronunciation] = useState<string[]>([]);
  const [selfScore, setSelfScore] = useState<number | null>(null);
  const [nextImprovement, setNext] = useState("");
  const [note, setNote] = useState("");

  const save = () => {
    actions.addSpeakingLog({
      date,
      tutorName: tutorName.trim() || null,
      durationMinutes,
      topics,
      detTaskFocus: [],
      stuckQuestions,
      correctedExpressions,
      pronunciationNotes,
      selfScore: (selfScore as 1 | 2 | 3 | 4 | 5 | null) ?? null,
      nextImprovement: nextImprovement.trim() || null,
      note: note.trim() || null,
    });
    router.push("/speaking");
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
          <Field label="講師名">
            <TextInput
              value={tutorName}
              onChange={(e) => setTutorName(e.target.value)}
              placeholder="任意"
            />
          </Field>
        </div>

        <Field label="レッスン時間" required>
          <NumberStepper
            value={durationMinutes}
            onChange={setDuration}
            step={5}
            min={5}
            max={180}
            presets={[15, 30, 60]}
            unit="分"
          />
        </Field>

        <Field label="練習したテーマ" hint="Enter/カンマで追加">
          <ChipInput value={topics} onChange={setTopics} placeholder="例: 自己紹介, 環境問題" />
        </Field>

        <Field label="詰まった質問・話題">
          <ChipInput value={stuckQuestions} onChange={setStuck} />
        </Field>

        <Field label="先生に直された表現" hint="復習リストに自動追加されます">
          <ChipInput value={correctedExpressions} onChange={setCorrected} />
        </Field>

        <Field label="発音で指摘された単語">
          <ChipInput value={pronunciationNotes} onChange={setPronunciation} />
        </Field>

        <Field label="自己評価（1〜5）">
          <SelfScore value={selfScore} onChange={setSelfScore} />
        </Field>

        <Field label="次回改善すること">
          <TextArea
            value={nextImprovement}
            onChange={(e) => setNext(e.target.value)}
            placeholder="例: 過去形の使い分けを意識する"
          />
        </Field>

        <Field label="メモ">
          <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        <div className="flex gap-2">
          <Button fullWidth onClick={save}>
            保存する
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
