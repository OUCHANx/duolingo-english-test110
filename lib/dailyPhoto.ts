// =============================================================
// 「今日のお題（Write About the Photo）」を public/daily-photo.json から読む。
// Routine が画像生成して毎日更新する。無ければフォールバック表示。
// =============================================================
export interface DailyPhoto {
  date: string | null;
  image: string | null; // public/ 配下のパス or URL
  prompt: string; // 英語の指示
  theme: string | null; // 写真の内容（日本語メモ可）
}

// DET 向けの設問（日替わりでローテーション）
const WRITING_PROMPTS = [
  "Describe what you see in this photo in detail. Who or what is in it, where is it, and what is happening?",
  "Describe the people in the photo and what they seem to be doing and feeling.",
  "Describe the place in the photo and its atmosphere. What kind of mood does it create?",
  "What is happening in this scene? Describe it and explain what might happen next.",
  "Imagine you are in this photo. Describe what you can see, hear, and feel.",
  "Describe this image, then give your opinion: do you like this kind of place or activity? Why?",
];

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) >>> 0;
  return h;
}

/**
 * 無料の日替わり写真（Lorem Picsum）。日付シードなので毎日自動で変わり、
 * その日のうちは固定（＝0:00 JST に更新）。クレジット不要。
 */
export function getFreeDailyPhoto(today: string): DailyPhoto {
  return {
    date: today,
    image: `https://picsum.photos/seed/det-${today}/1000/750`,
    prompt: WRITING_PROMPTS[hashStr(today) % WRITING_PROMPTS.length],
    theme: null,
  };
}

export async function fetchDailyPhoto(): Promise<DailyPhoto | null> {
  try {
    const res = await fetch("/daily-photo.json", { cache: "no-store" });
    if (!res.ok) return null;
    const d: unknown = await res.json();
    if (typeof d !== "object" || d === null) return null;
    const obj = d as Record<string, unknown>;
    return {
      date: typeof obj.date === "string" ? obj.date : null,
      image: typeof obj.image === "string" ? obj.image : null,
      prompt:
        typeof obj.prompt === "string" && obj.prompt
          ? obj.prompt
          : "Describe what you see in the photo in detail. Who or what is in it, where is it, and what is happening?",
      theme: typeof obj.theme === "string" ? obj.theme : null,
    };
  } catch {
    return null;
  }
}
