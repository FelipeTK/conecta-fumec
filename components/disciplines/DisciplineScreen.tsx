"use client";

import Link from "next/link";
import { GroupCard } from "@/components/cards/GroupCard";
import { InterestCard } from "@/components/cards/InterestCard";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { EmptyState } from "@/components/ui/EmptyState";
import { Breadcrumb, Container } from "@/components/ui/layout";
import { groupsOf, interestsOf, materialsOf } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import type { Discipline } from "@/lib/types";

export function DisciplineScreen({ discipline }: { discipline: Discipline }) {
  const store = useStore();
  const { catalog } = store;
  const groups = groupsOf(catalog, discipline.id);
  const interests = interestsOf(catalog, discipline.id);
  const materials = materialsOf(catalog, discipline.id);
  const saved = store.local.savedDisciplineIds.includes(discipline.id);
  const base = `disciplina=${discipline.id}`;

  return (
    <>
      <Container className="pb-5 pt-8 sm:pt-10">
        <Breadcrumb
          items={[
            { href: "/", label: "Início" },
            { href: "/disciplinas", label: "Disciplinas" },
            { label: discipline.name },
          ]}
        />
        <p className="text-sm font-semibold text-blue-deep">
          {discipline.code} · {discipline.course} · {discipline.period}
        </p>
        <div className="mt-2 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-semibold tracking-[-0.03em] text-balance sm:text-4xl">{discipline.name}</h1>
            <p className="mt-3 leading-relaxed text-ink-soft">{discipline.summary}</p>
            <p className="mt-2 text-sm text-muted">{discipline.campus}</p>
          </div>
          <button
            type="button"
            className={saved ? "btn btn-secondary" : "btn btn-primary"}
            aria-pressed={saved}
            onClick={() => store.toggleSavedDiscipline(discipline.id)}
          >
            {saved ? "Acompanhando" : "Acompanhar disciplina"}
          </button>
        </div>
      </Container>

      <div className="top-shell sticky z-30 border-y border-line bg-canvas/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1120px] flex-col gap-3 px-5 py-3 lg:flex-row lg:items-center lg:justify-between">
          <nav aria-label="Nesta disciplina" className="flex gap-1 overflow-auto">
            <a className="chip" href="#grupos">
              Grupos {groups.length}
            </a>
            <a className="chip" href="#interessados">
              Quero estudar {interests.length}
            </a>
            <a className="chip" href="#materiais">
              Materiais {materials.length}
            </a>
          </nav>
          <div className="flex flex-wrap gap-2">
            <Link className="btn btn-secondary btn-small" href={`/grupos/novo?${base}`}>
              Criar grupo
            </Link>
            <Link className="btn btn-secondary btn-small" href={`/quero-estudar/novo?${base}`}>
              Quero estudar
            </Link>
            <Link className="btn btn-primary btn-small" href={`/materiais/indicar?${base}`}>
              Indicar material
            </Link>
          </div>
        </div>
      </div>

      <Container className="space-y-14 py-8 sm:py-10">
        <section id="grupos" className="anchor-section">
          <SectionTitle title="Grupos de estudo" count={groups.length} href={`/grupos?disciplina=${discipline.id}`} action="Ver na lista geral" />
          {groups.length === 0 ? (
            <EmptyState
              title="Nenhum grupo nesta disciplina"
              body="Se a turma ainda não marcou horário, você pode abrir o primeiro. O grupo fica só neste navegador."
              action={
                <Link className="btn btn-primary" href={`/grupos/novo?${base}`}>
                  Criar grupo
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {groups.map((group) => (
                <li key={group.id}>
                  <GroupCard group={group} catalog={catalog} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="interessados" className="anchor-section">
          <SectionTitle
            title="Quem quer estudar"
            count={interests.length}
            href={`/quero-estudar?disciplina=${discipline.id}`}
            action="Ver todos os interesses"
          />
          {interests.length === 0 ? (
            <EmptyState
              title="Ninguém publicou interesse ainda"
              body="Dá para dizer seu horário e o que você quer praticar, sem criar um grupo."
              action={
                <Link className="btn btn-primary" href={`/quero-estudar/novo?${base}`}>
                  Quero estudar
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {interests.map((interest) => (
                <li key={interest.id}>
                  <InterestCard interest={interest} catalog={catalog} />
                </li>
              ))}
            </ul>
          )}
        </section>

        <section id="materiais" className="anchor-section">
          <SectionTitle
            title="Materiais indicados"
            count={materials.length}
            href={`/materiais?disciplina=${discipline.id}`}
            action="Ver a biblioteca"
          />
          {materials.length === 0 ? (
            <EmptyState
              title="Nenhum material indicado"
              body="Indique um resumo, mapa ou lista de sua autoria, ou um material cuja autora autorizou o uso."
              action={
                <Link className="btn btn-primary" href={`/materiais/indicar?${base}`}>
                  Indicar material
                </Link>
              }
            />
          ) : (
            <ul className="grid gap-3 md:grid-cols-2">
              {materials.map((material) => (
                <li key={material.id}>
                  <MaterialCard material={material} catalog={catalog} />
                </li>
              ))}
            </ul>
          )}
        </section>
      </Container>
    </>
  );
}

function SectionTitle({ title, count, href, action }: { title: string; count: number; href: string; action: string }) {
  return (
    <div className="mb-4 flex items-end justify-between gap-3">
      <h2 className="text-2xl font-semibold tracking-tight">
        {title} <span className="tabular text-muted">{count}</span>
      </h2>
      <Link href={href} className="btn btn-quiet btn-small">
        {action}
      </Link>
    </div>
  );
}
