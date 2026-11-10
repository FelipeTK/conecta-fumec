"use client";

import Link from "next/link";
import { GroupCard } from "@/components/cards/GroupCard";
import { useQueryFilters } from "@/components/use-query-filters";
import { EmptyState } from "@/components/ui/EmptyState";
import { Container, PageIntro } from "@/components/ui/layout";
import { MODALITIES } from "@/lib/constants";
import { compareBySession, disciplineById } from "@/lib/catalog";
import { seatsLeft } from "@/lib/format";
import { disciplines } from "@/lib/seed";
import { useStore } from "@/lib/store";

export function GroupsScreen() {
  const { catalog } = useStore();
  const { params, setFilters } = useQueryFilters();
  const query = (params.get("q") ?? "").trim().toLocaleLowerCase("pt-BR");
  const disciplineId = params.get("disciplina") ?? "";
  const modality = params.get("modalidade") ?? "";
  const onlyOpen = params.get("vaga") === "1";

  const results = catalog.groups
    .filter((group) => {
      const discipline = disciplineById(catalog, group.disciplineId);
      const haystack = [group.title, group.objective, group.organizerName, discipline?.name, discipline?.code]
        .join(" ")
        .toLocaleLowerCase("pt-BR");
      if (query && !haystack.includes(query)) return false;
      if (disciplineId && group.disciplineId !== disciplineId) return false;
      if (modality && group.modality !== modality) return false;
      if (onlyOpen && seatsLeft(group.capacity, group.filled) === 0) return false;
      return true;
    })
    .sort(compareBySession);

  const activeDiscipline = disciplines.find((item) => item.id === disciplineId);

  return (
    <Container>
      <PageIntro
        eyebrow="Grupos de estudo"
        title="Encontros já combinados."
        description="Filtre pela sua disciplina, pelo formato e pelas vagas. Manifestar interesse não publica seu contato."
        actions={
          <Link className="btn btn-primary" href={disciplineId ? `/grupos/novo?disciplina=${disciplineId}` : "/grupos/novo"}>
            Criar grupo
          </Link>
        }
      />

      <div className="mb-6 grid gap-3">
        <div className="grid gap-3 md:grid-cols-[1fr_16rem]">
          <label>
            <span className="sr-only">Buscar grupo</span>
            <input
              className="input"
              value={params.get("q") ?? ""}
              placeholder="Buscar por nome do grupo ou disciplina"
              onChange={(event) => setFilters({ q: event.target.value || null })}
            />
          </label>
          <label>
            <span className="sr-only">Disciplina</span>
            <select className="select" value={disciplineId} onChange={(event) => setFilters({ disciplina: event.target.value || null })}>
              <option value="">Todas as disciplinas</option>
              {disciplines.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.code} · {item.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <div className="flex flex-wrap gap-2">
          {MODALITIES.map((item) => (
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
          <button
            type="button"
            className={onlyOpen ? "chip chip-active" : "chip"}
            aria-pressed={onlyOpen}
            onClick={() => setFilters({ vaga: onlyOpen ? null : "1" })}
          >
            Com vaga
          </button>
        </div>
      </div>

      <p className="mb-3 text-sm text-muted">
        {results.length} {results.length === 1 ? "grupo" : "grupos"}
        {activeDiscipline ? ` em ${activeDiscipline.name}` : ""}
      </p>

      {results.length === 0 ? (
        <EmptyState
          title="Nenhum grupo com esses filtros"
          body="Abra um grupo da sua disciplina ou limpe os filtros para ver o cenário de demonstração."
          action={
            <button type="button" className="btn btn-secondary" onClick={() => setFilters({ q: null, disciplina: null, modalidade: null, vaga: null })}>
              Limpar filtros
            </button>
          }
        />
      ) : (
        <ul className="grid gap-3 md:grid-cols-2">
          {results.map((group) => (
            <li key={group.id}>
              <GroupCard group={group} catalog={catalog} />
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
}
