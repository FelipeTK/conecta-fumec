"use client";

import { useId, type InputHTMLAttributes, type ReactNode, type SelectHTMLAttributes, type TextareaHTMLAttributes } from "react";
import { disciplines } from "@/lib/seed";

type Common = {
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({ label, hint, error, ...props }: Common & InputHTMLAttributes<HTMLInputElement>) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        id={id}
        className="input"
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function TextArea({ label, hint, error, ...props }: Common & TextareaHTMLAttributes<HTMLTextAreaElement>) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <textarea
        id={id}
        className="textarea"
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        {...props}
      />
      {hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function SelectField({
  label,
  hint,
  error,
  children,
  ...props
}: Common & SelectHTMLAttributes<HTMLSelectElement> & { children: ReactNode }) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  return (
    <div>
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <select
        id={id}
        className="select"
        aria-invalid={error ? true : undefined}
        aria-describedby={[hintId, errorId].filter(Boolean).join(" ") || undefined}
        {...props}
      >
        {children}
      </select>
      {hint ? (
        <p id={hintId} className="hint">
          {hint}
        </p>
      ) : null}
      {error ? (
        <p id={errorId} className="error" role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export function ChoiceGroup<T extends string>({
  legend,
  name,
  value,
  onChange,
  options,
  error,
  columns = "sm:grid-cols-3",
}: {
  legend: string;
  name: string;
  value: T | "";
  onChange: (value: T) => void;
  options: { value: T; title: string; description?: string }[];
  error?: string;
  columns?: string;
}) {
  return (
    <fieldset>
      <legend className="label">{legend}</legend>
      <div className={`mt-1 grid gap-2 ${columns}`}>
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-2xl border p-3 ${selected ? "border-blue-deep bg-blue-soft" : "border-line bg-white hover:border-[#b7d7e8]"}`}
            >
              <input
                className="sr-only"
                type="radio"
                name={name}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
              />
              <span className="flex items-start justify-between gap-3">
                <span className="font-semibold text-ink">{option.title}</span>
                <span
                  aria-hidden="true"
                  className={`mt-0.5 size-3.5 shrink-0 rounded-full border ${selected ? "border-blue-deep bg-blue-deep" : "border-line bg-white"}`}
                />
              </span>
              {option.description ? <span className="mt-1 block text-sm leading-snug text-muted">{option.description}</span> : null}
            </label>
          );
        })}
      </div>
      {error ? (
        <p className="error" role="alert">
          {error}
        </p>
      ) : null}
    </fieldset>
  );
}

export function ErrorSummary({ errors }: { errors: string[] }) {
  if (errors.length === 0) return null;
  return (
    <div role="alert" tabIndex={-1} className="rounded-2xl border border-[#f0d0d0] bg-danger-soft px-4 py-3 text-sm text-danger outline-none">
      <p className="font-semibold">Revise antes de publicar.</p>
      <ul className="mt-1 list-disc pl-5">
        {errors.map((error) => (
          <li key={error}>{error}</li>
        ))}
      </ul>
    </div>
  );
}

export function Counter({ value, max }: { value: string; max: number }) {
  const over = value.length > max;
  return (
    <p className={`text-right text-xs tabular ${over ? "font-semibold text-danger" : "text-muted"}`}>
      {value.length} de {max}
    </p>
  );
}

export function DisciplineOptions({ includeBlank = true }: { includeBlank?: boolean }) {
  return (
    <>
      {includeBlank ? <option value="">Escolha a disciplina</option> : null}
      {disciplines.map((item) => (
        <option key={item.id} value={item.id}>
          {item.code} · {item.name}
        </option>
      ))}
    </>
  );
}
