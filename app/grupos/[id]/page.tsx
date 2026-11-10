import type { Metadata } from "next";
import { GroupScreen } from "@/components/groups/GroupScreen";

export const metadata: Metadata = { title: "Grupo de estudo" };

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <GroupScreen id={id} />;
}
