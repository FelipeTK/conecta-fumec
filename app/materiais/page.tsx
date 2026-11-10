import type { Metadata } from "next";
import { Suspense } from "react";
import { MaterialsScreen } from "@/components/materials/MaterialsScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Materiais" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <MaterialsScreen />
    </Suspense>
  );
}
