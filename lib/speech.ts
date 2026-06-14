// =============================================================
// 英語の読み上げ（Web Speech API）ヘルパ
//   問題: 声を明示しないと OS 既定の声（日本語=Kyoko 等）や
//        macOS のネタ用音声が選ばれ、英文が極端に聞き取りづらい。
//   対策: 良質な英語音声を明示選択 + 音量/速度設定 + 非同期ロード対応。
// =============================================================

// 自然な英語音声を優先（先頭ほど優先）。Google US English を最優先にする。
const PREFERRED_NAMES = [
  "Google US English",
  "Google US English Female",
  "Microsoft Aria",
  "Microsoft Jenny",
  "Samantha",
  "Ava",
  "Allison",
  "Susan",
  "Alex",
  "Daniel",
  "Karen",
  "Moira",
  "Tessa",
  "Google UK English Female",
  "Google UK English Male",
];

// 聞き取りに適さない macOS のネタ用・ロボット音声を除外
const NOVELTY =
  /albert|bad news|bahh|boing|bubbles|cellos|fred|good news|jester|junior|kathy|organ|ralph|superstar|trinoids|whisper|wobble|zarvox|bells|grandma|grandpa|eddy|flo|reed|rocko|sandy|shelley|ささやき|オルガン|スーパースター|トリノイド|ベル|道化|震え/i;

const SETTINGS_KEY = "det:v1:tts_settings";

export interface SpeechSettings {
  voiceURI: string | null;
  rate: number; // 0.6〜1.2 程度
}

export function loadSpeechSettings(): SpeechSettings {
  if (typeof window === "undefined") return { voiceURI: null, rate: 0.9 };
  try {
    const raw = window.localStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const v = JSON.parse(raw);
      return {
        voiceURI: typeof v.voiceURI === "string" ? v.voiceURI : null,
        rate: typeof v.rate === "number" ? v.rate : 0.9,
      };
    }
  } catch {
    /* ignore */
  }
  return { voiceURI: null, rate: 0.9 };
}

export function saveSpeechSettings(s: SpeechSettings): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SETTINGS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function isSpeechAvailable(): boolean {
  return typeof window !== "undefined" && "speechSynthesis" in window;
}

/** 英語かつ聞き取りに適した音声だけを返す */
export function usableEnglishVoices(
  voices: SpeechSynthesisVoice[],
): SpeechSynthesisVoice[] {
  const en = voices.filter((v) => /^en/i.test(v.lang));
  const clean = en.filter((v) => !NOVELTY.test(v.name));
  return clean.length ? clean : en;
}

/** voiceschanged を待って音声一覧を取得（初回は空のため） */
export function loadVoices(): Promise<SpeechSynthesisVoice[]> {
  return new Promise((resolve) => {
    if (!isSpeechAvailable()) return resolve([]);
    const synth = window.speechSynthesis;
    const existing = synth.getVoices();
    if (existing.length) return resolve(existing);
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      synth.removeEventListener("voiceschanged", finish);
      resolve(synth.getVoices());
    };
    synth.addEventListener("voiceschanged", finish);
    // フォールバック（イベントが来ない環境向け）
    setTimeout(finish, 1200);
  });
}

/** 設定 or 優先リストから最適な英語音声を選ぶ */
export function pickVoice(
  voices: SpeechSynthesisVoice[],
  preferredURI?: string | null,
): SpeechSynthesisVoice | null {
  const usable = usableEnglishVoices(voices);
  if (preferredURI) {
    const m = usable.find((v) => v.voiceURI === preferredURI);
    if (m) return m;
  }
  for (const name of PREFERRED_NAMES) {
    const m = usable.find((v) => v.name === name || v.name.startsWith(name));
    if (m) return m;
  }
  // en-US を優先
  return (
    usable.find((v) => /en[-_]us/i.test(v.lang)) ?? usable[0] ?? null
  );
}

/** 英文を読み上げる（声・音量・速度を明示） */
export async function speak(
  text: string,
  opts?: { rate?: number; voiceURI?: string | null },
): Promise<void> {
  if (!isSpeechAvailable()) return;
  const synth = window.speechSynthesis;
  synth.cancel();
  const voices = await loadVoices();
  const voice = pickVoice(voices, opts?.voiceURI);
  const u = new SpeechSynthesisUtterance(text);
  if (voice) {
    u.voice = voice;
    u.lang = voice.lang;
  } else {
    u.lang = "en-US";
  }
  u.rate = opts?.rate ?? 0.9;
  u.pitch = 1;
  u.volume = 1; // 最大音量
  synth.speak(u);
}
