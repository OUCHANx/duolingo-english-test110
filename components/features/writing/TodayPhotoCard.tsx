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
  const [gptHelp, setGptHelp] = useState(false);
  const [promptCopied, setPromptCopied] = useState(false);
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
    setGptHelp(false);
    setPromptCopied(false);
    setPhase("idle");
    setSecondsLeft(PHOTO_TIME_LIMIT_SEC);
  };

  // ChatGPT 採点用プロンプト（DET 110 を目指す人向けの丁寧な指示）
  const buildGradingPrompt = (): string =>
    `あなたは Duolingo English Test (DET) の採点官 兼 英語コーチです。
これは「Write About the Photo」（写真を見て1分以内に英語で描写する）課題の、私の回答です。
このあと写真を添付（または貼り付け）するので、写真の内容も必ず踏まえて採点してください。

# 私の回答
${answer.trim() || "(未入力)"}

# お願い（日本語で、この順番で答えてください）
1. 推定スコアと講評：DETの観点（文法の正確さ／語彙の幅／写真描写の具体性と量／文の構成）で推定点とその理由を述べてください。「おそらく〇〇点です」だけで終わらせないでください。
2. もっと良くなる言い換え：私が書いた文に即して「ここはこう書くともっと良い」という具体的な改善案を before → after の形で3〜5個。
3. すぐ使える表現集：中学・高校で習うレベルの、一般的ですぐ自分でも使えるようになる単語・フレーズ・言い換えを5〜8個、英語＋日本語の意味つきでまとめてください（難しすぎる単語は避ける）。
4. 次の一歩：次に意識すると伸びるポイントを1〜2行で。`;

  const gradeWithChatGPT = async () => {
    let copied = false;
    try {
      await navigator.clipboard.writeText(buildGradingPrompt());
      copied = true;
    } catch {
      copied = false;
    }
    setPromptCopied(copied);
    setGptHelp(true);
    // 新規チャットを開く（?q= だと自動送信されてしまい、写真を添付する前に送られるため使わない）
    window.open("https://chatgpt.com/", "_blank", "noopener,noreferrer");
  };

  const copyPromptAgain = async () => {
    try {
      await navigator.clipboard.writeText(buildGradingPrompt());
      setPromptCopied(true);
    } catch {
      setPromptCopied(false);
    }
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
            {/* 答え合わせ用に写真を再表示（本番は時間終了で消えるが、振り返りでは見比べたい） */}
            <div className="flex flex-col gap-1">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={data.image}
                alt="写真"
                className="w-full rounded-xl border border-surface-border object-cover"
                style={{ maxHeight: 300 }}
              />
              <span className="text-xs text-ink-faint">
                📷 答え合わせ用に写真を再表示しています
              </span>
            </div>

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

            {/* ChatGPT で採点してもらう */}
            <Button
              fullWidth
              variant="secondary"
              onClick={gradeWithChatGPT}
              className="!bg-[#10a37f] !text-white hover:!bg-[#0e8e6e]"
            >
              🤖 ChatGPT に採点してもらう
            </Button>

            {gptHelp ? (
              <div className="flex flex-col gap-2 rounded-xl border border-surface-border bg-surface-muted p-3 text-sm">
                <div className="font-semibold text-ink">
                  ChatGPT を開きました。次の手順で採点してもらえます👇
                </div>
                <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-ink-soft">
                  <li>
                    ChatGPT の入力欄をクリックして <b>⌘V（貼り付け）</b>
                    {promptCopied ? (
                      <>
                        {" "}
                        — 採点用プロンプトと<b>あなたの回答</b>はコピー済みです
                      </>
                    ) : (
                      <>
                        {" "}
                        — まず下の「プロンプトをコピー」を押してください
                      </>
                    )}
                  </li>
                  <li>
                    <b>上の写真を右クリック →「画像をコピー」</b> →
                    ChatGPT の入力欄で <b>⌘V</b> して写真を添付
                  </li>
                  <li>そのまま送信すれば、点数＋言い換え＋使える表現が返ってきます</li>
                </ol>
                <button
                  type="button"
                  onClick={copyPromptAgain}
                  className="self-start rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-surface-muted"
                >
                  {promptCopied ? "✓ コピーしました（もう一度コピー）" : "プロンプトをコピー"}
                </button>
                <p className="text-xs text-ink-faint">
                  ※ ブラウザの仕様で写真の自動添付はできないため、写真だけ「コピー→貼り付け」が必要です。先にプロンプトを貼り付けてから写真をコピーしてください。
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
