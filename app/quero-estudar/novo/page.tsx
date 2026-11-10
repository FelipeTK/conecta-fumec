import type { Metadata } from "next";
import { Suspense } from "react";
import { NewInterestScreen } from "@/components/interests/NewInterestScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Publicar interesse" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <NewInterestScreen />
    </Suspense>
  );
}
