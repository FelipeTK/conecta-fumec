import type { Metadata } from "next";
import { EvaluateScreen } from "@/components/evaluate/EvaluateScreen";

export const metadata: Metadata = { title: "Avaliar o protótipo" };

export default function Page() {
  return <EvaluateScreen />;
}
