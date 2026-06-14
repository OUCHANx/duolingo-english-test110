"use client";

import { LinkButton, Button } from "@/components/ui/Button";
import { Card, CardBody } from "@/components/ui/Card";
import { ProgressRing } from "@/components/ui/ProgressRing";

export function ResultSummary({
  correct,
  total,
  reviewAdded,
  backHref,
  onRetry,
}: {
  correct: number;
  total: number;
  reviewAdded: number;
  backHref: string;
  onRetry: () => void;
}) {
  const pct = total ? Math.round((correct / total) * 100) : 0;
  const msg =
    pct >= 90 ? "素晴らしい！" : pct >= 70 ? "good! この調子" : "復習で取り返そう";

  return (
    <Card>
      <CardBody className="flex flex-col items-center gap-3 py-8 text-center">
        <ProgressRing
          value={pct}
          size={120}
          thickness={12}
          tone={pct >= 70 ? "accent" : "warn"}
          center={
            <div className="flex flex-col items-center">
              <span className="tabular text-2xl font-bold text-ink">{pct}%</span>
              <span className="text-xs text-ink-faint">
                {correct}/{total}
              </span>
            </div>
          }
        />
        <p className="text-base font-semibold text-ink">{msg}</p>
        {reviewAdded > 0 ? (
          <p className="text-sm text-ink-soft">
            🔁 復習リストに <b>{reviewAdded}</b> 件追加しました
          </p>
        ) : (
          <p className="text-sm text-ink-faint">復習に追加する項目はありません</p>
        )}
        <div className="mt-2 flex w-full max-w-xs flex-col gap-2">
          <Button variant="primary" fullWidth onClick={onRetry}>
            もう一度
          </Button>
          <LinkButton href={backHref} variant="ghost" fullWidth>
            演習を終える
          </LinkButton>
        </div>
      </CardBody>
    </Card>
  );
}
