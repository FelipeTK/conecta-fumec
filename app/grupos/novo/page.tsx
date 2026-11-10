import type { Metadata } from "next";
import { Suspense } from "react";
import { NewGroupScreen } from "@/components/groups/NewGroupScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Novo grupo de estudo" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <NewGroupScreen />
    </Suspense>
  );
}
