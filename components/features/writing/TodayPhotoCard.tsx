"use client";

import { useEffect, useRef, useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { TextArea } from "@/components/ui/Field";
import { Tag } from "@/components/ui/Tag";
import { PHOTO_TIME_LIMIT_SEC } from "@/lib/photoScenes";
import {
  fetchDailyPhoto,
  getFreeDailyPhoto,
  type DailyPhoto,
} from "@/lib/dailyPhoto";
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
  const [photo, setPhoto] = useState<DailyPhoto | null>(null);
  const [phase, setPhase] = useState<Phase>("idle");
  const [secondsLeft, setSecondsLeft] = useState(PHOTO_TIME_LIMIT_SEC);
  const [answer, setAnswer] = useState("");
  const [showModel, setShowModel] = useState(false);
  const [saved, setSaved] = useState(false);
  const [gptHelp, setGptHelp] = useState(false);
  const [photoCopied, setPhotoCopied] = useState<boolean | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const save = () => {
    if (!photo) return;
    actions.addWritingLog({
      date: todayISO(),
      detTaskType: "write_about_photo",
      prompt: photo.prompt,
      draftText: answer.trim(),
      correctedVersion: null,
      grammarErrors: [],
      vocabErrors: [],
      newExpressions: [],
      wordCount: wordCount(answer),
      durationMinutes: 1,
      selfScore: null,
      note: photo.theme || null,
      photoImage: photo.image,
      modelAnswer: photo.modelAnswer,
      modelAnswerJa: photo.modelAnswerJa,
      photoTips: photo.tips,
    });
    setSaved(true);
  };

  // 今日のお題（写真・模範解答・Tips）を取得。無ければ無料写真にフォールバック。
  useEffect(() => {
    let alive = true;
    fetchDailyPhoto().then((d) => {
      if (alive) setPhoto(d ?? getFreeDailyPhoto(todayISO()));
    });
    return () => {
      alive = false;
    };
  }, []);

  // 写真を先読みしておく（表示時に即出るように）
  useEffect(() => {
    if (!photo?.image) return;
    const img = new Image();
    img.src = photo.image;
  }, [photo?.image]);

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
    setPhotoCopied(null);
    setPhase("idle");
    setSecondsLeft(PHOTO_TIME_LIMIT_SEC);
  };

  // ChatGPT 採点用プロンプト（DET 110 向け。?q= でURLに載せるため簡潔に）
  const buildGradingPrompt = (): string =>
    `DETの「Write About the Photo」（写真を1分で英語描写する課題）の採点をお願いします。貼り付ける写真と私の回答を見て、日本語で次の順に答えてください。

私の回答：「${answer.trim() || "(未入力)"}」

1. 推定スコアと理由（文法の正確さ／語彙／写真描写の具体性と量／構成の観点。「おそらく〇〇点」だけで終わらせない）
2. before → after の言い換え改善を3〜5個（私の文に即して）
3. 中学・高校レベルで一般的・すぐ使える単語や言い換えを5〜8個（英語＋日本語訳、難しすぎる語は避ける）
4. 次に意識すると伸びるポイントを1〜2行
※まだ写真が届いていなければ、写真を受け取ってから採点を始めてください。`;

  // 写真を PNG にしてクリップボードへ。ユーザー操作中にwriteを呼ぶため Promise 形式で渡す。
  const copyPhotoToClipboard = async (): Promise<boolean> => {
    if (!photo?.image) return false;
    const imageUrl = photo.image;
    try {
      const pngPromise = (async (): Promise<Blob> => {
        const res = await fetch(imageUrl, { mode: "cors" });
        const blob = await res.blob();
        const bmp = await createImageBitmap(blob);
        const canvas = document.createElement("canvas");
        canvas.width = bmp.width;
        canvas.height = bmp.height;
        const ctx = canvas.getContext("2d");
        if (!ctx) throw new Error("no ctx");
        ctx.drawImage(bmp, 0, 0);
        const png = await new Promise<Blob | null>((r) =>
          canvas.toBlob(r, "image/png"),
        );
        if (!png) throw new Error("toBlob failed");
        return png;
      })();
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": pngPromise }),
      ]);
      return true;
    } catch {
      return false;
    }
  };

  const gradeWithChatGPT = async () => {
    setGptHelp(true);
    // 写真をクリップボードへ自動コピー（ユーザー操作直後に実行）
    const ok = await copyPhotoToClipboard();
    setPhotoCopied(ok);
    // プロンプトを入力欄に載せた状態で ChatGPT を開く
    const url = `https://chatgpt.com/?q=${encodeURIComponent(buildGradingPrompt())}`;
    window.open(url, "_blank", "noopener,noreferrer");
  };

  const recopyPhoto = async () => {
    setPhotoCopied(await copyPhotoToClipboard());
  };

  if (!photo || !photo.image) {
    return (
      <Card>
        <CardBody className="flex flex-col gap-3">
          <SectionTitle>📷 Write About the Photo（本番：1分）</SectionTitle>
          <p className="text-sm text-ink-faint">今日のお題を読み込み中…</p>
        </CardBody>
      </Card>
    );
  }
  const imageSrc = photo.image;

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
              {photo.prompt}
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
              src={imageSrc}
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
                src={imageSrc}
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
                {photo.modelAnswer ? (
                  <div className="rounded-xl border border-accent-200 bg-accent-50 p-3">
                    <div className="mb-1 text-xs font-semibold text-accent-700">
                      ⭐ 模範解答（DET 110 レベル）
                    </div>
                    <p className="text-sm leading-7 text-ink">
                      {photo.modelAnswer}
                    </p>
                    {photo.modelAnswerJa ? (
                      <div className="mt-2 border-t border-accent-200 pt-2 text-xs leading-6 text-ink-soft">
                        {photo.modelAnswerJa}
                      </div>
                    ) : null}
                  </div>
                ) : (
                  <div className="rounded-xl border border-surface-border bg-surface-muted p-3 text-xs text-ink-soft">
                    今日の模範解答は準備中です（次回の自動更新で表示されます）。まずは
                    ChatGPT 採点を使ってみましょう。
                  </div>
                )}
                {photo.tips.length ? (
                  <div className="rounded-xl border border-surface-border p-3">
                    <div className="mb-2 text-xs font-semibold text-ink-soft">
                      💡 使える表現 Tips
                    </div>
                    <ul className="flex flex-col gap-1.5">
                      {photo.tips.map((t, i) => (
                        <li key={i} className="flex items-baseline gap-2 text-sm">
                          <Tag tone="blue">{t.term}</Tag>
                          <span className="text-ink-soft">{t.ja}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : null}
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
                  ChatGPT を開きました。あとは写真を貼って送信するだけ👇
                </div>
                <ol className="flex list-decimal flex-col gap-1.5 pl-5 text-ink-soft">
                  <li>
                    採点プロンプトは <b>入力欄に自動入力済み</b>
                    です（自動で送信される場合もあります）
                  </li>
                  {photoCopied === false ? (
                    <li className="text-danger">
                      写真の自動コピーに失敗しました。
                      <b>上の写真を右クリック →「画像をコピー」</b>
                      してから次へ進んでください
                    </li>
                  ) : (
                    <li>
                      入力欄で <b>⌘V（貼り付け）</b> → 写真が貼り付きます
                      <span className="text-ink-faint">（写真はコピー済み）</span>
                    </li>
                  )}
                  <li>
                    <b>送信ボタンを押すだけ</b>
                    。点数＋言い換え＋使える表現が返ってきます
                  </li>
                </ol>
                <button
                  type="button"
                  onClick={recopyPhoto}
                  className="self-start rounded-lg border border-surface-border bg-white px-3 py-1.5 text-xs font-medium text-ink-soft hover:bg-surface-muted"
                >
                  {photoCopied ? "✓ 写真をコピー済み（もう一度コピー）" : "写真をコピー"}
                </button>
                <p className="text-xs text-ink-faint">
                  ※ ブラウザの仕様で「写真の自動添付」まではできないため、写真の貼り付け（⌘V）だけはご自身で行う必要があります。
                </p>
              </div>
            ) : null}
          </div>
        ) : null}
      </CardBody>
    </Card>
  );
}
