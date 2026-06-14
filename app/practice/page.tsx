"use client";

import Link from "next/link";
import { PageHeader } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";

const SECTIONS = [
  {
    href: "/practice/reading",
    icon: "📖",
    title: "Reading 対策",
    desc: "Read and Select / Read and Complete / Complete the Sentences / Interactive Reading",
    tone: "brand",
  },
  {
    href: "/practice/listening",
    icon: "🎧",
    title: "Listening 対策",
    desc: "Listen and Type（ディクテーション）",
    tone: "accent",
  },
  {
    href: "/vocab",
    icon: "📚",
    title: "単語帳",
    desc: "取り込んだ単語をカードで暗記・検索（英→日・音声）",
    tone: "brand",
  },
] as const;

export default function PracticeIndexPage() {
  return (
    <div>
      <PageHeader
        title="演習"
        subtitle="DET形式の Reading / Listening をアプリ内で練習します"
      />
      <div className="flex flex-col gap-3">
        {SECTIONS.map((s) => (
          <Link key={s.href} href={s.href}>
            <Card className="transition hover:border-brand-200">
              <CardBody className="flex items-center gap-4">
                <span
                  className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${
                    s.tone === "brand" ? "bg-brand-50" : "bg-accent-50"
                  }`}
                >
                  {s.icon}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-base font-bold text-ink">{s.title}</div>
                  <div className="mt-0.5 text-xs text-ink-soft">{s.desc}</div>
                </div>
                <span className="text-ink-faint">→</span>
              </CardBody>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
