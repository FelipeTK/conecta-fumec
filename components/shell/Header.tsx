"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "@/components/shell/Mark";
import { useSearch } from "@/components/shell/search-context";

const links = [
  { href: "/disciplinas", label: "Disciplinas" },
  { href: "/grupos", label: "Grupos" },
  { href: "/quero-estudar", label: "Quero estudar" },
  { href: "/materiais", label: "Materiais" },
];

function isCurrent(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Header({ menuOpen, onMenu }: { menuOpen: boolean; onMenu: () => void }) {
  const pathname = usePathname();
  const { openSearch } = useSearch();

  return (
    <header className="border-b border-line bg-white/92 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1120px] items-center gap-3 px-5">
        <Link href="/" className="flex items-center gap-2.5 rounded-xl" aria-label="FUMEC Conecta, início">
          <Mark />
          <span className="leading-none">
            <span className="block text-[11px] font-semibold tracking-[0.16em] text-muted">FUMEC</span>
            <span className="mt-1 block text-[15px] font-semibold text-ink">Conecta</span>
          </span>
        </Link>

        <nav className="ml-6 hidden items-center gap-1 lg:flex" aria-label="Principal">
          {links.map((link) => {
            const current = isCurrent(pathname, link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                aria-current={current ? "page" : undefined}
                className={`rounded-xl px-3 py-2 text-sm font-semibold ${current ? "bg-blue-soft text-blue-ink" : "text-ink-soft hover:bg-mist hover:text-ink"}`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <button type="button" className="btn btn-secondary btn-small hidden sm:inline-flex" onClick={openSearch}>
            Buscar disciplina
            <kbd className="kbd hidden lg:inline">/</kbd>
          </button>
          <button type="button" className="btn btn-secondary btn-small sm:hidden" aria-label="Buscar disciplina" onClick={openSearch}>
            Buscar
          </button>
          <Link href="/meu-espaco" className="btn btn-primary btn-small hidden sm:inline-flex">
            Meu espaço
          </Link>
          <button
            type="button"
            className="btn btn-secondary btn-small lg:hidden"
            aria-expanded={menuOpen}
            aria-controls="menu-mobile"
            onClick={onMenu}
          >
            {menuOpen ? "Fechar" : "Menu"}
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav id="menu-mobile" className="border-t border-line bg-white px-3 py-2 lg:hidden" aria-label="Menu">
          {[...links, { href: "/meu-espaco", label: "Meu espaço" }, { href: "/sobre", label: "Sobre o MVP" }, { href: "/avaliar", label: "Avaliar" }].map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                aria-current={isCurrent(pathname, link.href) ? "page" : undefined}
                className="flex min-h-11 items-center rounded-xl px-3 text-[15px] font-semibold text-ink hover:bg-mist"
              >
                {link.label}
              </Link>
            ),
          )}
        </nav>
      ) : null}
    </header>
  );
}
