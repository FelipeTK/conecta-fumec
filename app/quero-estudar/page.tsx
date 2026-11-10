import type { Metadata } from "next";
import { Suspense } from "react";
import { InterestsScreen } from "@/components/interests/InterestsScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Quero estudar" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <InterestsScreen />
    </Suspense>
  );
}
