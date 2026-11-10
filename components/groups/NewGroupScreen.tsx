"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { COURSES, FOCUS_OPTIONS, MODALITIES, WEEKDAYS } from "@/lib/constants";
import { ChoiceGroup, Counter, DisciplineOptions, ErrorSummary, TextArea, TextField } from "@/components/ui/fields";
import { Breadcrumb, Container, PageIntro } from "@/components/ui/layout";
import { cleanText, newId, nowIso, todayInBeloHorizonte } from "@/lib/format";
import { disciplines } from "@/lib/seed";
import { useStore } from "@/lib/store";
import type { Modality, Weekday } from "@/lib/types";
import { collectErrors, validateCapacity, validateDiscipline, validateFirstName, validateLength, validateRequired } from "@/lib/validate";

export function NewGroupScreen() {
  const router = useRouter();
  const params = useSearchParams();
  const preset = params.get("disciplina") ?? "";
  const { addGroup } = useStore();
  const [disciplineId, setDisciplineId] = useState(disciplines.some((item) => item.id === preset) ? preset : "");
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [modality, setModality] = useState<Modality | "">("");
  const [place, setPlace] = useState("");
  const [days, setDays] = useState<Weekday[]>([]);
  const [time, setTime] = useState("");
  const [nextSession, setNextSession] = useState("");
  const [capacity, setCapacity] = useState("4");
  const [focus, setFocus] = useState<string[]>([]);
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  function toggleDay(day: Weekday) {
    setDays((current) => (current.includes(day) ? current.filter((item) => item !== day) : [...current, day]));
  }

  function toggleFocus(item: string) {
    setFocus((current) => (current.includes(item) ? current.filter((value) => value !== item) : [...current, item]));
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = collectErrors({
      disciplineId: validateDiscipline(disciplineId, disciplines),
      title: validateLength(title, 6, 80, "O nome do grupo"),
      objective: validateLength(objective, 20, 400, "O objetivo"),
      modality: modality ? null : "Escolha presencial, online ou híbrido.",
      place: validateLength(place, 8, 160, "O lugar"),
      days: days.length ? null : "Marque pelo menos um dia.",
      time: validateRequired(time, "Informe o horário."),
      nextSession: !nextSession
        ? "Informe a data do próximo encontro."
        : nextSession < todayInBeloHorizonte()
          ? "Escolha hoje ou uma data futura."
          : null,
      capacity: validateCapacity(capacity),
      name: validateFirstName(name),
      course: validateRequired(course, "Escolha seu curso."),
    });
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("resumo-erros")?.focus();
      return;
    }
    const id = newId();
    const orderedDays = WEEKDAYS.map((item) => item.id).filter((day) => days.includes(day));
    addGroup({
      id,
      origin: "local",
      disciplineId,
      title: cleanText(title),
      objective: objective.trim(),
      modality: modality as Modality,
      place: cleanText(place),
      weekdays: orderedDays,
      time,
      nextSession,
      capacity: Number(capacity),
      filled: 1,
      organizerName: cleanText(name),
      organizerCourse: course,
      focus,
      materialIds: [],
      createdAt: nowIso(),
    });
    router.push(`/grupos/${id}`);
  }

  return (
    <Container className="max-w-3xl py-8 sm:py-10">
      <Breadcrumb items={[{ href: "/grupos", label: "Grupos" }, { label: "Novo grupo" }]} />
      <PageIntro
        eyebrow="Divulgar um grupo"
        title="Marque um encontro da sua disciplina."
        description="Descreva o que vocês vão estudar, quando e onde. Não cole link com senha: o endereço online fica combinado fora da página."
      />
      <form onSubmit={submit} className="space-y-5" noValidate>
        <div id="resumo-erros" tabIndex={-1} className="outline-none">
          <ErrorSummary errors={Object.values(errors)} />
        </div>
        <label className="block">
          <span className="label">Disciplina</span>
          <select className="select" value={disciplineId} aria-invalid={errors.disciplineId ? true : undefined} onChange={(event) => setDisciplineId(event.target.value)}>
            <DisciplineOptions />
          </select>
          {errors.disciplineId ? <span className="error">{errors.disciplineId}</span> : null}
        </label>
        <div>
          <TextField label="Nome do grupo" value={title} maxLength={80} error={errors.title} onChange={(event) => setTitle(event.target.value)} placeholder="Ex.: Revisão de JOIN antes do trabalho" />
          <Counter value={title} max={80} />
        </div>
        <div>
          <TextArea
            label="O que vocês vão fazer"
            value={objective}
            maxLength={400}
            error={errors.objective}
            onChange={(event) => setObjective(event.target.value)}
            placeholder="Ex.: resolver dois exercícios de normalização e comparar as respostas no final."
          />
          <Counter value={objective} max={400} />
        </div>
        <ChoiceGroup<Modality>
          legend="Formato"
          name="modalidade"
          value={modality}
          onChange={setModality}
          options={MODALITIES.map((item) => ({ value: item.id, title: item.title, description: item.description }))}
          error={errors.modality}
        />
        <TextField
          label={modality === "online" ? "Como descrever o encontro" : "Lugar no campus"}
          hint="Escreva o bloco, a sala ou “link combinado no dia”. Não publique senha."
          value={place}
          maxLength={160}
          error={errors.place}
          onChange={(event) => setPlace(event.target.value)}
        />
        <fieldset>
          <legend className="label">Dias</legend>
          <div className="flex flex-wrap gap-2">
            {WEEKDAYS.map((day) => (
              <label key={day.id} className="chip">
                <input type="checkbox" className="sr-only" checked={days.includes(day.id)} onChange={() => toggleDay(day.id)} />
                {day.label}
              </label>
            ))}
          </div>
          {errors.days ? <p className="error">{errors.days}</p> : null}
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-3">
          <TextField label="Horário" type="time" value={time} error={errors.time} onChange={(event) => setTime(event.target.value)} />
          <TextField label="Próximo encontro" type="date" min={todayInBeloHorizonte()} value={nextSession} error={errors.nextSession} onChange={(event) => setNextSession(event.target.value)} />
          <TextField label="Vagas, com você" type="number" min={2} max={12} value={capacity} error={errors.capacity} onChange={(event) => setCapacity(event.target.value)} />
        </div>
        <fieldset>
          <legend className="label">Foco, se quiser marcar</legend>
          <div className="flex flex-wrap gap-2">
            {FOCUS_OPTIONS.map((item) => (
              <label key={item} className="chip">
                <input type="checkbox" className="sr-only" checked={focus.includes(item)} onChange={() => toggleFocus(item)} />
                {item}
              </label>
            ))}
          </div>
        </fieldset>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField label="Seu primeiro nome" hint="Você aparece como quem organiza." autoComplete="given-name" value={name} maxLength={40} error={errors.name} onChange={(event) => setName(event.target.value)} />
          <label>
            <span className="label">Seu curso</span>
            <select className="select" value={course} aria-invalid={errors.course ? true : undefined} onChange={(event) => setCourse(event.target.value)}>
              <option value="">Escolha o curso</option>
              {COURSES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            {errors.course ? <span className="error">{errors.course}</span> : null}
          </label>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <button type="submit" className="btn btn-primary">
            Publicar grupo
          </button>
          <button type="button" className="btn btn-secondary" onClick={() => router.back()}>
            Cancelar
          </button>
        </div>
      </form>
    </Container>
  );
}
