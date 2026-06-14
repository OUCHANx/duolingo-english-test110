// ストレージ抽象。localStorage → Supabase の差し替えはこの実装1つだけで済む。
export interface StorageAdapter {
  readCollection<T>(collection: string): T[];
  writeCollection<T>(collection: string, rows: T[]): void;
}
