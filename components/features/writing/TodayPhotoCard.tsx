"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import {
  getTodayScene,
  PHOTO_TIME_LIMIT_SEC,
  WRITE_PHOTO_PROMPT,
} from "@/lib/photoScenes";
import { todayISO } from "@/lib/det";

type Phase = "idle" | "viewing" | "done";

function fmt(sec: number): string {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

function wordCount(s: string): number {
  return s.trim() ? s.trim().split(/\s+/).length : 0;
}

export function TodayPhotoCard() {
  const { actions } = useData();
  const [data] = useState(() => getTodayScene(todayISO()));
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(PHOTO_TIME_LIMIT_SEC);
  const [answer, setAnswer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [saved, setSaved] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const save = () => {
    actions.addWritingLog({
      date: todayISO(),
      detTaskType: "write_about_photo",
      prompt: WRITE_PHOTO_PROMPT,
      draftText: answer.trim(),
      correctedVersion: null,
      grammarErrors: [],
      vocabErrors: [],
      newExpressions: [],
      wordCount: wordCount(answer),
      durationMinutes: 1,
      selfScore: null,
      note: data.scene.theme || null,
      photoImage: data.image,
      modelAnswer: data.scene.modelAnswer,
      modelAnswerJa: data.scene.modelAnswerJa,
      photoTips: data.scene.tips,
    });
    setSaved(true);
  };

  // 写真を先読みしておく（表示時に即出るように）
  useEffect(() => {
    const img = new Image();
    img.src = data.image;
  }, [data.image]);

  // カウントダウン
  useEffect(() => {
    if (phase !== "viewing") return;
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setPhase("done");
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [phase]);

  const start = () => {
    setSecondsLeft(PHOTO_TIME_LIMIT_SEC);
    setShowModel(false);
    setPhase("viewing");
  };

  const finishEarly = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setPhase("done");
  };

  const retry = () => {
    setAnswer("");
    setShowModel(false);
    setSaved(false);
    setPhase("idle");
    setSecondsLeft(PHOTO_TIME_LIMIT_SEC);
  };

  return (
    <Card>
      <CardBody className="flex flex-col gap-3">
        <SectionTitle
          action={
            phase === "viewing" ? (
              <span
                className={`tabular text-sm font-bold ${
                  secondsLeft <= 10 ? "text-danger" : "text-brand-600"
                }`}
              >
                ⏱ {fmt(secondsLeft)}
              </span>
            ) : null
          }
        >
          📷 Write About the Photo（本番：1分）
        </SectionTitle>

        {/* ===== idle ===== */}
        {phase === "idle" ? (
          <>
            <p className="rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
              {WRITE_PHOTO_PROMPT}
            </p>
            <p className="text-xs text-ink-soft">
              「写真を見る」を押すと写真が表示され、
              <b>{PHOTO_TIME_LIMIT_SEC}秒</b>
              で説明を書きます。時間が来ると<b>写真が消え、入力できなくなります</b>
              （DET本番と同じ1分）。
            </p>
            <Button fullWidth onClick={start}>
              ▶ 写真を見る（{PHOTO_TIME_LIMIT_SEC}秒）
            </Button>
          </>
        ) : null}

        {/* ===== viewing ===== */}
        {phase === "viewing" ? (
          <>
            <div className="h-1.5 w-full overflow-hidden rounded-pill bg-surface-muted">
              <div
                className="h-full rounded-pill bg-brand-500 transition-all duration-1000 ease-linear"
                style={{
                  width: `${(secondsLeft / PHOTO_TIME_LIMIT_SEC) * 100}%`,
                }}
              />
            </div>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.image}
              alt="写真"
              className="w-full rounded-xl border border-surface-border object-cover"
              style={{ maxHeight: 300 }}
            />
            <TextArea
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="写真を英語で説明しましょう…"
              className="min-h-[120px]"
              autoFocus
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-ink-faint">{wordCount(answer)} words</span>
              <Button variant="secondary" size="sm" onClick={finishEarly}>
                書き終えた（締切）
              </Button>
            </div>
          </>
        ) : null}

        {/* ===== done ===== */}
        {phase === "done" ? (
          <div className="flex flex-col gap-3">
            <div className="rounded-xl bg-surface-muted p-3 text-sm">
              <div className="mb-1 text-xs font-medium text-ink-faint">
                ⏱ 時間終了 — あなたの解答（{wordCount(answer)} words）
              </div>
              <p className="whitespace-pre-wrap text-ink">
                {answer.trim() || "（未入力）"}
              </p>
            </div>

            {!showModel ? (
              <Button fullWidth variant="success" onClick={() => setShowModel(true)}>
                模範解答を見る（比較）
              </Button>
            ) : (
              <div className="flex flex-col gap-3">
                <div className="rounded-xl border border-accent-200 bg-accent-50 p-3">
                  <div className="mb-1 text-xs font-semibold text-accent-700">
                    ⭐ 模範解答（DET 110 レベル）
                  </div>
                  <p className="text-sm leading-7 text-ink">
                    {data.scene.modelAnswer}
                  </p>
                  <div className="mt-2 border-t border-accent-200 pt-2 text-xs leading-6 text-ink-soft">
                    {data.scene.modelAnswerJa}
                  </div>
                </div>
                <div className="rounded-xl border border-surface-border p-3">
                  <div className="mb-2 text-xs font-semibold text-ink-soft">
                    💡 使える表現 Tips
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {data.scene.tips.map((t, i) => (
                      <li key={i} className="flex items-baseline gap-2 text-sm">
                        <Tag tone="blue">{t.term}</Tag>
                        <span className="text-ink-soft">{t.ja}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <Button variant="secondary" fullWidth onClick={retry}>
                もう一度
              </Button>
              <Button
                fullWidth
                variant={saved ? "ghost" : "primary"}
                onClick={save}
                disabled={saved}
              >
                {saved ? "✓ 復習に保存しました" : "復習に保存（写真つき）"}
              </Button>
            </div>
            {saved ? (
              <p className="text-center text-xs text-ink-faint">
                下の一覧と復習で見返せます
              </p>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
