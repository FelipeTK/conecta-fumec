import Link from "next/link";
import { Mark } from "@/components/shell/Mark";

export function Footer() {
  return (
    <footer className="mt-8 border-t border-line bg-white">
      <div className="mx-auto grid max-w-[1120px] gap-8 px-5 py-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <Mark className="size-8" />
            <p className="font-semibold">FUMEC Conecta</p>
          </div>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-ink-soft">
            Protótipo navegável do MVP de colaboração acadêmica. Disciplinas, grupos, nomes e materiais são fictícios e
            servem só para demonstrar os fluxos.
          </p>
        </div>
        <div>
          <p className="text-sm font-semibold">Percorrer</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/disciplinas">Disciplinas</Link></li>
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/grupos">Grupos de estudo</Link></li>
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/quero-estudar">Quero estudar</Link></li>
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/materiais">Materiais autorizados</Link></li>
          </ul>
        </div>
        <div>
          <p className="text-sm font-semibold">Projeto</p>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/sobre">Sobre o MVP</Link></li>
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/avaliar">Avaliar o protótipo</Link></li>
            <li><Link className="text-ink-soft hover:text-blue-deep" href="/meu-espaco">Meu espaço neste navegador</Link></li>
          </ul>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Projeto Integrador IV · Sistemas de Informação · Universidade FUMEC · Felipe Rodrigues dos Santos · 2026
          </p>
        </div>
      </div>
    </footer>
  );
}
