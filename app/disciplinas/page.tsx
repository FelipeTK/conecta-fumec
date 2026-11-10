import type { Metadata } from "next";
import { Suspense } from "react";
import { DisciplinesScreen } from "@/components/disciplines/DisciplinesScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Disciplinas" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <DisciplinesScreen />
    </Suspense>
  );
}
