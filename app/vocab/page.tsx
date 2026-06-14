"use client";

import { useData } from "@/context/DataContext";
import { PageHeader, Loading } from "@/components/ui/PageHeader";
import { VocabBook } from "@/components/features/vocab/VocabBook";

export default function VocabPage() {
  const { ready } = useData();
  if (!ready) return <Loading />;

  return (
    <div>
      <PageHeader
        title="単語帳"
        subtitle="取り込んだ単語をカードで暗記・検索（英→日・音声つき）"
      />
      <VocabBook />
    </div>
  );
}
