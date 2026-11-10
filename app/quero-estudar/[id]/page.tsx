import type { Metadata } from "next";
import { InterestScreen } from "@/components/interests/InterestScreen";

export const metadata: Metadata = { title: "Interesse em estudar" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <InterestScreen id={id} />;
}
