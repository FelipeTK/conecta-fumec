"use client";

import { DisciplineCard } from "@/components/cards/DisciplineCard";
import { useQueryFilters } from "@/components/use-query-filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container, PageIntro } from "@/components/ui/layout";
import { AREAS } from "@/lib/constants";
import { searchDisciplines } from "@/lib/catalog";
import { useStore } from "@/lib/store";

export function DisciplinesScreen() {
  const { catalog } = useStore();
  const { params, setFilters } = useQueryFilters();
  const query = params.get("q") ?? "";
  const area = params.get("area") ?? "";
  const results = searchDisciplines(catalog, query).filter((item) => !area || item.area === area);

  return (
    <Container>
      <PageIntro
        eyebrow="Catálogo"
        title="Escolha a disciplina."
        description="Dentro dela ficam os grupos abertos, quem quer estudar e os materiais que a turma pode indicar."
      />

      <div className="mb-6 grid gap-3">
        <label>
          <span className="sr-only">Buscar disciplina</span>
          <input
            className="input"
            value={query}
            placeholder="Buscar por nome, código ou curso"
            onChange={(event) => setFilters({ q: event.target.value || null })}
          />
        </label>
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filtrar por área">
          <button type="button" className={area ? "chip" : "chip chip-active"} onClick={() => setFilters({ area: null })}>
            Todas
          </button>
          {AREAS.map((item) => (
            <button
              key={item}
              type="button"
              className={area === item ? "chip chip-active" : "chip"}
              aria-pressed={area === item}
              onClick={() => setFilters({ area: area === item ? null : item })}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <p className="mb-3 text-sm text-muted">
        {results.length} {results.length === 1 ? "disciplina" : "disciplinas"}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="Nenhuma disciplina com esse filtro"
          body="Limpe a busca ou escolha outra área. Os nomes deste protótipo são de demonstração."
          action={
            <button type="button" className="btn btn-secondary" onClick={() => setFilters({ q: null, area: null })}>
              Limpar filtros
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {results.map((discipline) => (
            <li key={discipline.id}>
              <DisciplineCard discipline={discipline} catalog={catalog} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
