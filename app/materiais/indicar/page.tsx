import type { Metadata } from "next";
import { Suspense } from "react";
import { NewMaterialScreen } from "@/components/materials/NewMaterialScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Indicar material" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <NewMaterialScreen />
    </Suspense>
  );
}
