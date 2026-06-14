"use client";

import { PageHeader } from "@/components/ui/PageHeader";
import { CamblySessionForm } from "@/components/features/records/CamblySessionForm";

export default function NewSpeakingPage() {
  return (
    <div>
      <PageHeader title="Cambly レッスンを記録" subtitle="Speaking 対策の記録" />
      <CamblySessionForm />
    </div>
  );
}
