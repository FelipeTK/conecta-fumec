import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = { title: "Sobre o MVP" };

export default function Page() {
  return <AboutView />;
}
