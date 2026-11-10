"use client";

import { useState } from "react";
import { COURSES } from "@/lib/constants";
import { cleanText } from "@/lib/format";
import { collectErrors, validateFirstName, validateLength, validateRequired } from "@/lib/validate";

type SignalValue = {
  name: string;
  course: string;
  note: string;
};

export function SignalForm({
  title,
  description,
  submitLabel,
  successTitle,
  successBody,
  noteLabel,
  noteHint,
  already,
  onSubmit,
  onUndo,
}: {
  title: string;
  description: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  noteLabel: string;
  noteHint: string;
  already: SignalValue | null;
  onSubmit: (value: SignalValue) => void;
  onUndo: () => void;
}) {
  const [name, setName] = useState("");
  const [course, setCourse] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (already) {
    return (
      <div className="card p-5 sm:p-6">
        <p className="badge badge-green">Registrado neste navegador</p>
        <h2 className="mt-3 text-xl font-semibold">{successTitle}</h2>
        <p className="mt-2 text-sm leading-relaxed text-ink-soft">{successBody}</p>
        <dl className="mt-4 space-y-2 text-sm">
          <div>
            <dt className="font-semibold">Nome que aparece</dt>
            <dd className="text-ink-soft">{already.name}</dd>
          </div>
          <div>
            <dt className="font-semibold">Curso</dt>
            <dd className="text-ink-soft">{already.course}</dd>
          </div>
          {already.note ? (
            <div>
              <dt className="font-semibold">Recado</dt>
              <dd className="text-ink-soft">{already.note}</dd>
            </div>
          ) : null}
        </dl>
        <button type="button" className="btn btn-quiet mt-4 px-0" onClick={onUndo}>
          Desfazer este registro
        </button>
      </div>
    );
  }

  function submit(event: React.FormEvent) {
    event.preventDefault();
    const next = collectErrors({
      name: validateFirstName(name),
      course: validateRequired(course, "Escolha seu curso."),
      note: note.trim() ? validateLength(note, 0, 280, "O recado") : null,
    });
    setErrors(next);
    if (Object.keys(next).length > 0) {
      document.getElementById("resumo-sinal")?.focus();
      return;
    }
    onSubmit({ name: cleanText(name), course, note: cleanText(note) });
  }

  return (
    <form onSubmit={submit} className="card p-5 sm:p-6" noValidate>
      <h2 className="text-xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm leading-relaxed text-ink-soft">{description}</p>
      {Object.keys(errors).length > 0 ? (
        <div id="resumo-sinal" tabIndex={-1} className="mt-4 outline-none">
          <p role="alert" className="rounded-2xl border border-[#f0d0d0] bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
            Confira seu nome e seu curso.
          </p>
        </div>
      ) : null}
      <div className="mt-5 grid gap-4">
        <Field
          label="Seu primeiro nome"
          hint="Sem sobrenome, e-mail ou matrícula."
          value={name}
          error={errors.name}
          onChange={setName}
          maxLength={40}
          autoComplete="given-name"
        />
        <label className="block">
          <span className="label">Seu curso</span>
          <select className="select" value={course} aria-invalid={errors.course ? true : undefined} onChange={(event) => setCourse(event.target.value)}>
            <option value="">Escolha o curso</option>
            {COURSES.map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
          {errors.course ? <span className="error">{errors.course}</span> : null}
        </label>
        <label className="block">
          <span className="label">{noteLabel}</span>
          <textarea className="textarea min-h-28" value={note} maxLength={280} onChange={(event) => setNote(event.target.value)} />
          <span className="hint">{noteHint}</span>
        </label>
      </div>
      <button type="submit" className="btn btn-primary mt-5">
        {submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  hint,
  value,
  error,
  onChange,
  maxLength,
  autoComplete,
}: {
  label: string;
  hint: string;
  value: string;
  error?: string;
  onChange: (value: string) => void;
  maxLength: number;
  autoComplete?: string;
}) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <input
        className="input"
        value={value}
        maxLength={maxLength}
        autoComplete={autoComplete}
        aria-invalid={error ? true : undefined}
        onChange={(event) => onChange(event.target.value)}
      />
      {error ? <span className="error">{error}</span> : <span className="hint">{hint}</span>}
    </label>
  );
}
