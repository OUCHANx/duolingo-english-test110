"use client";

import { useMemo, useState } from "react";
import { useData } from "@/context/DataContext";
import { Card, CardBody } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { TextInput } from "@/components/ui/Field";
import { getStudyVocab, loadKnown, saveKnown } from "@/lib/vocabStudy";
import { speak } from "@/lib/speech";

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("");
const LIST_CAP = 300;

export function VocabBook() {
  const { actions } = useData();
  const all = useMemo(() => getStudyVocab(), []);

  const [known, setKnown] = useState<Set<string>>(() => loadKnown());
  const [mode, setMode] = useState<"cards" | "list">("cards");
  const [query, setQuery] = useState("");
  const [letter, setLetter] = useState<string>("all");
  const [unknownOnly, setUnknownOnly] = useState(false);
  const [index, setIndex] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [added, setAdded] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return all.filter((e) => {
      if (letter !== "all" && e.word[0] !== letter) return false;
      if (q && !e.word.includes(q)) return false;
      if (unknownOnly && known.has(e.word)) return false;
      return true;
    });
  }, [all, query, letter, unknownOnly, known]);

  // フィルタ変更でカード位置をリセット
  const filterKey = `${query}|${letter}|${unknownOnly}`;
  const [lastKey, setLastKey] = useState(filterKey);
  if (filterKey !== lastKey) {
    setLastKey(filterKey);
    setIndex(0);
    setRevealed(false);
  }

  const toggleKnown = (word: string) => {
    setKnown((prev) => {
      const next = new Set(prev);
      if (next.has(word)) next.delete(word);
      else next.add(word);
      saveKnown(next);
      return next;
    });
  };

  const addToReview = (word: string, ja: string) => {
    actions.addReviewItem(
      { kind: "word", front: word, back: ja, tags: ["vocab"] },
      "app",
    );
    setAdded((prev) => new Set(prev).add(word));
  };

  const total = filtered.length;
  const safeIndex = total ? Math.min(index, total - 1) : 0;
  const current = filtered[safeIndex];

  const next = (markKnown: boolean) => {
    if (current && markKnown && !known.has(current.word)) toggleKnown(current.word);
    setRevealed(false);
    setIndex(safeIndex + 1 < total ? safeIndex + 1 : 0);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* コントロール */}
      <Card>
        <CardBody className="flex flex-col gap-3">
          <div className="flex items-center justify-between gap-2">
            <SegmentedControl
              options={[
                { label: "カード", value: "cards" },
                { label: "一覧", value: "list" },
              ]}
              value={mode}
              onChange={(v) => setMode(v)}
            />
            <span className="text-xs text-ink-faint">
              覚えた {known.size} / {all.length}
            </span>
          </div>

          <TextInput
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="単語を検索…"
            autoCapitalize="off"
            spellCheck={false}
          />

          <div className="flex flex-wrap gap-1">
            <LetterChip active={letter === "all"} onClick={() => setLetter("all")}>
              全部
            </LetterChip>
            {LETTERS.map((l) => (
              <LetterChip
                key={l}
                active={letter === l}
                onClick={() => setLetter(l)}
              >
                {l.toUpperCase()}
              </LetterChip>
            ))}
          </div>

          <label className="flex items-center gap-2 text-sm text-ink-soft">
            <input
              type="checkbox"
              checked={unknownOnly}
              onChange={(e) => setUnknownOnly(e.target.checked)}
            />
            まだ覚えていない語だけ表示
          </label>
          <div className="text-xs text-ink-faint">{total} 語</div>
        </CardBody>
      </Card>

      {total === 0 ? (
        <p className="rounded-card border border-dashed border-surface-border bg-white py-10 text-center text-sm text-ink-faint">
          該当する単語がありません。
        </p>
      ) : mode === "cards" ? (
        // ===== カードモード =====
        <div className="flex flex-col gap-3">
          <div className="text-center text-xs text-ink-faint">
            {safeIndex + 1} / {total}
          </div>
          <Card>
            <CardBody className="flex min-h-[220px] flex-col items-center justify-center gap-3 py-8 text-center">
              <div className="text-3xl font-bold text-ink">{current.word}</div>
              <button
                type="button"
                onClick={() => speak(current.word)}
                className="rounded-pill bg-brand-600 px-3 py-1 text-xs font-medium text-white hover:bg-brand-700"
              >
                🔊 音声
              </button>
              {revealed ? (
                <>
                  <div className="mt-1 h-px w-20 bg-surface-border" />
                  <div className="text-xl text-ink-soft">{current.ja}</div>
                  <button
                    type="button"
                    onClick={() => addToReview(current.word, current.ja)}
                    disabled={added.has(current.word)}
                    className="mt-1 rounded-pill bg-accent-50 px-3 py-1 text-xs font-medium text-accent-700 disabled:opacity-60"
                  >
                    {added.has(current.word) ? "✓ 復習に追加済" : "🔁 復習に追加"}
                  </button>
                </>
              ) : null}
            </CardBody>
          </Card>

          {!revealed ? (
            <Button fullWidth onClick={() => setRevealed(true)}>
              意味を見る
            </Button>
          ) : (
            <div className="grid grid-cols-2 gap-2">
              <Button variant="secondary" onClick={() => next(false)}>
                まだ →
              </Button>
              <Button variant="success" onClick={() => next(true)}>
                覚えた →
              </Button>
            </div>
          )}
          {current && known.has(current.word) ? (
            <div className="text-center text-xs text-accent-600">✓ 覚えた済み</div>
          ) : null}
        </div>
      ) : (
        // ===== 一覧モード =====
        <div className="flex flex-col gap-2">
          {filtered.slice(0, LIST_CAP).map((e) => {
            const isKnown = known.has(e.word);
            return (
              <Card key={e.word}>
                <CardBody className="flex items-center gap-3 py-2.5">
                  <button
                    type="button"
                    aria-label="覚えた"
                    onClick={() => toggleKnown(e.word)}
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs ${
                      isKnown
                        ? "border-accent-500 bg-accent-500 text-white"
                        : "border-surface-border text-transparent"
                    }`}
                  >
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-semibold text-ink">{e.word}</div>
                    <div className="text-xs text-ink-soft">{e.ja}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => speak(e.word)}
                    className="shrink-0 text-ink-faint hover:text-brand-600"
                    aria-label="音声"
                  >
                    🔊
                  </button>
                  <button
                    type="button"
                    onClick={() => addToReview(e.word, e.ja)}
                    disabled={added.has(e.word)}
                    className="shrink-0 text-xs text-ink-faint hover:text-accent-600 disabled:opacity-50"
                  >
                    {added.has(e.word) ? "追加済" : "復習+"}
                  </button>
                </CardBody>
              </Card>
            );
          })}
          {total > LIST_CAP ? (
            <p className="py-3 text-center text-xs text-ink-faint">
              先頭 {LIST_CAP} 件を表示中（{total} 語）。検索や頭文字で絞り込んでください。
            </p>
          ) : null}
        </div>
      )}
    </div>
  );
}

function LetterChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`h-7 min-w-[28px] rounded-md px-1.5 text-xs font-medium transition ${
        active
          ? "bg-brand-600 text-white"
          : "bg-surface-muted text-ink-soft hover:bg-brand-50"
      }`}
    >
      {children}
    </button>
  );
}
