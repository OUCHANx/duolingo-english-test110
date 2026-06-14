// =============================================================
// データのバックアップ（書き出し）／復元（読み込み）
//   - アプリの全データは localStorage の "det:" 名前空間に入っている
//     （det:v1:{collection} / det:v1:vocab_known / det:v1:tts_settings）
//   - 1つの JSON ファイルにまとめて端末間移動・バックアップできる
//   - 別ドメイン（localhost ⇄ *.vercel.app）への引っ越しはこれで行う
// =============================================================
import { SCHEMA_VERSION } from "./repository/localStorage";
import { todayISO } from "./det";

const BACKUP_PREFIX = "det:";
const BACKUP_APP = "det110";

export interface BackupFile {
  app: typeof BACKUP_APP;
  schemaVersion: number;
  exportedAt: string; // ISO
  origin: string | null; // 書き出し元（参考情報）
  data: Record<string, string>; // localStorage キー -> 生の値(JSON文字列)
}

/** 破損退避キー(:corrupt)を除く、すべての det: キーを集めて1ファイルにする */
export function collectBackup(): BackupFile {
  const data: Record<string, string> = {};
  if (typeof window !== "undefined" && window.localStorage) {
    for (let i = 0; i < window.localStorage.length; i++) {
      const k = window.localStorage.key(i);
      if (!k || !k.startsWith(BACKUP_PREFIX) || k.endsWith(":corrupt")) continue;
      const v = window.localStorage.getItem(k);
      if (v != null) data[k] = v;
    }
  }
  return {
    app: BACKUP_APP,
    schemaVersion: SCHEMA_VERSION,
    exportedAt: new Date().toISOString(),
    origin: typeof window !== "undefined" ? window.location.origin : null,
    data,
  };
}

/** バックアップを JSON ファイルとしてダウンロードさせる */
export function downloadBackup(): { keys: number; fileName: string } {
  const file = collectBackup();
  const json = JSON.stringify(file, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const fileName = `det110-backup-${todayISO()}.json`;
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return { keys: Object.keys(file.data).length, fileName };
}

/** ファイルを読み込んで BackupFile として検証付きで返す */
export async function readBackupFile(file: File): Promise<BackupFile> {
  let parsed: unknown;
  try {
    parsed = JSON.parse(await file.text());
  } catch {
    throw new Error("JSON として読み込めませんでした。ファイルが壊れている可能性があります。");
  }
  const f = parsed as Partial<BackupFile>;
  if (!f || f.app !== BACKUP_APP || typeof f.data !== "object" || f.data === null) {
    throw new Error("これは DET 110 のバックアップファイルではないようです。");
  }
  return f as BackupFile;
}

/**
 * バックアップを現在の端末（このドメイン）に書き戻す。
 * この端末の det: データはいったん全消去してから上書きする（＝バックアップ時点の状態に戻す）。
 * 呼び出し側で window.location.reload() して再読込すること。
 */
export function applyBackup(file: BackupFile): { keys: number } {
  if (typeof window === "undefined" || !window.localStorage) {
    throw new Error("この環境では復元できません。");
  }
  // 既存の det: キーを退避キー含めて全消去
  const toRemove: string[] = [];
  for (let i = 0; i < window.localStorage.length; i++) {
    const k = window.localStorage.key(i);
    if (k && k.startsWith(BACKUP_PREFIX)) toRemove.push(k);
  }
  toRemove.forEach((k) => window.localStorage.removeItem(k));

  // バックアップ内の det: キーのみ書き戻す
  let count = 0;
  for (const [k, v] of Object.entries(file.data)) {
    if (k.startsWith(BACKUP_PREFIX) && typeof v === "string") {
      window.localStorage.setItem(k, v);
      count++;
    }
  }
  return { keys: count };
}
