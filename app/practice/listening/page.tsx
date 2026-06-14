"use client";

import Link from "next/link";
import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { Card, CardBody } from "@/components/ui/Card";
import { Tag } from "@/components/ui/Tag";

export default function ListeningListPage() {
  const { ready } = useData();
  if (!ready) return <Loading />;

  return (
    <div>
      <PageHeader title="Listening 演習" subtitle="形式を選んで始めましょう" />
      <div className="flex flex-col gap-3">
        <Link href="/practice/listening/listen-and-type">
          <Card className="transition hover:border-accent-200">
            <CardBody className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-ink">
                    Listen and Type
                  </span>
                  <Tag tone="green">毎回新しい問題</Tag>
                </div>
                <div className="mt-0.5 text-xs text-ink-soft">
                  音声を聞いて英文を入力（ディクテーション）。聞き取れなかった語は自動で復習リストへ。
                </div>
              </div>
              <span className="text-ink-faint">→</span>
            </CardBody>
          </Card>
        </Link>
      </div>
      <p className="mt-3 text-xs text-ink-faint">
        ※ 音声は端末の読み上げ機能（Web Speech API）を使用します。音源ファイルがある場合はそちらを優先します。
      </p>
    </div>
  );
}
