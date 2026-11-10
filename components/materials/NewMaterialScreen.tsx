"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COURSES, MATERIAL_KINDS } from "@/lib/constants";
import { ChoiceGroup, Counter, DisciplineOptions, ErrorSummary, TextArea, TextField } from "@/components/ui/fields";
import { Breadcrumb, Container, PageIntro } from "@/components/ui/layout";
import { cleanText, newId, nowIso } from "@/lib/format";
import { disciplines } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { Authorship, MaterialKind } from "@/lib/types";
import { collectErrors, validateDiscipline, validateFirstName, validateLength, validateRequired } from "@/lib/validate";

const authorshipOptions: { value: Authorship; title: string; description: string }[] = [
  { value: "propria", title: "Eu escrevi", description: "Resumo, lista, mapa ou slide de minha autoria." },
  { value: "autorizada", title: "Tenho autorização", description: "Quem escreveu permitiu indicar este material." },
];

export function NewMaterialScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("disciplina") ?? "";
  const { addMaterial } = useStore();
  const [disciplineId, setDisciplineId] = useState(disciplines.some((item) => item.id === preset) ? preset : "");
  const [title, setTitle] = useState("");
  const [kind, setKind] = useState<MaterialKind | "">("");
  const [authorship, setAuthorship] = useState<Authorship | "">("");
  const [authorizedBy, setAuthorizedBy] = useState("");
  const [summary, setSummary] = useState("");
  const [pages, setPages] = useState("");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const pageNumber = pages.trim() ? Number(pages) : undefined;
    const next = collectErrors({
      disciplineId: validateDiscipline(disciplineId, disciplines),
      title: validateLength(title, 6, 90, "O título"),
      kind: kind ? null : "Escolha o tipo do material.",
      authorship: authorship ? null : "Diga se a autoria é sua ou se você tem autorização.",
      authorizedBy:
        authorship === "autorizada" ? validateLength(authorizedBy, 6, 120, "Quem autorizou") : null,
      summary: validateLength(summary, 30, 500, "A descrição"),
      pages:
        pages.trim() && (!Number.isInteger(pageNumber) || (pageNumber ?? 0) < 1 || (pageNumber ?? 0) > 40)
          ? "Se informar páginas, use um número de 1 a 40."
          : null,
      name: validateFirstName(name),
      course: validateRequired(course, "Escolha seu curso."),
      confirmed: confirmed ? null : "Confirme a autoria ou a autorização antes de indicar.",
    });
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("resumo-erros")?.focus();
      return;
    }
    const id = newId();
    addMaterial({
      id,
      origin: "local",
      disciplineId,
      title: cleanText(title),
      kind: kind as MaterialKind,
      authorship: authorship as Authorship,
      authorizedBy: authorship === "autorizada" ? cleanText(authorizedBy) : undefined,
      summary: summary.trim(),
      pages: pageNumber,
      authorName: cleanText(name),
      authorCourse: course,
      createdAt: nowIso(),
    });
    router.push(`/materiais/${id}`);
  }

  return (
    <Container className="max-w-3xl py-8 sm:py-10">
      <Breadcrumb items={[{ href: "/materiais", label: "Materiais" }, { label: "Indicar" }]} />
      <PageIntro
        eyebrow="Compartilhar com cuidado"
        title="Indique um material que você pode circular."
        description="Descreva o que ele contém. Não cole trecho de livro, apostila ou slide de outra pessoa. O arquivo em si não entra neste protótipo."
      />
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div id="resumo-erros" tabIndex={-1} className="outline-none">
          <ErrorSummary errors={Object.values(errors)} />
        </div>
        <label className="block">
          <span className="label">Disciplina</span>
          <select className="select" value={disciplineId} onChange={(event) => setDisciplineId(event.target.value)}>
            <DisciplineOptions />
          </select>
          {errors.disciplineId ? <span className="error">{errors.disciplineId}</span> : null}
        </label>
        <div>
          <TextField label="Título" value={title} maxLength={90} error={errors.title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Mapa de JOIN com exemplos meus" />
          <Counter value={title} max={90} />
        </div>
        <ChoiceGroup<MaterialKind>
          legend="Tipo"
          name="tipo"
          value={kind}
          onChange={setKind}
          options={MATERIAL_KINDS.map((item) => ({ value: item.id, title: item.title, description: item.description }))}
          error={errors.kind}
        />
        <ChoiceGroup legend="Posso indicar porque…" name="autoria" value={authorship} onChange={setAuthorship} options={authorshipOptions} error={errors.authorship} columns="sm:grid-cols-2" />
        {authorship === "autorizada" ? (
          <TextField
            label="Quem autorizou"
            hint="Ex.: Marina, autora do resumo, autorizou a turma."
            value={authorizedBy}
            maxLength={120}
            error={errors.authorizedBy}
            onChange={(event) => setAuthorizedBy(event.target.value)}
          />
        ) : null}
        <div>
          <TextArea
            label="O que tem no material"
            hint="Conte o assunto com as suas palavras. Não cole conteúdo de terceiros."
            value={summary}
            maxLength={500}
            error={errors.summary}
            onChange={(event) => setSummary(event.target.value)}
          />
          <Counter value={summary} max={500} />
        </div>
        <TextField label="Páginas, se souber" type="number" min={1} max={40} value={pages} error={errors.pages} onChange={(event) => setPages(event.target.value)} />
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Seu primeiro nome" autoComplete="given-name" value={name} maxLength={40} error={errors.name} onChange={(event) => setName(event.target.value)} />
          <label>
            <span className="label">Seu curso</span>
            <select className="select" value={course} onChange={(event) => setCourse(event.target.value)}>
              <option value="">Escolha o curso</option>
              {COURSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {errors.course ? <span className="error">{errors.course}</span> : null}
          </label>
        </div>
        <label className={`block rounded-2xl border p-4 ${errors.confirmed ? "border-[#c45b5b]" : "border-line"} bg-white`}>
          <span className="flex gap-3">
            <input type="checkbox" className="mt-1 size-4" checked={confirmed} onChange={(event) => setConfirmed(event.target.checked)} />
            <span className="text-sm leading-relaxed">
              Confirmo que este material é de minha autoria ou que tenho autorização para indicá-lo, e que ele não expõe dados pessoais de outras pessoas.
            </span>
          </span>
          {errors.confirmed ? <span className="error">{errors.confirmed}</span> : null}
        </label>
        <button type="submit" className="btn btn-primary">
          Publicar indicação
        </button>
      </form>
    </Container>
  );
}
