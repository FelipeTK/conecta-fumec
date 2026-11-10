"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { Monogram } from "@/components/cards/Monogram";
import { SignalForm } from "@/components/forms/SignalForm";
import { Breadcrumb, Container, Missing, ScreenFallback } from "@/components/ui/layout";
import { groupById, groupsOf, materialById } from "@/lib/catalog";
import {
  formatLongDate,
  formatTime,
  formatWeekdays,
  modalityLabel,
  newId,
  nowIso,
  peopleLabel,
  seatLabel,
  seatsLeft,
} from "@/lib/format";
import { useStore } from "@/lib/store";

export function GroupScreen({ id }: { id: string }) {
  const router = useRouter();
  const store = useStore();
  const group = groupById(store.catalog, id);

  if (!group) {
    if (!store.hydrated && id.startsWith("local-")) return <ScreenFallback />;
    return (
      <Missing
        title="Este grupo não está no protótipo"
        body="Ele pode ter sido apagado deste navegador ou o endereço não corresponde a um grupo de demonstração."
      />
    );
  }

  const discipline = store.catalog.disciplines.find((item) => item.id === group.disciplineId);
  const request = store.local.groupRequests.find((item) => item.groupId === group.id) ?? null;
  const linked = group.materialIds
    .map((materialId) => materialById(store.catalog, materialId))
    .filter((item): item is NonNullable<typeof item> => Boolean(item));
  const siblings = groupsOf(store.catalog, group.disciplineId).filter((item) => item.id !== group.id);
  const left = seatsLeft(group.capacity, group.filled);

  return (
    <Container>
      <Breadcrumb
        items={[
          { href: "/grupos", label: "Grupos" },
          ...(discipline ? [{ href: `/disciplinas/${discipline.id}`, label: discipline.name }] : []),
          { label: group.title },
        ]}
      />

      {group.origin === "local" ? (
        <p className="mb-4 rounded-2xl bg-blue-soft px-4 py-3 text-sm leading-relaxed text-blue-ink">
          Você publicou este grupo neste navegador. Outras pessoas não o veem, porque o protótipo não tem servidor.
        </p>
      ) : null}

      <div className="flex flex-wrap items-center gap-2">
        {discipline ? <span className="badge badge-blue">{discipline.code}</span> : null}
        <span className="badge">{modalityLabel[group.modality]}</span>
        {group.focus.map((item) => (
          <span key={item} className="badge">
            {item}
          </span>
        ))}
      </div>
      <h1 className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{group.title}</h1>
      <p className="mt-3 max-w-2xl text-lg leading-relaxed text-ink-soft">{group.objective}</p>

      <dl className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Fact label="Quando" value={`${formatWeekdays(group.weekdays)} · ${formatTime(group.time)}`} detail={formatLongDate(group.nextSession)} />
        <Fact label="Onde" value={modalityLabel[group.modality]} detail={group.place} />
        <Fact label="Vagas" value={seatLabel(group.capacity, group.filled)} detail={`${peopleLabel(group.filled)} de ${group.capacity}`} />
        <Fact label="Organiza" value={group.organizerName} detail={group.organizerCourse} />
      </dl>

      <div className="mt-8 grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-6">
          <section className="card p-5">
            <h2 className="text-lg font-semibold">Como o encontro funciona</h2>
            <p className="mt-2 text-sm leading-relaxed text-ink-soft">
              {left === 0
                ? "No cenário de demonstração este grupo está lotado. Seu interesse entra como lista de espera e continua só neste navegador."
                : "Quem organiza combina a presença. Este protótipo registra o seu interesse e não abre conversa nem mostra telefone."}
            </p>
            <div className="mt-4 flex items-center gap-3">
              <Monogram name={group.organizerName} />
              <p className="text-sm">
                <span className="block font-semibold">{group.organizerName}</span>
                <span className="text-muted">{group.organizerCourse}</span>
              </p>
            </div>
          </section>

          {linked.length > 0 ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Materiais ligados a este grupo</h2>
              <ul className="grid gap-3">
                {linked.map((material) => (
                  <li key={material.id}>
                    <MaterialCard material={material} catalog={store.catalog} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {siblings.length > 0 && discipline ? (
            <section>
              <h2 className="mb-3 text-lg font-semibold">Outros grupos de {discipline.name}</h2>
              <ul className="space-y-2">
                {siblings.map((item) => (
                  <li key={item.id}>
                    <Link href={`/grupos/${item.id}`} className="block rounded-2xl border border-line bg-white px-4 py-3 hover:border-[#8ecae4]">
                      <span className="font-semibold">{item.title}</span>
                      <span className="mt-1 block text-sm text-muted">
                        {formatWeekdays(item.weekdays)} · {formatTime(item.time)} · {seatLabel(item.capacity, item.filled)}
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {group.origin === "local" ? (
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => {
                store.removeGroup(group.id);
                router.push("/grupos");
              }}
            >
              Apagar este grupo do navegador
            </button>
          ) : null}
        </div>

        <SignalForm
          title="Quero participar"
          description="Seu primeiro nome e seu curso ficam neste navegador. Quem organiza não recebe e-mail nesta versão."
          submitLabel="Manifestar interesse"
          successTitle="Interesse registrado"
          successBody="Numa versão futura, quem organiza veria este pedido dentro da plataforma, sem o seu telefone publicado."
          noteLabel="Recado opcional"
          noteHint="Diga em que ponto você está. Sem contato pessoal."
          already={request}
          onSubmit={(value) =>
            store.addGroupRequest({
              id: newId(),
              groupId: group.id,
              ...value,
              createdAt: nowIso(),
            })
          }
          onUndo={() => request && store.removeGroupRequest(request.id)}
        />
      </div>
    </Container>
  );
}

function Fact({ label, value, detail }: { label: string; value: string; detail: string }) {
  return (
    <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-1 font-semibold text-ink">{value}</dd>
      <dd className="mt-1 text-sm leading-relaxed text-ink-soft">{detail}</dd>
    </div>
  );
}
