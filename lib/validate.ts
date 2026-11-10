import type { Discipline } from "@/lib/types";

export function validateFirstName(value: string): string | null {
  const name = value.trim().replace(/\s+/g, " ");
  if (name.length < 2) return "Escreva seu primeiro nome.";
  if (name.length > 40 || name.split(" ").length > 2) return "Use só o primeiro nome, sem sobrenome.";
  if (name.includes("@") || /\d/.test(name)) {
    return "Não informe e-mail, telefone ou matrícula. Só o primeiro nome.";
  }
  return null;
}

export function validateRequired(value: string, message: string): string | null {
  return value.trim() ? null : message;
}

export function validateLength(
  value: string,
  min: number,
  max: number,
  label: string,
): string | null {
  const length = value.trim().length;
  if (length < min) return `${label} precisa ter pelo menos ${min} caracteres.`;
  if (length > max) return `${label} pode ter no máximo ${max} caracteres.`;
  return null;
}

export function validateDiscipline(id: string, disciplines: Discipline[]): string | null {
  return disciplines.some((item) => item.id === id) ? null : "Escolha uma disciplina.";
}

export function validateCapacity(value: string): string | null {
  const capacity = Number(value);
  if (!Number.isInteger(capacity) || capacity < 2 || capacity > 12) {
    return "Informe entre 2 e 12 vagas, contando com você.";
  }
  return null;
}

export function collectErrors(fields: Record<string, string | null>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(fields).filter((entry): entry is [string, string] => Boolean(entry[1])),
  );
}
