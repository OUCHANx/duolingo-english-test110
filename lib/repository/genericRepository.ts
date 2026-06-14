import type { BaseEntity } from "../types";
import { uid } from "../id";
import { nowISO } from "../det";
import type { StorageAdapter } from "./adapter";

/** 全エンティティ共通の CRUD。真実源は明細配列。集計値は別途派生計算する。 */
export class GenericRepository<T extends BaseEntity> {
  constructor(
    private readonly collection: string,
    private readonly storage: StorageAdapter,
  ) {}

  list(): T[] {
    return this.storage.readCollection<T>(this.collection);
  }

  getById(id: string): T | undefined {
    return this.list().find((r) => r.id === id);
  }

  create(input: Omit<T, keyof BaseEntity> & Partial<BaseEntity>): T {
    const ts = nowISO();
    const entity = {
      ...input,
      id: input.id ?? uid(),
      userId: input.userId ?? null,
      createdAt: input.createdAt ?? ts,
      updatedAt: ts,
    } as T;
    const rows = this.list();
    rows.push(entity);
    this.storage.writeCollection(this.collection, rows);
    return entity;
  }

  update(id: string, patch: Partial<Omit<T, keyof BaseEntity>>): T | undefined {
    const rows = this.list();
    const idx = rows.findIndex((r) => r.id === id);
    if (idx < 0) return undefined;
    const updated = { ...rows[idx], ...patch, updatedAt: nowISO() } as T;
    rows[idx] = updated;
    this.storage.writeCollection(this.collection, rows);
    return updated;
  }

  upsert(entity: T): T {
    const rows = this.list();
    const idx = rows.findIndex((r) => r.id === entity.id);
    const next = { ...entity, updatedAt: nowISO() };
    if (idx < 0) rows.push(next);
    else rows[idx] = next;
    this.storage.writeCollection(this.collection, rows);
    return next;
  }

  remove(id: string): void {
    const rows = this.list().filter((r) => r.id !== id);
    this.storage.writeCollection(this.collection, rows);
  }

  /** seed 投入などの一括置換 */
  bulkPut(entities: T[]): void {
    this.storage.writeCollection(this.collection, entities);
  }

  /** seed 用：空のときだけ投入 */
  seedIfEmpty(entities: T[]): void {
    if (this.list().length === 0) {
      this.storage.writeCollection(this.collection, entities);
    }
  }
}
