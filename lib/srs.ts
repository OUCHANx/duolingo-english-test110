// =============================================================
// 復習システム（Leitner box + SM-2 ease のハイブリッド SRS）
// =============================================================
import type { ReviewItem } from "./types";
import { addDays, clamp } from "./det";

export type ReviewResult = "again" | "hard" | "good" | "easy";

export interface SrsState {
  box: number;
  ease: number;
  intervalDays: number;
  dueDate: string;
  lastResult: ReviewResult | null;
  lastReviewedAt: string | null;
  archived: boolean;
}

/** 新規 ReviewItem の初期 SRS 状態（today に即出題） */
export function freshSrs(today: string): SrsState {
  return {
    box: 0,
    ease: 2.5,
    intervalDays: 0,
    dueDate: today,
    lastResult: null,
    lastReviewedAt: null,
    archived: false,
  };
}

/** 採点結果から次回の SRS 状態を計算 */
export function applyReview(
  item: Pick<ReviewItem, "box" | "ease" | "intervalDays">,
  result: ReviewResult,
  today: string,
): SrsState {
  let { box, ease, intervalDays } = item;

  if (result === "again") {
    box = 0;
    intervalDays = 0; // 当日中に再出題（dueDate = today）
    ease = Math.max(1.3, ease - 0.2);
  } else {
    box = clamp(box + 1, 0, 5);
    const factor =
      result === "hard" ? 1.2 : result === "easy" ? ease * 1.3 : ease;
    intervalDays = Math.ceil(Math.max(1, intervalDays) * factor);
    if (result === "hard") ease = Math.max(1.3, ease - 0.15);
    if (result === "easy") ease = ease + 0.15;
  }

  // box 5 まで到達して good/easy なら「卒業」
  const archived = box >= 5 && (result === "good" || result === "easy");

  return {
    box,
    ease,
    intervalDays,
    dueDate: addDays(today, intervalDays),
    lastResult: result,
    lastReviewedAt: today,
    archived,
  };
}

/** 今日復習すべき項目（期限到来かつ未卒業）を優先度順で返す */
export function getDueReviews(items: ReviewItem[], today: string): ReviewItem[] {
  return items
    .filter((i) => !i.archived && i.dueDate <= today)
    .sort((a, b) => {
      // 期限が古い順 → 定着が浅い（box が小さい）順
      if (a.dueDate !== b.dueDate) return a.dueDate < b.dueDate ? -1 : 1;
      return a.box - b.box;
    });
}

export function dueCount(items: ReviewItem[], today: string): number {
  return items.filter((i) => !i.archived && i.dueDate <= today).length;
}
