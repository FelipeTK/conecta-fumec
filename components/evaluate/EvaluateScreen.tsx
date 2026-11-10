"use client";

import { useState } from "react";
import Link from "next/link";
import { CopyButton } from "@/components/ui/CopyButton";
import { Container, PageIntro } from "@/components/ui/layout";
import { taskLabels, evaluationPlainText } from "@/lib/evaluation";
import { foundGroupLabel, newId, nowIso, usefulLabel } from "@/lib/format";
import { useStore } from "@/lib/store";
import type { EvaluationTasks, FoundGroupAnswer, UsefulAnswer } from "@/lib/types";

const emptyTasks = (): EvaluationTasks => ({
  findDiscipline: false,
  joinGroup: false,
  postInterest: false,
  indicateMaterial: false,
  checkSpace: false,
});

const steps = [
  { href: "/disciplinas/banco-de-dados", label: "Abra Banco de Dados e veja os três blocos da disciplina." },
  { href: "/grupos/g-bd-norm", label: "Entre no grupo Normalização sem sofrimento e manifeste interesse." },
  { href: "/quero-estudar/novo?disciplina=banco-de-dados", label: "Publique que você também quer estudar essa disciplina." },
  { href: "/materiais/indicar?disciplina=banco-de-dados", label: "Indique um material e confirme a autoria ou a autorização." },
  { href: "/meu-espaco", label: "Confira se tudo apareceu em Meu espaço." },
];

export function EvaluateScreen() {
  const store = useStore();
  const [foundGroup, setFoundGroup] = useState<FoundGroupAnswer | "">("");
  const [mostUseful, setMostUseful] = useState<UsefulAnswer | "">("");
  const [tasks, setTasks] = useState<EvaluationTasks>(emptyTasks);
  const [clear, setClear] = useState("");
  const [confusing, setConfusing] = useState("");
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const saved = store.local.evaluations.find((item) => item.id === savedId) ?? null;

  function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!foundGroup || !mostUseful) {
      setError("Responda as duas escolhas obrigatórias. Os comentários podem ficar em branco.");
      return;
    }
    const id = newId();
    store.addEvaluation({
      id,
      foundGroup,
      mostUseful,
      clear: clear.trim(),
      confusing: confusing.trim(),
      comment: comment.trim(),
      tasks,
      createdAt: nowIso(),
    });
    setSavedId(id);
    setError("");
  }

  return (
    <Container className="max-w-3xl py-8 sm:py-10">
      <PageIntro
        eyebrow="Teste com voluntários"
        title="Avaliar o protótipo"
        description="A participação é voluntária. O formulário não pede nome. O registro fica neste navegador para você copiar como evidência, sem identificar a pessoa."
      />

      <ol className="card mb-8 divide-y divide-line">
        {steps.map((step, index) => (
          <li key={step.href} className="flex gap-4 px-5 py-4">
            <span className="tabular text-sm font-semibold text-blue-deep">0{index + 1}</span>
            <Link href={step.href} className="font-medium text-ink hover:text-blue-deep">
              {step.label}
            </Link>
          </li>
        ))}
      </ol>

      {saved ? (
        <div className="card p-5 sm:p-6">
          <p className="badge badge-green">Registrado neste navegador</p>
          <h2 className="mt-3 text-xl font-semibold">Obrigado. O comentário ficou salvo.</h2>
          <p className="mt-2 text-sm leading-relaxed text-ink-soft">
            Copie o texto abaixo para o relatório. Ele não contém nome. Se outras pessoas usarem o mesmo computador, os registros se misturam: esta é uma limitação do protótipo.
          </p>
          <pre className="mt-4 overflow-auto whitespace-pre-wrap rounded-2xl bg-mist p-4 text-sm leading-relaxed text-ink">{evaluationPlainText(saved)}</pre>
          <div className="mt-4 flex flex-wrap gap-2">
            <CopyButton text={evaluationPlainText(saved)} label="Copiar esta avaliação" />
            <button
              type="button"
              className="btn btn-secondary btn-small"
              onClick={() => {
                setSavedId(null);
                setFoundGroup("");
                setMostUseful("");
                setTasks(emptyTasks());
                setClear("");
                setConfusing("");
                setComment("");
              }}
            >
              Registrar outra
            </button>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-6" noValidate>
          {error ? (
            <p role="alert" className="rounded-2xl border border-[#f0d0d0] bg-danger-soft px-4 py-3 text-sm font-semibold text-danger">
              {error}
            </p>
          ) : null}

          <fieldset>
            <legend className="label">Você conseguiu achar um grupo e entender do que se trata?</legend>
            <div className="mt-2 grid gap-2">
              {(Object.keys(foundGroupLabel) as FoundGroupAnswer[]).map((key) => (
                <label key={key} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                  <input type="radio" name="encontrou" checked={foundGroup === key} onChange={() => setFoundGroup(key)} />
                  <span>{foundGroupLabel[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label">Qual recurso ajudaria mais na sua rotina?</legend>
            <div className="mt-2 grid gap-2 sm:grid-cols-2">
              {(Object.keys(usefulLabel) as UsefulAnswer[]).map((key) => (
                <label key={key} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                  <input type="radio" name="util" checked={mostUseful === key} onChange={() => setMostUseful(key)} />
                  <span>{usefulLabel[key]}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend className="label">O que você conseguiu fazer</legend>
            <div className="mt-2 grid gap-2">
              {taskLabels.map((task) => (
                <label key={task.key} className="flex items-center gap-3 rounded-2xl border border-line bg-white px-4 py-3">
                  <input
                    type="checkbox"
                    checked={tasks[task.key]}
                    onChange={(event) => setTasks((current) => ({ ...current, [task.key]: event.target.checked }))}
                  />
                  <span>{task.label}</span>
                </label>
              ))}
            </div>
          </fieldset>

          <Comment label="O que ficou claro" value={clear} onChange={setClear} />
          <Comment label="O que confundiu ou travou" value={confusing} onChange={setConfusing} />
          <Comment label="Comentário livre" value={comment} onChange={setComment} />

          <button type="submit" className="btn btn-primary">
            Salvar avaliação neste navegador
          </button>
        </form>
      )}
    </Container>
  );
}

function Comment({ label, value, onChange }: { label: string; value: string; onChange: (value: string) => void }) {
  return (
    <label className="block">
      <span className="label">{label}</span>
      <textarea className="textarea min-h-24" maxLength={500} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}
