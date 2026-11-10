import Link from "next/link";
import { disciplineActivity } from "@/lib/catalog";
import type { Catalog } from "@/lib/catalog";
import type { Discipline } from "@/lib/types";

export function DisciplineCard({ discipline, catalog }: { discipline: Discipline; catalog: Catalog }) {
  const activity = disciplineActivity(catalog, discipline.id);
  return (
    <Link href={`/disciplinas/${discipline.id}`} className="card-link">
      <span className="flex items-center justify-between gap-3">
        <span className="badge badge-blue">{discipline.code}</span>
        <span className="text-xs font-semibold text-muted">{discipline.area}</span>
      </span>
      <span className="mt-3 block text-lg font-semibold tracking-tight text-ink">{discipline.name}</span>
      <span className="mt-1 block text-sm text-muted">
        {discipline.course} · {discipline.period}
      </span>
      <span className="mt-4 block text-sm font-semibold text-ink-soft">
        {activity.groups} {activity.groups === 1 ? "grupo" : "grupos"} · {activity.interests}{" "}
        {activity.interests === 1 ? "pessoa" : "pessoas"} · {activity.materials}{" "}
        {activity.materials === 1 ? "material" : "materiais"}
      </span>
    </Link>
  );
}
