"use client";

import { useEffect, useRef, useState } from "react";
import type {
  GradeOutput,
  ListenTypePayload,
  ListeningQuestion,
} from "@/lib/types";
import { gradeListenType } from "@/lib/graders";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import {
  isSpeechAvailable,
  loadSpeechSettings,
  loadVoices,
  pickVoice,
  saveSpeechSettings,
  speak,
} from "@/lib/speech";

export function ListenAndType({
  question,
  onGraded,
}: {
  question: ListeningQuestion;
  onGraded: (g: GradeOutput, ua: string) => void;
}) {
  const payload = (question.payload ?? {}) as ListenTypePayload;
  const maxReplays = payload.maxReplays ?? 3;
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [replays, setReplays] = useState(0);
  const [input, setInput] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [grade, setGrade] = useState<GradeOutput | null>(null);

  // 音声設定（声は Google US English を最優先で自動選択。速さのみ調整可）
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [rate, setRate] = useState(0.9);

  const ttsAvailable = isSpeechAvailable();

  useEffect(() => {
    setRate(loadSpeechSettings().rate);
    loadVoices().then(setVoices);
  }, []);

  const activeVoice = pickVoice(voices);

  const play = () => {
    if (replays >= maxReplays && !submitted) return;
    if (question.audioUrl) {
      if (!audioRef.current) audioRef.current = new Audio(question.audioUrl);
      audioRef.current.currentTime = 0;
      audioRef.current.volume = 1;
      void audioRef.current.play();
    } else if (ttsAvailable) {
      void speak(question.transcript, { rate });
    }
    if (!submitted) setReplays((r) => r + 1);
  };

  const changeRate = (r: number) => {
    setRate(r);
    saveSpeechSettings({ voiceURI: null, rate: r });
  };

  const submit = () => {
    const g = gradeListenType(question.transcript, { input, replays });
    setGrade(g);
    setSubmitted(true);
    onGraded(g, input);
  };

  const remaining = Math.max(0, maxReplays - replays);
  const usingTts = !question.audioUrl && ttsAvailable;

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-ink-soft">
        音声を聞いて、聞こえた英文をそのまま入力してください。
      </p>

      <div className="flex flex-col items-center gap-2 rounded-xl border border-surface-border bg-surface-muted p-5">
        <button
          type="button"
          onClick={play}
          disabled={!submitted && remaining === 0}
          className="flex h-16 w-16 items-center justify-center rounded-full bg-brand-600 text-2xl text-white shadow-float transition hover:bg-brand-700 disabled:opacity-40"
          aria-label="再生"
        >
          ▶
        </button>
        <span className="text-xs text-ink-faint">
          {submitted ? "もう一度聞いて確認できます" : `残り再生 ${remaining} 回`}
        </span>

        {/* 速度の調整（声は Google US English を自動使用）*/}
        {usingTts ? (
          <div className="mt-2 flex w-full flex-col items-center gap-2">
            {activeVoice ? (
              <span className="text-[11px] text-ink-faint">
                声: {activeVoice.name}
              </span>
            ) : null}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-ink-faint">速さ</span>
              {[
                { label: "ゆっくり", v: 0.7 },
                { label: "ふつう", v: 0.9 },
                { label: "速め", v: 1.05 },
              ].map((o) => (
                <button
                  key={o.v}
                  type="button"
                  onClick={() => changeRate(o.v)}
                  className={`rounded-pill px-2.5 py-1 font-medium transition ${
                    Math.abs(rate - o.v) < 0.01
                      ? "bg-brand-600 text-white"
                      : "bg-white text-ink-soft hover:bg-brand-50"
                  }`}
                >
                  {o.label}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {!question.audioUrl && !ttsAvailable ? (
          <span className="text-xs text-danger">
            この環境では音声読み上げが使えません
          </span>
        ) : null}
      </div>

      {!submitted ? (
        <>
          <TextArea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="聞こえた英文を入力…"
            autoCapitalize="off"
            spellCheck={false}
          />
          <Button fullWidth onClick={submit} disabled={!input.trim()}>
            答え合わせ
          </Button>
        </>
      ) : (
        <div className="flex flex-col gap-3">
          <div>
            <div className="mb-1 text-xs font-medium text-ink-faint">
              正解との比較
            </div>
            <div className="rounded-xl border border-surface-border bg-white p-3 text-[15px] leading-8">
              {grade?.diff?.map((d, i) => {
                if (d.op === "match")
                  return (
                    <span key={i} className="text-ink">
                      {d.ref}{" "}
                    </span>
                  );
                if (d.op === "del")
                  return (
                    <span
                      key={i}
                      className="rounded bg-red-50 px-0.5 text-red-700 line-through"
                    >
                      {d.ref}{" "}
                    </span>
                  );
                if (d.op === "ins")
                  return (
                    <span key={i} className="rounded bg-amber-50 px-0.5 text-amber-700">
                      (+{d.hyp}){" "}
                    </span>
                  );
                return (
                  <span key={i} className="rounded bg-red-50 px-0.5 text-red-700">
                    {d.ref}
                    <span className="text-ink-faint">[{d.hyp}]</span>{" "}
                  </span>
                );
              })}
            </div>
          </div>
          <div className="rounded-xl bg-surface-muted p-3 text-sm text-ink-soft">
            <span className="text-xs text-ink-faint">あなたの入力：</span>
            <br />
            {input}
          </div>
          <p className="text-xs text-ink-faint">
            赤[ ]=取り違え / 赤打消し=聞き落とし / 黄=余分。聞き取れなかった語は復習リストに追加されました。
          </p>
        </div>
      )}
    </div>
  );
}
