import type { Metadata } from "next";
import { SpaceScreen } from "@/components/space/SpaceScreen";

export const metadata: Metadata = { title: "Meu espaço" };

export default function Page() {
  return <SpaceScreen />;
}
