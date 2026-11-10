import type { Metadata } from "next";
import { Suspense } from "react";
import { GroupsScreen } from "@/components/groups/GroupsScreen";
import { ScreenFallback } from "@/components/ui/layout";

export const metadata: Metadata = { title: "Grupos de estudo" };

export default function Page() {
  return (
    <Suspense fallback={<ScreenFallback />}>
      <GroupsScreen />
    </Suspense>
  );
}
