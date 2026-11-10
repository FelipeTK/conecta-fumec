import Link from "next/link";
import { disciplineById } from "@/lib/catalog";
import type { Catalog } from "@/lib/catalog";
import { formatTime, formatWeekdays, joinMeta, seatLabel, seatsLeft, sessionMark } from "@/lib/format";
import type { Group } from "@/lib/types";

export function GroupCard({ group, catalog }: { group: Group; catalog: Catalog }) {
  const discipline = disciplineById(catalog, group.disciplineId);
  const left = seatsLeft(group.capacity, group.filled);
  return (
    <Link href={`/grupos/${group.id}`} className="card-link">
      <span className="flex flex-wrap items-center gap-2">
        {discipline ? <span className="badge badge-blue">{discipline.code}</span> : null}
        <span className="badge">{group.modality === "presencial" ? "Presencial" : group.modality === "online" ? "Online" : "Híbrido"}</span>
        {group.origin === "local" ? <span className="badge badge-amber">Neste navegador</span> : null}
      </span>
      <span className="mt-3 block text-lg font-semibold tracking-tight text-ink">{group.title}</span>
      <span className="mt-1 block text-sm text-muted">{discipline?.name}</span>
      <span className="mt-4 block text-sm leading-relaxed text-ink-soft">
        {joinMeta([formatWeekdays(group.weekdays), formatTime(group.time), group.place.split(".")[0]])}
      </span>
      <span className="mt-4 flex items-center justify-between gap-3 text-sm">
        <span className="text-muted">
          Organiza {group.organizerName}
        </span>
        <span className={`font-semibold ${left === 0 ? "text-muted" : "text-blue-ink"}`}>{seatLabel(group.capacity, group.filled)}</span>
      </span>
    </Link>
  );
}

export function GroupAgendaRow({ group, catalog }: { group: Group; catalog: Catalog }) {
  const discipline = disciplineById(catalog, group.disciplineId);
  const mark = sessionMark(group.nextSession, group.weekdays);
  return (
    <li>
      <Link href={`/grupos/${group.id}`} className="grid grid-cols-[4.25rem_1fr] gap-4 px-4 py-4 hover:bg-mist sm:grid-cols-[4.75rem_1fr_auto] sm:px-5">
        <span className="tabular">
          <span className="block text-2xl font-semibold leading-none text-ink">{mark.day}</span>
          <span className="mt-1 block text-xs font-semibold uppercase text-muted">{mark.month}</span>
          <span className="mt-1 block text-xs font-semibold text-blue-deep">{mark.caption}</span>
        </span>
        <span className="min-w-0">
          <span className="block font-semibold text-ink">{group.title}</span>
          <span className="mt-1 block text-sm text-muted">
            {joinMeta([discipline?.name, formatWeekdays(group.weekdays), formatTime(group.time)])}
          </span>
        </span>
        <span className="hidden self-center text-sm font-semibold text-blue-ink sm:block">
          {seatLabel(group.capacity, group.filled)}
        </span>
      </Link>
    </li>
  );
}
