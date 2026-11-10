import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DisciplineScreen } from "@/components/disciplines/DisciplineScreen";
import { disciplines } from "@/lib/seed";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return disciplines.map((discipline) => ({ slug: discipline.id }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const discipline = disciplines.find((item) => item.id === slug);
  return { title: discipline?.name ?? "Disciplina" };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const discipline = disciplines.find((item) => item.id === slug);
  if (!discipline) notFound();
  return <DisciplineScreen discipline={discipline} />;
}
