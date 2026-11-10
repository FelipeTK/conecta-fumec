import Link from "next/link";
import { disciplineById } from "@/lib/catalog";
import type { Catalog } from "@/lib/catalog";
import { formatTimestamp, modalityLabel } from "@/lib/format";
import { Monogram } from "@/components/cards/Monogram";
import type { Interest } from "@/lib/types";

export function InterestCard({ interest, catalog }: { interest: Interest; catalog: Catalog }) {
  const discipline = disciplineById(catalog, interest.disciplineId);
  return (
    <Link href={`/quero-estudar/${interest.id}`} className="card-link">
      <span className="flex items-start gap-3">
        <Monogram name={interest.name} />
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-ink">{interest.name}</span>
            {interest.origin === "local" ? <span className="badge badge-amber">Neste navegador</span> : null}
          </span>
          <span className="mt-0.5 block text-sm text-muted">
            {interest.course} · {formatTimestamp(interest.createdAt)}
          </span>
        </span>
      </span>
      <span className="mt-4 block text-sm font-semibold text-blue-ink">{discipline?.name}</span>
      <span className="mt-2 block text-sm leading-relaxed text-ink-soft">{interest.note}</span>
      <span className="mt-4 block text-sm text-muted">
        {interest.availability} · {modalityLabel[interest.modality]}
      </span>
    </Link>
  );
}
