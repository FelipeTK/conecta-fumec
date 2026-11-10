import { WEEKDAYS } from "@/lib/constants";
import type {
  Authorship,
  FoundGroupAnswer,
  MaterialKind,
  Modality,
  ModalityPreference,
  UsefulAnswer,
  Weekday,
} from "@/lib/types";

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

const WEEKDAY_LONG = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];

export const modalityLabel: Record<ModalityPreference, string> = {
  presencial: "Presencial",
  online: "Online",
  hibrido: "Híbrido",
  "tanto-faz": "Presencial ou online",
};

export const materialKindLabel: Record<MaterialKind, string> = {
  resumo: "Resumo",
  lista: "Lista de exercícios",
  mapa: "Mapa",
  roteiro: "Roteiro",
  slides: "Slides",
};

export const authorshipLabel: Record<Authorship, string> = {
  propria: "Autoria própria",
  autorizada: "Uso autorizado",
};

export const foundGroupLabel: Record<FoundGroupAnswer, string> = {
  sim: "Sim, sem dificuldade",
  "com-dificuldade": "Sim, com alguma dificuldade",
  nao: "Não consegui",
};

export const usefulLabel: Record<UsefulAnswer, string> = {
  grupos: "Grupos de estudo",
  interesse: "Quero estudar",
  materiais: "Materiais",
  nenhum: "Nenhum dos três",
};

export function todayInBeloHorizonte(now = new Date()): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);
}

export function daysFromToday(isoDate: string, now = new Date()): number {
  const today = Date.parse(`${todayInBeloHorizonte(now)}T00:00:00Z`);
  const target = Date.parse(`${isoDate}T00:00:00Z`);
  return Math.round((target - today) / 86_400_000);
}

export function splitISODate(isoDate: string): { day: string; month: string } {
  const [, month, day] = isoDate.split("-");
  return {
    day: day ?? "",
    month: MONTHS[Number(month) - 1] ?? "",
  };
}

export function weekdayName(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const index = new Date(Date.UTC(year, month - 1, day)).getUTCDay();
  return WEEKDAY_LONG[index] ?? "";
}

export function capitalize(value: string): string {
  if (!value) return value;
  return value.charAt(0).toLocaleUpperCase("pt-BR") + value.slice(1);
}

export function formatWeekdays(days: Weekday[]): string {
  const labels = WEEKDAYS.filter((item) => days.includes(item.id)).map((item) =>
    item.label.toLocaleLowerCase("pt-BR"),
  );
  if (labels.length === 0) return "Dia a combinar";
  if (labels.length === 1) return capitalize(labels[0]);
  return `${labels
    .slice(0, -1)
    .map((item) => capitalize(item))
    .join(", ")} e ${labels.at(-1)}`;
}

export function formatTime(time: string): string {
  const [hour, minute] = time.split(":");
  if (!hour) return time;
  if (!minute || minute === "00") return `${Number(hour)}h`;
  return `${hour}h${minute}`;
}

export function sessionMark(
  isoDate: string,
  weekdays: Weekday[],
): { day: string; month: string; caption: string } {
  const diff = daysFromToday(isoDate);
  const parts = splitISODate(isoDate);
  if (diff >= 0 && diff <= 21) {
    const caption = diff === 0 ? "Hoje" : diff === 1 ? "Amanhã" : capitalize(weekdayName(isoDate));
    return { ...parts, caption };
  }
  const first = WEEKDAYS.find((item) => item.id === weekdays[0]);
  return {
    day: first?.short ?? "—",
    month: weekdays.length > 1 ? `+${weekdays.length - 1}` : "fixo",
    caption: "Recorrente",
  };
}

export function formatLongDate(isoDate: string): string {
  const { day, month } = splitISODate(isoDate);
  return `${Number(day)} ${month} · ${capitalize(weekdayName(isoDate))}`;
}

export function formatTimestamp(iso: string): string {
  const date = isoDateInBeloHorizonte(iso);
  const diff = daysFromToday(date);
  if (diff === 0) return "Hoje";
  if (diff === -1) return "Ontem";
  if (diff < 0 && diff > -7) return `Há ${Math.abs(diff)} dias`;
  const { day, month } = splitISODate(date);
  return `${Number(day)} ${month}`;
}

export function isoDateInBeloHorizonte(instant: string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Sao_Paulo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date(instant));
}

export function seatsLeft(capacity: number, filled: number): number {
  return Math.max(capacity - filled, 0);
}

export function seatLabel(capacity: number, filled: number): string {
  const left = seatsLeft(capacity, filled);
  if (left === 0) return "Lotado";
  if (left === 1) return "1 vaga";
  return `${left} vagas`;
}

export function peopleLabel(count: number): string {
  return count === 1 ? "1 pessoa" : `${count} pessoas`;
}

export function joinMeta(parts: Array<string | false | null | undefined>): string {
  return parts.filter((part): part is string => Boolean(part)).join(" · ");
}

export function newId(): string {
  return `local-${crypto.randomUUID()}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function cleanText(value: string): string {
  return value.replace(/\s+/g, " ").trim();
}
