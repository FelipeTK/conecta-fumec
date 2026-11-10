"use client";

import Link from "next/link";
import { InterestCard } from "@/components/cards/InterestCard";
import { useQueryFilters } from "@/components/use-query-filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container, PageIntro } from "@/components/ui/layout";
import { MODALITY_PREFERENCES } from "@/lib/constants";
import { disciplineById } from "@/lib/catalog";
import { disciplines } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function InterestsScreen() {
  const { catalog } = useStore();
  const { params, setFilters } = useQueryFilters();
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase("pt-BR");
  const disciplineId = params.get("disciplina") ?? "";
  const modality = params.get("modalidade") ?? "";

  const results = [...catalog.interests]
    .filter((interest) => {
      const discipline = disciplineById(catalog, interest.disciplineId);
      const haystack = [interest.name, interest.note, interest.availability, interest.course, discipline?.name, discipline?.code]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      if (query && !haystack.includes(query)) return false;
      if (disciplineId && interest.disciplineId !== disciplineId) return false;
      if (modality && interest.modality !== modality) return false;
      return true;
    })
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

  return (
    <Container>
      <PageIntro
        eyebrow="Quero estudar"
        title="Gente no mesmo ponto que você."
        description="Ainda não é um grupo. É um aviso: esta pessoa quer companhia numa disciplina, num horário e num formato."
        actions={
          <Link className="btn btn-primary" href={disciplineId ? `/quero-estudar/novo?disciplina=${disciplineId}` : "/quero-estudar/novo"}>
            Publicar interesse
          </Link>
        }
      />
      <div className="mb-6 grid gap-3">
        <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
          <input
            className="input"
            aria-label="Buscar interesse"
            value={params.get("q") ?? ""}
            placeholder="Buscar por disciplina ou pelo que a pessoa quer estudar"
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
          {MODALITY_PREFERENCES.map((item) => (
            <button
              key={item.id}
              type="button"
              className={modality === item.id ? "chip chip-active" : "chip"}
              aria-pressed={modality === item.id}
              onClick={() => setFilters({ modalidade: modality === item.id ? null : item.id })}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>
      <p className="mb-3 text-sm text-muted">
        {results.length} {results.length === 1 ? "interesse" : "interesses"}
      </p>
      {results.length === 0 ? (
        <EmptyState
          title="Ninguém publicado com esses filtros"
          body="Publique o seu horário ou limpe a busca para ver o cenário de demonstração."
          action={
            <button type="button" className="btn btn-secondary" onClick={() => setFilters({ q: null, disciplina: null, modalidade: null })}>
              Limpar filtros
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {results.map((interest) => (
            <li key={interest.id}>
              <InterestCard interest={interest} catalog={catalog} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
