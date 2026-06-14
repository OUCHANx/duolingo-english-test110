"use client";

import { useData } from "@/context/DataContext";
import { Card, CardBody, SectionTitle } from "@/components/ui/Card";
import { LinkButton } from "@/components/ui/Button";
import { Tag } from "@/components/ui/Tag";
import { calcTodayCompletion } from "@/lib/scoring";

const CHANNEL_LABEL: Record<string, string> = {
  app: "アプリ",
  cambly: "Cambly",
  chatgpt: "ChatGPT",
};

export function TodayPlanCard() {
  const { studyTasks, today, actions } = useData();
  const tasks = studyTasks
    .filter((t) => t.scheduledDate === today)
    .sort((a, b) => b.priority - a.priority);
  const comp = calcTodayCompletion(studyTasks, today);

  return (
    <Card>
      <CardBody>
        <SectionTitle
          action={
            <span className="text-xs font-medium text-ink-faint">
              {comp.done}/{comp.total} 完了
            </span>
          }
        >
          📌 今日のプラン
        </SectionTitle>

        {tasks.length === 0 ? (
          <div className="py-4 text-center text-sm text-ink-faint">
            今日のメニューを準備中…
          </div>
        ) : (
          <ul className="flex flex-col gap-2">
            {tasks.map((t) => {
              const done = t.status === "done";
              return (
                <li
                  key={t.id}
                  className={`flex items-center gap-3 rounded-xl border px-3 py-2.5 ${
                    done
                      ? "border-accent-100 bg-accent-50"
                      : "border-surface-border bg-white"
                  }`}
                >
                  <button
                    type="button"
                    aria-label="完了"
                    onClick={() =>
                      actions.setTaskStatus(t.id, done ? "todo" : "done")
                    }
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 text-xs transition ${
                      done
                        ? "border-accent-500 bg-accent-500 text-white"
                        : "border-surface-border text-transparent hover:border-brand-400"
                    }`}
                  >
                    ✓
                  </button>
                  <div className="min-w-0 flex-1">
                    <div
                      className={`truncate text-sm font-medium ${
                        done ? "text-ink-faint line-through" : "text-ink"
                      }`}
                    >
                      {t.title}
                    </div>
                    <div className="mt-0.5 flex items-center gap-1.5">
                      <Tag
                        tone={
                          t.channel === "cambly"
                            ? "amber"
                            : t.channel === "chatgpt"
                              ? "green"
                              : "blue"
                        }
                      >
                        {CHANNEL_LABEL[t.channel] ?? t.channel}
                      </Tag>
                      <span className="text-[11px] text-ink-faint">
                        約{t.estimatedMinutes}分
                      </span>
                    </div>
                  </div>
                  {!done && t.href ? (
                    <LinkButton href={t.href} size="sm" variant="secondary">
                      {t.channel === "app" ? "開始" : "記録"}
                    </LinkButton>
                  ) : null}
                </li>
              );
            })}
          </ul>
        )}

        <div className="mt-3 flex justify-end">
          <button
            type="button"
            onClick={actions.regenerateTodayMenu}
            className="text-xs text-ink-faint hover:text-brand-600"
          >
            ↻ メニューを再生成
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
