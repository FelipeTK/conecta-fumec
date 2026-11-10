"use client";

import Link from "next/link";
import { DisciplineCard } from "@/components/cards/DisciplineCard";
import { GroupAgendaRow } from "@/components/cards/GroupCard";
import { useSearch } from "@/components/shell/search-context";
import { Container } from "@/components/ui/layout";
import { disciplineById, popularDisciplines, upcomingGroups } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function HomeScreen() {
  const { openSearch } = useSearch();
  const { catalog, local } = useStore();
  const upcoming = upcomingGroups(catalog, 5);
  const popular = popularDisciplines(catalog, 6);
  const saved = local.savedDisciplineIds
    .map((id) => disciplineById(catalog, id))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));

  return (
    <Container>
      <section className="grid items-stretch gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(18rem,0.75fr)]">
        <div className="pt-2">
          <p className="text-sm font-semibold text-blue-deep">Universidade FUMEC · colaboração acadêmica</p>
          <h1 className="mt-3 max-w-xl text-4xl font-semibold tracking-[-0.035em] text-balance text-ink sm:text-5xl sm:leading-[1.08]">
            Achar com quem estudar, na mesma disciplina.
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-pretty text-ink-soft">
            Grupos de estudo, gente querendo companhia e materiais de autoria própria ou com autorização. Tudo
            organizado pela disciplina, sem espalhar contato pessoal.
          </p>
          <button
            type="button"
            onClick={openSearch}
            className="mt-6 flex w-full max-w-xl items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3 text-left shadow-[0_8px_30px_rgba(20,32,43,0.04)] hover:border-[#8ecae4]"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full bg-blue-soft text-blue-ink" aria-hidden="true">
              <svg viewBox="0 0 24 24" className="size-5">
                <circle cx="11" cy="11" r="6.25" fill="none" stroke="currentColor" strokeWidth="1.8" />
                <path d="M16 16.5 20 20.5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </span>
            <span>
              <span className="block text-sm font-semibold text-ink">Buscar uma disciplina</span>
              <span className="block text-sm text-muted">Ex.: Banco de Dados ou SI305</span>
            </span>
            <kbd className="kbd ml-auto hidden sm:inline">/</kbd>
          </button>
          <div className="mt-4 flex flex-wrap gap-2">
            {popular.slice(0, 4).map((item) => (
              <Link key={item.id} href={`/disciplinas/${item.id}`} className="chip">
                {item.name}
              </Link>
            ))}
          </div>
        </div>

        <aside className="panel-dark flex flex-col p-6 sm:p-7">
          <p className="text-sm font-semibold text-white/70">Três caminhos</p>
          <ol className="mt-4 space-y-4">
            <Path n="1" href="/grupos" title="Entrar num grupo" text="Veja horário, lugar e quantas vagas ainda cabem." />
            <Path n="2" href="/quero-estudar" title="Dizer que quer estudar" text="Publique seu horário sem formar um grupo ainda." />
            <Path n="3" href="/materiais" title="Indicar um material" text="Só autoria própria ou uso autorizado pela pessoa autora." />
          </ol>
        </aside>
      </section>

      {saved.length > 0 ? (
        <section className="mt-12">
          <h2 className="text-sm font-semibold text-blue-deep">Disciplinas que você acompanha</h2>
          <ul className="mt-3 flex flex-wrap gap-2">
            {saved.map((item) => (
              <li key={item.id}>
                <Link href={`/disciplinas/${item.id}`} className="chip chip-active">
                  {item.code} · {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Próximos encontros</h2>
            <p className="mt-1 text-sm text-muted">O que já está marcado no cenário de demonstração.</p>
          </div>
          <Link href="/grupos" className="btn btn-quiet btn-small">
            Todos os grupos
          </Link>
        </div>
        <ol className="card divide-y divide-line overflow-hidden">
          {upcoming.map((group) => (
            <GroupAgendaRow key={group.id} group={group} catalog={catalog} />
          ))}
        </ol>
      </section>

      <section className="mt-14">
        <div className="mb-4 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-tight">Disciplinas em movimento</h2>
            <p className="mt-1 text-sm text-muted">Cada uma reúne grupos, pessoas e materiais no mesmo lugar.</p>
          </div>
          <Link href="/disciplinas" className="btn btn-quiet btn-small">
            Ver todas
          </Link>
        </div>
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {popular.map((discipline) => (
            <li key={discipline.id}>
              <DisciplineCard discipline={discipline} catalog={catalog} />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-14 grid gap-3 md:grid-cols-3">
        <Principle title="Só o primeiro nome" text="O protótipo não pede e-mail, telefone nem matrícula. O contato público fica de fora." />
        <Principle title="Material com permissão" text="Dá para indicar o que você escreveu ou o que a pessoa autora autorizou. Livro escaneado não entra." />
        <Principle
          title="Nada sai deste navegador"
          text="Não há servidor. O que você publica aparece para a demonstração e pode ser apagado em Meu espaço."
        />
      </section>
    </Container>
  );
}

function Path({ n, href, title, text }: { n: string; href: string; title: string; text: string }) {
  return (
    <li>
      <Link href={href} className="group block rounded-2xl p-1">
        <span className="text-xs font-semibold text-[#9ed8f2]">0{n}</span>
        <span className="mt-1 flex items-center justify-between gap-3">
          <span className="text-lg font-semibold">{title}</span>
          <span aria-hidden="true" className="text-white/70 transition group-hover:translate-x-0.5">
            →
          </span>
        </span>
        <span className="mt-1 block text-sm leading-relaxed text-white/75">{text}</span>
      </Link>
    </li>
  );
}

function Principle({ title, text }: { title: string; text: string }) {
  return (
    <article className="rounded-3xl bg-white px-5 py-5 ring-1 ring-line">
      <h3 className="font-semibold text-ink">{title}</h3>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{text}</p>
    </article>
  );
}
