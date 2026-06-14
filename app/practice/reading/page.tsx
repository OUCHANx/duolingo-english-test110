"use client";

import Link from "next/link";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";
import type { DetTaskType } from "@/lib/types";

const TYPES: { type: DetTaskType; title: string; desc: string; dynamic: boolean }[] = [
  {
    type: "read_and_select",
    title: "Read and Select",
    desc: "実在する英単語を選ぶ（語彙力）",
    dynamic: true,
  },
  {
    type: "read_and_complete",
    title: "Read and Complete",
    desc: "単語帳の語を意味ヒント付きでスペル入力",
    dynamic: true,
  },
  {
    type: "complete_the_sentences",
    title: "Complete the Sentences",
    desc: "文脈に合う語句を選ぶ",
    dynamic: false,
  },
  {
    type: "interactive_reading",
    title: "Interactive Reading",
    desc: "長文＋内容理解・タイトル・文挿入・要約",
    dynamic: false,
  },
];

function slug(t: DetTaskType): string {
  return t.replace(/_/g, "-");
}

export default function ReadingListPage() {
  const { ready, readingQuestions } = useData();
  if (!ready) return <Loading />;

  const countOf = (t: DetTaskType) =>
    readingQuestions.filter((q) => q.taskType === t).length;

  return (
    <div>
      <PageHeader title="Reading 演習" subtitle="形式を選んで始めましょう" />
      <div className="flex flex-col gap-3">
        {TYPES.map((t) => {
          const count = countOf(t.type);
          return (
            <Link key={t.type} href={`/practice/reading/${slug(t.type)}`}>
              <Card className="transition hover:border-brand-200">
                <CardBody className="flex items-center gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-ink">
                        {t.title}
                      </span>
                      {t.dynamic ? (
                        <Tag tone="green">毎回新しい問題</Tag>
                      ) : (
                        <Tag tone={count ? "blue" : "gray"}>{count}問</Tag>
                      )}
                    </div>
                    <div className="mt-0.5 text-xs text-ink-soft">{t.desc}</div>
                  </div>
                  <span className="text-ink-faint">→</span>
                </CardBody>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
