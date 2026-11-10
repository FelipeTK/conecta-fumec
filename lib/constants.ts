import type { Area, MaterialKind, Modality, ModalityPreference, Weekday } from "@/lib/types";

export const COURSES = [
  "Sistemas de Informação",
  "Ciência da Computação",
  "Direito",
  "Administração",
  "Psicologia",
  "Engenharia Civil",
  "Arquitetura e Urbanismo",
  "Outro curso da FUMEC",
] as const;

export const AREAS: Area[] = [
  "Computação",
  "Gestão",
  "Direito",
  "Saúde",
  "Engenharia",
  "Arquitetura",
];

export const WEEKDAYS: { id: Weekday; label: string; short: string }[] = [
  { id: "seg", label: "Segunda", short: "Seg" },
  { id: "ter", label: "Terça", short: "Ter" },
  { id: "qua", label: "Quarta", short: "Qua" },
  { id: "qui", label: "Quinta", short: "Qui" },
  { id: "sex", label: "Sexta", short: "Sex" },
  { id: "sab", label: "Sábado", short: "Sáb" },
];

export const MODALITIES: { id: Modality; title: string; description: string }[] = [
  {
    id: "presencial",
    title: "Presencial",
    description: "No campus, em sala, lab ou biblioteca.",
  },
  {
    id: "online",
    title: "Online",
    description: "À distância. O link não fica público.",
  },
  {
    id: "hibrido",
    title: "Híbrido",
    description: "Quem puder vai; quem não puder entra online.",
  },
];

export const MODALITY_PREFERENCES: {
  id: ModalityPreference;
  title: string;
  description: string;
}[] = [
  ...MODALITIES,
  {
    id: "tanto-faz",
    title: "Tanto faz",
    description: "Presencial ou online, o horário é o que importa.",
  },
];

export const MATERIAL_KINDS: { id: MaterialKind; title: string; description: string }[] = [
  { id: "resumo", title: "Resumo", description: "Síntese curta, em palavras suas." },
  { id: "lista", title: "Lista", description: "Exercícios de autoria própria." },
  { id: "mapa", title: "Mapa", description: "Mapa mental ou esquema visual." },
  { id: "roteiro", title: "Roteiro", description: "Passo a passo ou perguntas-guia." },
  { id: "slides", title: "Slides", description: "Apresentação feita por você." },
];

export const FOCUS_OPTIONS = ["Exercícios", "Prova", "Trabalho", "Leitura", "Projeto"];

export const STORAGE_KEY = "fumec-conecta:v1";
