import { groups as seedGroups, interests as seedInterests, materials as seedMaterials, disciplines } from "@/lib/seed";
import { daysFromToday } from "@/lib/format";
import type { Discipline, Group, Interest, LocalState, Material } from "@/lib/types";

export type Catalog = {
  disciplines: Discipline[];
  groups: Group[];
  interests: Interest[];
  materials: Material[];
};

export function buildCatalog(local: LocalState): Catalog {
  return {
    disciplines,
    groups: [...local.groups, ...seedGroups],
    interests: [...local.interests, ...seedInterests],
    materials: [...local.materials, ...seedMaterials],
  };
}

export function disciplineById(catalog: Catalog, id: string): Discipline | undefined {
  return catalog.disciplines.find((item) => item.id === id);
}

export function groupById(catalog: Catalog, id: string): Group | undefined {
  return catalog.groups.find((item) => item.id === id);
}

export function interestById(catalog: Catalog, id: string): Interest | undefined {
  return catalog.interests.find((item) => item.id === id);
}

export function materialById(catalog: Catalog, id: string): Material | undefined {
  return catalog.materials.find((item) => item.id === id);
}

export function groupsOf(catalog: Catalog, disciplineId: string): Group[] {
  return catalog.groups.filter((item) => item.disciplineId === disciplineId).sort(compareBySession);
}

export function interestsOf(catalog: Catalog, disciplineId: string): Interest[] {
  return catalog.interests
    .filter((item) => item.disciplineId === disciplineId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function materialsOf(catalog: Catalog, disciplineId: string): Material[] {
  return catalog.materials
    .filter((item) => item.disciplineId === disciplineId)
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}

export function compareBySession(a: Group, b: Group): number {
  const score = (iso: string) => {
    const diff = daysFromToday(iso);
    return diff < 0 ? 1_000 + Math.abs(diff) : diff;
  };
  const byDate = score(a.nextSession) - score(b.nextSession);
  if (byDate !== 0) return byDate;
  return a.time.localeCompare(b.time);
}

export function disciplineActivity(catalog: Catalog, disciplineId: string) {
  return {
    groups: catalog.groups.filter((item) => item.disciplineId === disciplineId).length,
    interests: catalog.interests.filter((item) => item.disciplineId === disciplineId).length,
    materials: catalog.materials.filter((item) => item.disciplineId === disciplineId).length,
  };
}

export function activityScore(catalog: Catalog, disciplineId: string): number {
  const activity = disciplineActivity(catalog, disciplineId);
  return activity.groups * 3 + activity.interests * 2 + activity.materials;
}

export function popularDisciplines(catalog: Catalog, limit = 6): Discipline[] {
  return [...catalog.disciplines]
    .sort((a, b) => activityScore(catalog, b.id) - activityScore(catalog, a.id))
    .slice(0, limit);
}

export function searchDisciplines(catalog: Catalog, query: string): Discipline[] {
  const term = query.trim().toLocaleLowerCase("pt-BR");
  const sorted = [...catalog.disciplines].sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  if (!term) return sorted;
  return sorted.filter((item) =>
    [item.name, item.code, item.course, item.area, item.period].join(" ").toLocaleLowerCase("pt-BR").includes(term),
  );
}

export function upcomingGroups(catalog: Catalog, limit = 5): Group[] {
  return [...catalog.groups].sort(compareBySession).slice(0, limit);
}
