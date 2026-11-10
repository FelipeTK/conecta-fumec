import Link from "next/link";
import { disciplineById } from "@/lib/catalog";
import type { Catalog } from "@/lib/catalog";
import { authorshipLabel, materialKindLabel } from "@/lib/format";
import type { Material } from "@/lib/types";

export function MaterialCard({ material, catalog }: { material: Material; catalog: Catalog }) {
  const discipline = disciplineById(catalog, material.disciplineId);
  return (
    <Link href={`/materiais/${material.id}`} className="card-link">
      <span className="flex flex-wrap items-center gap-2">
        <span className="badge">{materialKindLabel[material.kind]}</span>
        <span className={material.authorship === "propria" ? "badge badge-green" : "badge badge-amber"}>
          {authorshipLabel[material.authorship]}
        </span>
        {material.origin === "local" ? <span className="badge badge-blue">Neste navegador</span> : null}
      </span>
      <span className="mt-3 block text-lg font-semibold tracking-tight text-ink">{material.title}</span>
      <span className="mt-1 block text-sm text-muted">{discipline?.name}</span>
      <span className="mt-3 line-clamp-3 block text-sm leading-relaxed text-ink-soft">{material.summary}</span>
      <span className="mt-4 block text-sm text-muted">
        Indicado por {material.authorName}
        {material.pages ? ` · ${material.pages} ${material.pages === 1 ? "página" : "páginas"}` : ""}
      </span>
    </Link>
  );
}
