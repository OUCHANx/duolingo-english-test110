"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { WritingRecordForm } from "@/components/features/records/WritingRecordForm";

export default function NewWritingPage() {
  return (
    <div>
      <PageHeader title="Writing 添削を記録" subtitle="ChatGPT 対策の記録" />
      <WritingRecordForm />
    </div>
  );
}
