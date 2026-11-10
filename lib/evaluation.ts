import type { Evaluation, EvaluationTasks } from "@/lib/types";
import { foundGroupLabel, usefulLabel } from "@/lib/format";

const taskLabels: { key: keyof EvaluationTasks; label: string }[] = [
  { key: "findDiscipline", label: "Encontrei uma disciplina" },
  { key: "joinGroup", label: "Manifestei interesse em um grupo" },
  { key: "postInterest", label: "Publiquei que quero estudar" },
  { key: "indicateMaterial", label: "Indiquei um material" },
  { key: "checkSpace", label: "Conferi Meu espaço" },
];

export function evaluationPlainText(evaluation: Evaluation): string {
  const done = taskLabels.filter((task) => evaluation.tasks[task.key]).map((task) => task.label);
  const missed = taskLabels.filter((task) => !evaluation.tasks[task.key]).map((task) => task.label);
  return [
    "FUMEC Conecta — registro de avaliação do protótipo",
    `Quando: ${evaluation.createdAt}`,
    `Conseguiu achar e entender um grupo: ${foundGroupLabel[evaluation.foundGroup]}`,
    `Recurso mais útil: ${usefulLabel[evaluation.mostUseful]}`,
    `Tarefas feitas: ${done.length ? done.join("; ") : "nenhuma marcada"}`,
    `Tarefas não feitas: ${missed.length ? missed.join("; ") : "nenhuma"}`,
    `O que ficou claro: ${evaluation.clear || "—"}`,
    `O que confundiu: ${evaluation.confusing || "—"}`,
    `Comentário: ${evaluation.comment || "—"}`,
  ].join("\n");
}

export { taskLabels };
