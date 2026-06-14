"use client";

import { useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Field, NumberStepper, Select, TextArea, TextInput } from "@/components/ui/Field";
import { SUBSCORES, SUBSCORE_LABELS } from "@/lib/det";
import type { MockScore, SubScore } from "@/lib/types";

export function MockScoreForm() {
  const { today, actions } = useData();
  const [open, setOpen] = useState(false);
  const [date, setDate] = useState(today);
  const [kind, setKind] = useState<MockScore["kind"]>("practice_test");
  const [overall, setOverall] = useState(90);
  const [subs, setSubs] = useState<Record<SubScore, number>>({
    literacy: 90,
    comprehension: 90,
    conversation: 90,
    production: 90,
  });
  const [note, setNote] = useState("");

  const save = () => {
    actions.addMockScore({
      date,
      kind,
      overall,
      subScores: subs,
      source: null,
      note: note.trim() || null,
    });
    setOpen(false);
    setNote("");
  };

  if (!open) {
    return (
      <Button fullWidth onClick={() => setOpen(true)}>
        + スコアを記録する
      </Button>
    );
  }

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <SectionTitle>スコアを記録</SectionTitle>
        <div className="grid grid-cols-2 gap-3">
          <Field label="日付" required>
            <TextInput
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Field>
          <Field label="種別">
            <Select
              value={kind}
              onChange={(e) => setKind(e.target.value as MockScore["kind"])}
            >
              <option value="practice_test">Practice Test</option>
              <option value="official">公式テスト</option>
              <option value="self_estimate">自己推定</option>
            </Select>
          </Field>
        </div>

        <Field label="Overall score" required>
          <NumberStepper
            value={overall}
            onChange={setOverall}
            step={5}
            min={10}
            max={160}
          />
        </Field>

        <div className="grid grid-cols-2 gap-3">
          {SUBSCORES.map((s) => (
            <Field key={s} label={SUBSCORE_LABELS[s]}>
              <NumberStepper
                value={subs[s]}
                onChange={(v) => setSubs((prev) => ({ ...prev, [s]: v }))}
                step={5}
                min={10}
                max={160}
              />
            </Field>
          ))}
        </div>

        <Field label="メモ">
          <TextArea value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>

        <div className="flex gap-2">
          <Button fullWidth onClick={save}>
            保存
          </Button>
          <Button variant="ghost" onClick={() => setOpen(false)}>
            キャンセル
          </Button>
        </div>
      </CardBody>
    </Card>
  );
}
