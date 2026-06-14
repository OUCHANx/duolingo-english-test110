// id 生成（ブラウザ・Node 両対応のフォールバック付き）
export function uid(): string {
  if (
    typeof crypto !== "undefined" &&
    typeof crypto.randomUUID === "function"
  ) {
    return crypto.randomUUID();
  }
  // フォールバック
  return "id-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
}
