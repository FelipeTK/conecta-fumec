"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { MaterialCard } from "@/components/cards/MaterialCard";
import { SignalForm } from "@/components/forms/SignalForm";
import { Breadcrumb, Container, Missing, ScreenFallback } from "@/components/ui/layout";
import { materialById, materialsOf } from "@/lib/catalog";
import { authorshipLabel, formatTimestamp, materialKindLabel, newId, nowIso } from "@/lib/format";
import { useStore } from "@/lib/store";

export function MaterialScreen({ id }: { id: string }) {
  const router = useRouter();
  const store = useStore();
  const material = materialById(store.catalog, id);

  if (!material) {
    if (!store.hydrated && id.startsWith("local-")) return <ScreenFallback />;
    return (
      <Missing
        title="Este material não está no protótipo"
        body="A indicação pode ter sido apagada deste navegador, ou o endereço não faz parte da demonstração."
      />
    );
  }

  const discipline = store.catalog.disciplines.find((item) => item.id === material.disciplineId);
  const request = store.local.materialRequests.find((item) => item.materialId === material.id) ?? null;
  const related = (discipline ? materialsOf(store.catalog, discipline.id) : []).filter((item) => item.id !== material.id).slice(0, 2);

  return (
    <Container>
      <Breadcrumb
        items={[
          { href: "/materiais", label: "Materiais" },
          ...(discipline ? [{ href: `/disciplinas/${discipline.id}`, label: discipline.name }] : []),
          { label: material.title },
        ]}
      />
      {material.origin === "local" ? (
        <p className="mb-4 rounded-2xl bg-blue-soft px-4 py-3 text-sm leading-relaxed text-blue-ink">
          Você indicou este material neste navegador. O arquivo não foi enviado a lugar nenhum.
        </p>
      ) : null}
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <article>
          <div className="flex flex-wrap gap-2">
            <span className="badge">{materialKindLabel[material.kind]}</span>
            <span className={material.authorship === "propria" ? "badge badge-green" : "badge badge-amber"}>
              {authorshipLabel[material.authorship]}
            </span>
            {discipline ? <span className="badge badge-blue">{discipline.code}</span> : null}
          </div>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-balance sm:text-4xl">{material.title}</h1>
          <p className="mt-2 text-sm text-muted">
            Indicado por {material.authorName} · {material.authorCourse} · {formatTimestamp(material.createdAt)}
            {material.pages ? ` · ${material.pages} ${material.pages === 1 ? "página" : "páginas"}` : ""}
          </p>
          {discipline ? (
            <p className="mt-4">
              <Link className="font-semibold text-blue-deep hover:underline" href={`/disciplinas/${discipline.id}`}>
                {discipline.name}
              </Link>
            </p>
          ) : null}
          <div className="mt-6 rounded-3xl bg-white p-5 ring-1 ring-line">
            <h2 className="text-sm font-semibold text-muted">O que este material contém</h2>
            <p className="mt-2 leading-relaxed text-ink">{material.summary}</p>
          </div>
          <dl className="mt-4 space-y-2 text-sm text-ink-soft">
            {material.authorship === "autorizada" && material.authorizedBy ? (
              <div>
                <dt className="font-semibold text-ink">Quem autorizou</dt>
                <dd>{material.authorizedBy}</dd>
              </div>
            ) : (
              <div>
                <dt className="font-semibold text-ink">Autoria</dt>
                <dd>A pessoa que indicou declara que escreveu este material.</dd>
              </div>
            )}
            <div>
              <dt className="font-semibold text-ink">Arquivo</dt>
              <dd>Este protótipo não armazena PDF, slide nem foto de página. O pedido de acesso é só um registro local.</dd>
            </div>
          </dl>
          {related.length > 0 ? (
            <section className="mt-8">
              <h2 className="mb-3 text-lg font-semibold">Outros materiais da disciplina</h2>
              <ul className="grid gap-3">
                {related.map((item) => (
                  <li key={item.id}>
                    <MaterialCard material={item} catalog={store.catalog} />
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
          {material.origin === "local" ? (
            <button
              type="button"
              className="btn btn-danger mt-6"
              onClick={() => {
                store.removeMaterial(material.id);
                router.push("/materiais");
              }}
            >
              Apagar esta indicação
            </button>
          ) : null}
        </article>
        <SignalForm
          title="Pedir acesso"
          description="Quem indicou combinaria a entrega depois. Aqui o pedido fica salvo para você mostrar o fluxo na avaliação."
          submitLabel="Pedir acesso a quem indicou"
          successTitle="Pedido de acesso registrado"
          successBody="Nenhum arquivo foi baixado. Numa versão futura, a pessoa autora receberia este pedido sem ter o contato publicado na página."
          noteLabel="Para que você quer o material"
          noteHint="Opcional. Não inclua e-mail nem telefone."
          already={request}
          onSubmit={(value) =>
            store.addMaterialRequest({
              id: newId(),
              materialId: material.id,
              ...value,
              createdAt: nowIso(),
            })
          }
          onUndo={() => request && store.removeMaterialRequest(request.id)}
        />
      </div>
    </Container>
  );
}
