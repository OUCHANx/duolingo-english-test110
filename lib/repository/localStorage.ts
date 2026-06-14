import type { StorageAdapter } from "./adapter";

export const SCHEMA_VERSION = 1;
const PREFIX = `det:v${SCHEMA_VERSION}:`;

/**
 * localStorage 実装。コレクション = 1キーに JSON 配列で保存。
 * SSR（window 無し）では空配列 / no-op として安全に動作する。
 */
export class LocalStorageAdapter implements StorageAdapter {
  private available(): boolean {
    return typeof window !== "undefined" && !!window.localStorage;
  }

  private key(collection: string): string {
    return PREFIX + collection;
  }

  readCollection<T>(collection: string): T[] {
    if (!this.available()) return [];
    const key = this.key(collection);
    try {
      const raw = window.localStorage.getItem(key);
      if (!raw) return [];
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed as T[];
      this.quarantine(key, raw); // 非配列は破損とみなし退避
      return [];
    } catch {
      const raw = window.localStorage.getItem(key);
      if (raw) this.quarantine(key, raw); // parse 失敗値を上書き前に退避
      return [];
    }
  }

  // 破損データを :corrupt キーへ退避してから元キーを消す（無告知の上書き消失を防ぐ）
  private quarantine(key: string, raw: string): void {
    try {
      window.localStorage.setItem(`${key}:corrupt`, raw);
      window.localStorage.removeItem(key);
    } catch {
      // 退避もできない場合は何もしない
    }
  }

  writeCollection<T>(collection: string, rows: T[]): void {
    if (!this.available()) return;
    try {
      window.localStorage.setItem(this.key(collection), JSON.stringify(rows));
    } catch {
      // 容量超過などは握りつぶす（MVP）
    }
  }
}
