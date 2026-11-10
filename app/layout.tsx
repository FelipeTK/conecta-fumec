import type { Metadata, Viewport } from "next";
import { Manrope } from "next/font/google";
import { Shell } from "@/components/shell/Shell";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FUMEC Conecta",
    template: "%s · FUMEC Conecta",
  },
  description:
    "Protótipo navegável do MVP FUMEC Conecta: grupos de estudo por disciplina, interesse em estudar junto e indicação de materiais autorizados.",
  robots: { index: false, follow: false },
  applicationName: "FUMEC Conecta",
};

export const viewport: Viewport = {
  themeColor: "#084864",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={manrope.variable}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <StoreProvider>
          <Shell>{children}</Shell>
        </StoreProvider>
      </body>
    </html>
  );
}
