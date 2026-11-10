import type { Metadata } from "next";
import { MaterialScreen } from "@/components/materials/MaterialScreen";

export const metadata: Metadata = { title: "Material indicado" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <MaterialScreen id={id} />;
}
