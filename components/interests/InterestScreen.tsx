"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { InterestCard } from "@/components/cards/InterestCard";
import { Monogram } from "@/components/cards/Monogram";
import { SignalForm } from "@/components/forms/SignalForm";
import { Breadcrumb, Container, Missing, ScreenFallback } from "@/components/ui/layout";
import { interestById, interestsOf } from "@/lib/catalog";
import { formatTimestamp, modalityLabel, newId, nowIso } from "@/lib/format";
import { useStore } from "@/lib/store";

export function InterestScreen({ id }: { id: string }) {
  const router = useRouter();
  const store = useStore();
  const interest = interestById(store.catalog, id);

  if (!interest) {
    if (!store.hydrated && id.startsWith("local-")) return <ScreenFallback />;
    return (
      <Missing
        title="Este interesse não está no protótipo"
        body="Ele pode ter sido apagado deste navegador ou o endereço não corresponde a um registro de demonstração."
      />
    );
  }

  const discipline = store.catalog.disciplines.find((item) => item.id === interest.disciplineId);
  const reply = store.local.interestReplies.find((item) => item.interestId === interest.id) ?? null;
  const related = (discipline ? interestsOf(store.catalog, discipline.id) : []).filter((item) => item.id !== interest.id).slice(0, 2);

  return (
    <Container>
      <Breadcrumb
        items={[
          { href: "/quero-estudar", label: "Quero estudar" },
          ...(discipline ? [{ href: `/disciplinas/${discipline.id}`, label: discipline.name }] : []),
          { label: interest.name },
        ]}
      />
      {interest.origin === "local" ? (
        <p className="mb-4 rounded-2xl bg-blue-soft px-4 py-3 text-sm leading-relaxed text-blue-ink">
          Você publicou este interesse neste navegador. Ele não fica visível para outras pessoas.
        </p>
      ) : null}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article>
          <div className="flex items-start gap-3">
            <Monogram name={interest.name} />
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{interest.name} quer estudar</h1>
              <p className="mt-1 text-ink-soft">
                {interest.course} · {formatTimestamp(interest.createdAt)}
              </p>
            </div>
          </div>
          {discipline ? (
            <p className="mt-6">
              <Link href={`/disciplinas/${discipline.id}`} className="badge badge-blue">
                {discipline.code} · {discipline.name}
              </Link>
            </p>
          ) : null}
          <p className="mt-5 max-w-2xl text-lg leading-relaxed text-ink">{interest.note}</p>
          <dl className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Disponibilidade</dt>
              <dd className="mt-1 font-semibold">{interest.availability}</dd>
            </div>
            <div className="rounded-2xl bg-white px-4 py-3 ring-1 ring-line">
              <dt className="text-xs font-semibold uppercase tracking-wide text-muted">Formato</dt>
              <dd className="mt-1 font-semibold">{modalityLabel[interest.modality]}</dd>
            </div>
          </dl>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            Não há chat. Se você também quer estudar isso, deixe um recado neste navegador. O contato continua privado.
          </p>
          {related.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Na mesma disciplina</h2>
              <ul className="grid gap-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <InterestCard interest={item} catalog={store.catalog} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {interest.origin === "local" ? (
            <button
              type="button"
              className="btn btn-danger mt-6"
              onClick={() => {
                store.removeInterest(interest.id);
                router.push("/quero-estudar");
              }}
            >
              Apagar este interesse
            </button>
          ) : null}
        </article>
        <SignalForm
          title="Também quero estudar isso"
          description="O recado fica ao lado deste interesse, só no seu navegador, para mostrar o fluxo de aproximação."
          submitLabel="Registrar que quero estudar junto"
          successTitle="Recado guardado"
          successBody="Numa versão futura, a outra pessoa veria seu primeiro nome dentro da plataforma, sem e-mail exposto."
          noteLabel="O que você quer combinar"
          noteHint="Pode ficar em branco. Não escreva telefone nem e-mail."
          already={reply}
          onSubmit={(value) =>
            store.addInterestReply({
              id: newId(),
              interestId: interest.id,
              ...value,
              createdAt: nowIso(),
            })
          }
          onUndo={() => reply && store.removeInterestReply(reply.id)}
        />
      </div>
    </Container>
  );
}
