// =============================================================
// 「今日のお題（Write About the Photo）」を public/daily-photo.json から読む。
// Routine が毎日「新しい実写真を取得 → AIが画像を見て模範解答・Tipsを生成」して
// このファイルと public/daily-photo.jpg を更新する。無ければフォールバック表示。
// =============================================================
export interface PhotoTip {
  term: string;
  ja: string;
}

export interface DailyPhoto {
  date: string | null;
  image: string | null; // public/ 配下のパス or URL
  prompt: string; // 英語の設問
  theme: string | null; // 写真の内容（日本語メモ可）
  modelAnswer: string | null; // 模範解答（英語・DET 110 レベル）
  modelAnswerJa: string | null; // 模範解答の和訳
  tips: PhotoTip[]; // 中高レベルの使える表現
}

const DEFAULT_PROMPT =
  "Describe what you see in this photo in detail: where it is, who is there, what is happening, and what kind of atmosphere it has.";

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * フォールバック用の日替わり写真（Lorem Picsum）。Routine 未実行/取得失敗時のみ使用。
 * 模範解答・Tips は付かない（画像をAIが見ていないため）。
 */
export function getFreeDailyPhoto(today: string): DailyPhoto {
  return {
    date: today,
    image: `https://picsum.photos/seed/det-${today}/1000/750`,
    prompt: DEFAULT_PROMPT,
    theme: null,
    modelAnswer: null,
    modelAnswerJa: null,
    tips: [],
  };
}

function parseTips(x: unknown): PhotoTip[] {
  if (!Array.isArray(x)) return [];
  return x
    .filter(
      (t): t is PhotoTip =>
        typeof t === "object" &&
        t !== null &&
        typeof (t as Record<string, unknown>).term === "string" &&
        typeof (t as Record<string, unknown>).ja === "string",
    )
    .map((t) => ({ term: t.term, ja: t.ja }));
}

export async function fetchDailyPhoto(): Promise<DailyPhoto | null> {
  try {
    const res = await fetch("/daily-photo.json", { cache: "no-store" });
    if (!res.ok) return null;
    const d: unknown = await res.json();
    if (typeof d !== "object" || d === null) return null;
    const obj = d as Record<string, unknown>;
    if (typeof obj.image !== "string" || !obj.image) return null;
    return {
      date: typeof obj.date === "string" ? obj.date : null,
      image: obj.image,
      prompt:
        typeof obj.prompt === "string" && obj.prompt ? obj.prompt : DEFAULT_PROMPT,
      theme: typeof obj.theme === "string" ? obj.theme : null,
      modelAnswer:
        typeof obj.modelAnswer === "string" ? obj.modelAnswer : null,
      modelAnswerJa:
        typeof obj.modelAnswerJa === "string" ? obj.modelAnswerJa : null,
      tips: parseTips(obj.tips),
    };
  } catch {
    return null;
  }
}
