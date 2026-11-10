"use client";

import Link from "next/link";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { useQueryFilters } from "@/components/use-query-filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container, PageIntro } from "@/components/ui/layout";
import { MATERIAL_KINDS } from "@/lib/constants";
import { disciplineById } from "@/lib/catalog";
import { disciplines } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function MaterialsScreen() {
  const { catalog } = useStore();
  const { params, setFilters } = useQueryFilters();
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase("pt-BR");
  const disciplineId = params.get("disciplina") ?? "";
  const kind = params.get("tipo") ?? "";
  const authorship = params.get("autoria") ?? "";

  const results = [...catalog.materials]
    .filter((material) => {
      const discipline = disciplineById(catalog, material.disciplineId);
      const haystack = [material.title, material.summary, material.authorName, discipline?.name, discipline?.code]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      if (query && !haystack.includes(query)) return false;
      if (disciplineId && material.disciplineId !== disciplineId) return false;
      if (kind && material.kind !== kind) return false;
      if (authorship && material.authorship !== authorship) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Container>
      <PageIntro
        eyebrow="Materiais autorizados"
        title="O que a turma pode indicar."
        description="Cada item é uma indicação, não um arquivo. Entram resumos e listas de autoria própria, ou materiais com autorização de quem os escreveu."
        actions={
          <Link className="btn btn-primary" href={disciplineId ? `/materiais/indicar?disciplina=${disciplineId}` : "/materiais/indicar"}>
            Indicar material
          </Link>
        }
      />
      <div className="mb-6 grid gap-3">
        <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
          <input
            className="input"
            aria-label="Buscar material"
            value={params.get("q") ?? ""}
            placeholder="Buscar por título ou disciplina"
            onChange={(event) => setFilters({ q: event.target.value || null })}
          />
          <select className="select" aria-label="Disciplina" value={disciplineId} onChange={(event) => setFilters({ disciplina: event.target.value || null })}>
            <option value="">Todas as disciplinas</option>
            {disciplines.map((item) => (
              <option key={item.id} value={item.id}>
                {item.code} · {item.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-wrap gap-2">
          {MATERIAL_KINDS.map((item) => (
            <button
              key={item.id}
              type="button"
              className={kind === item.id ? "chip chip-active" : "chip"}
              aria-pressed={kind === item.id}
              onClick={() => setFilters({ tipo: kind === item.id ? null : item.id })}
            >
              {item.title}
            </button>
          ))}
          <button type="button" className={authorship === "propria" ? "chip chip-active" : "chip"} aria-pressed={authorship === "propria"} onClick={() => setFilters({ autoria: authorship === "propria" ? null : "propria" })}>
            Autoria própria
          </button>
          <button type="button" className={authorship === "autorizada" ? "chip chip-active" : "chip"} aria-pressed={authorship === "autorizada"} onClick={() => setFilters({ autoria: authorship === "autorizada" ? null : "autorizada" })}>
            Uso autorizado
          </button>
        </div>
      </div>
      <p className="mb-3 text-sm text-muted">
        {results.length} {results.length === 1 ? "material" : "materiais"}
      </p>
      {results.length === 0 ? (
        <EmptyState
          title="Nenhum material com esses filtros"
          body="Indique um material seu ou limpe os filtros."
          action={
            <button type="button" className="btn btn-secondary" onClick={() => setFilters({ q: null, disciplina: null, tipo: null, autoria: null })}>
              Limpar filtros
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {results.map((material) => (
            <li key={material.id}>
              <MaterialCard material={material} catalog={catalog} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
