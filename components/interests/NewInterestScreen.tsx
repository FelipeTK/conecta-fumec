"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COURSES, MODALITY_PREFERENCES } from "@/lib/constants";
import { ChoiceGroup, Counter, DisciplineOptions, ErrorSummary, TextArea, TextField } from "@/components/ui/fields";
import { Breadcrumb, Container, PageIntro } from "@/components/ui/layout";
import { cleanText, newId, nowIso } from "@/lib/format";
import { disciplines } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { ModalityPreference } from "@/lib/types";
import { collectErrors, validateDiscipline, validateFirstName, validateLength, validateRequired } from "@/lib/validate";

export function NewInterestScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("disciplina") ?? "";
  const { addInterest } = useStore();
  const [disciplineId, setDisciplineId] = useState(disciplines.some((item) => item.id === preset) ? preset : "");
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [availability, setAvailability] = useState("");
  const [modality, setModality] = useState<ModalityPreference | "">("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = collectErrors({
      disciplineId: validateDiscipline(disciplineId, disciplines),
      name: validateFirstName(name),
      course: validateRequired(course, "Escolha seu curso."),
      availability: validateLength(availability, 6, 80, "A disponibilidade"),
      modality: modality ? null : "Diga se prefere presencial, online ou tanto faz.",
      note: validateLength(note, 15, 280, "O que você quer estudar"),
    });
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("resumo-erros")?.focus();
      return;
    }
    const id = newId();
    addInterest({
      id,
      origin: "local",
      disciplineId,
      name: cleanText(name),
      course,
      availability: cleanText(availability),
      modality: modality as ModalityPreference,
      note: note.trim(),
      createdAt: nowIso(),
    });
    router.push(`/quero-estudar/${id}`);
  }

  return (
    <Container className="max-w-3xl py-8 sm:py-10">
      <Breadcrumb items={[{ href: "/quero-estudar", label: "Quero estudar" }, { label: "Publicar" }]} />
      <PageIntro
        eyebrow="Manifestar interesse"
        title="Diga que você quer companhia."
        description="Serve para quando ainda não existe grupo, ou quando você prefere um encontro curto em vez de uma turma fixa."
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
          <TextArea
            label="O que você quer estudar"
            value={note}
            maxLength={280}
            error={errors.note}
            placeholder="Ex.: travei em dependência funcional e quero alguém no mesmo ponto."
            onChange={(event) => setNote(event.target.value)}
          />
          <Counter value={note} max={280} />
        </div>
        <TextField
          label="Quando você pode"
          hint="Ex.: terças depois das 19h, ou sábado de manhã."
          value={availability}
          maxLength={80}
          error={errors.availability}
          onChange={(event) => setAvailability(event.target.value)}
        />
        <ChoiceGroup<ModalityPreference>
          legend="Formato"
          name="formato"
          value={modality}
          onChange={setModality}
          options={MODALITY_PREFERENCES.map((item) => ({ value: item.id, title: item.title, description: item.description }))}
          error={errors.modality}
          columns="sm:grid-cols-2"
        />
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
        <button type="submit" className="btn btn-primary">
          Publicar interesse
        </button>
      </form>
    </Container>
  );
}
