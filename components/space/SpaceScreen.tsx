"use client";

import Link from "next/link";
import { useState } from "react";
import { CopyButton } from "@/components/ui/CopyButton";
import { Container, PageIntro } from "@/components/ui/layout";
import { disciplineById, groupById, interestById, materialById } from "@/lib/catalog";
import { evaluationPlainText } from "@/lib/evaluation";
import { formatTimestamp } from "@/lib/format";
import { useStore } from "@/lib/store";

export function SpaceScreen() {
  const store = useStore();
  const { local, catalog } = store;
  const [confirmReset, setConfirmReset] = useState(false);
  const saved = catalog.disciplines.filter((item) => local.savedDisciplineIds.includes(item.id));
  const total =
    saved.length +
    local.groups.length +
    local.interests.length +
    local.materials.length +
    local.groupRequests.length +
    local.interestReplies.length +
    local.materialRequests.length +
    local.evaluations.length;

  return (
    <Container>
      <PageIntro
        eyebrow="Neste navegador"
        title="Meu espaço"
        description="Aqui fica o que você fez no protótipo: disciplinas acompanhadas, grupos, interesses, materiais e a avaliação. Nada disso vai para um servidor."
        actions={
          total > 0 ? (
            confirmReset ? (
              <span className="flex flex-wrap gap-2">
                <button type="button" className="btn btn-danger" onClick={() => store.resetLocal()}>
                  Apagar agora
                </button>
                <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(false)}>
                  Manter
                </button>
              </span>
            ) : (
              <button type="button" className="btn btn-secondary" onClick={() => setConfirmReset(true)}>
                Limpar este navegador
              </button>
            )
          ) : null
        }
      />

      {total === 0 ? (
        <div className="card p-6 sm:p-8">
          <h2 className="text-xl font-semibold">Ainda não há nada seu aqui</h2>
          <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">
            Percorra um fluxo e volte. O registro aparece na hora e continua depois de atualizar a página.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            <Link className="btn btn-primary" href="/disciplinas/banco-de-dados">
              Começar por Banco de Dados
            </Link>
            <Link className="btn btn-secondary" href="/avaliar">
              Roteiro de avaliação
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <Section title="Disciplinas acompanhadas" empty="Nenhuma. Na página da disciplina, use Acompanhar.">
            {saved.map((item) => (
              <Row key={item.id} href={`/disciplinas/${item.id}`} title={`${item.code} · ${item.name}`} meta={item.course} action={
                <button type="button" className="btn btn-quiet btn-small" onClick={() => store.toggleSavedDiscipline(item.id)}>
                  Remover
                </button>
              } />
            ))}
          </Section>

          <Section title="Grupos que você publicou" empty="Nenhum grupo publicado neste navegador.">
            {local.groups.map((group) => (
              <Row
                key={group.id}
                href={`/grupos/${group.id}`}
                title={group.title}
                meta={disciplineById(catalog, group.disciplineId)?.name}
                action={
                  <button type="button" className="btn btn-quiet btn-small" onClick={() => store.removeGroup(group.id)}>
                    Apagar
                  </button>
                }
              />
            ))}
          </Section>

          <Section title="Interesse em participar de um grupo" empty="Você ainda não pediu vaga.">
            {local.groupRequests.map((request) => {
              const group = groupById(catalog, request.groupId);
              return (
                <Row
                  key={request.id}
                  href={group ? `/grupos/${group.id}` : "/grupos"}
                  title={group ? group.title : "Grupo removido"}
                  meta={`${request.name} · ${formatTimestamp(request.createdAt)}`}
                  action={
                    <button type="button" className="btn btn-quiet btn-small" onClick={() => store.removeGroupRequest(request.id)}>
                      Desfazer
                    </button>
                  }
                />
              );
            })}
          </Section>

          <Section title="Interesses que você publicou" empty="Nenhum aviso de que você quer estudar.">
            {local.interests.map((interest) => (
              <Row
                key={interest.id}
                href={`/quero-estudar/${interest.id}`}
                title={disciplineById(catalog, interest.disciplineId)?.name ?? "Disciplina"}
                meta={interest.availability}
                action={
                  <button type="button" className="btn btn-quiet btn-small" onClick={() => store.removeInterest(interest.id)}>
                    Apagar
                  </button>
                }
              />
            ))}
          </Section>

          <Section title="Recados para quem quer estudar" empty="Você ainda não respondeu a um interesse.">
            {local.interestReplies.map((reply) => {
              const interest = interestById(catalog, reply.interestId);
              return (
                <Row
                  key={reply.id}
                  href={interest ? `/quero-estudar/${interest.id}` : "/quero-estudar"}
                  title={interest ? `${interest.name} · ${disciplineById(catalog, interest.disciplineId)?.name ?? ""}` : "Interesse removido"}
                  meta={formatTimestamp(reply.createdAt)}
                  action={
                    <button type="button" className="btn btn-quiet btn-small" onClick={() => store.removeInterestReply(reply.id)}>
                      Desfazer
                    </button>
                  }
                />
              );
            })}
          </Section>

          <Section title="Materiais que você indicou" empty="Nenhuma indicação publicada neste navegador.">
            {local.materials.map((material) => (
              <Row
                key={material.id}
                href={`/materiais/${material.id}`}
                title={material.title}
                meta={disciplineById(catalog, material.disciplineId)?.name}
                action={
                  <button type="button" className="btn btn-quiet btn-small" onClick={() => store.removeMaterial(material.id)}>
                    Apagar
                  </button>
                }
              />
            ))}
          </Section>

          <Section title="Pedidos de acesso a materiais" empty="Você ainda não pediu acesso.">
            {local.materialRequests.map((request) => {
              const material = materialById(catalog, request.materialId);
              return (
                <Row
                  key={request.id}
                  href={material ? `/materiais/${material.id}` : "/materiais"}
                  title={material?.title ?? "Material removido"}
                  meta={formatTimestamp(request.createdAt)}
                  action={
                    <button type="button" className="btn btn-quiet btn-small" onClick={() => store.removeMaterialRequest(request.id)}>
                      Desfazer
                    </button>
                  }
                />
              );
            })}
          </Section>

          <section>
            <div className="mb-3 flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">Avaliações registradas</h2>
              {local.evaluations.length > 0 ? <CopyButton text={local.evaluations.map(evaluationPlainText).join("\n\n———\n\n")} /> : null}
            </div>
            {local.evaluations.length === 0 ? (
              <p className="text-sm text-muted">
                Nenhuma. <Link className="font-semibold text-blue-deep hover:underline" href="/avaliar">Abrir o roteiro de avaliação</Link>
              </p>
            ) : (
              <ul className="space-y-2">
                {local.evaluations.map((item) => (
                  <li key={item.id} className="rounded-2xl border border-line bg-white px-4 py-3 text-sm">
                    <p className="font-semibold">{formatTimestamp(item.createdAt)}</p>
                    <p className="mt-1 text-ink-soft">{item.comment || item.clear || "Sem comentário livre."}</p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      )}
    </Container>
  );
}

function Section({ title, empty, children }: { title: string; empty: string; children: React.ReactNode }) {
  const items = Array.isArray(children) ? children.filter(Boolean) : children ? [children] : [];
  return (
    <section>
      <h2 className="mb-3 text-lg font-semibold">{title}</h2>
      {items.length === 0 ? <p className="text-sm text-muted">{empty}</p> : <ul className="space-y-2">{children}</ul>}
    </section>
  );
}

function Row({
  href,
  title,
  meta,
  action,
}: {
  href: string;
  title: string;
  meta?: string;
  action: React.ReactNode;
}) {
  return (
    <li className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
      <Link href={href} className="min-w-0 flex-1">
        <span className="block truncate font-semibold">{title}</span>
        {meta ? <span className="block truncate text-sm text-muted">{meta}</span> : null}
      </Link>
      {action}
    </li>
  );
}

