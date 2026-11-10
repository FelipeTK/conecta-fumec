"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { Footer } from "@/components/shell/Footer";
import { Header } from "@/components/shell/Header";
import { SearchDialog } from "@/components/shell/SearchDialog";
import { SearchProvider } from "@/components/shell/search-context";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const closeSearch = useCallback(() => setSearchOpen(false), []);
  const openSearch = useCallback(() => setSearchOpen(true), []);

  useEffect(() => {
    setMenuOpen(false);
    setSearchOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      const typing =
        target?.tagName === "INPUT" ||
        target?.tagName === "TEXTAREA" ||
        target?.tagName === "SELECT" ||
        target?.isContentEditable;
      if (event.key === "/" && !typing && !event.metaKey && !event.ctrlKey && !event.altKey) {
        event.preventDefault();
        setSearchOpen(true);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <SearchProvider openSearch={openSearch}>
      <a className="skip-link" href="#conteudo">
        Ir para o conteúdo
      </a>
      <div className="sticky top-0 z-40">
        <p className="flex h-9 items-center justify-center bg-blue-ink px-5 text-center text-[13px] text-white">
          <span className="sm:hidden">Protótipo · dados fictícios, só neste navegador</span>
          <span className="hidden sm:inline">
            Protótipo navegável do MVP · dados fictícios, salvos só neste navegador · não é o sistema oficial da FUMEC
          </span>
        </p>
        <Header menuOpen={menuOpen} onMenu={() => setMenuOpen((open) => !open)} />
      </div>
      <main id="conteudo">{children}</main>
      <Footer />
      {searchOpen ? <SearchDialog onClose={closeSearch} /> : null}
    </SearchProvider>
  );
}
