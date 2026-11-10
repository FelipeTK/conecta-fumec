"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchDisciplines } from "@/lib/catalog";
import { useStore } from "@/lib/store";
import { Mark } from "@/components/shell/Mark";

export function SearchDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const titleId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const { catalog } = useStore();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  const results = useMemo(() => {
    const found = searchDisciplines(catalog, query);
    return query.trim() ? found.slice(0, 12) : found.slice(0, 6);
  }, [catalog, query]);

  useEffect(() => {
    setActive(0);
  }, [query]);

  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    inputRef.current?.focus();
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKey);
      previous?.focus();
    };
  }, [onClose]);

  useEffect(() => {
    const node = listRef.current?.querySelector<HTMLElement>(`[data-index="${active}"]`);
    node?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function go(id: string) {
    router.push(`/disciplinas/${id}`);
    onClose();
  }

  function onInputKey(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setActive((current) => Math.min(current + 1, Math.max(results.length - 1, 0)));
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setActive((current) => Math.max(current - 1, 0));
    }
    if (event.key === "Enter" && results[active]) {
      event.preventDefault();
      go(results[active].id);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center px-4 pt-[12vh]">
      <button className="absolute inset-0 bg-[#14202b]/45" aria-label="Fechar busca" onClick={onClose} />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className="relative w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-white shadow-[0_24px_80px_rgba(20,32,43,0.18)]"
      >
        <h2 id={titleId} className="sr-only">
          Buscar disciplina
        </h2>
        <div className="flex items-center gap-3 border-b border-line px-4">
          <Mark className="size-7 shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={onInputKey}
            className="h-14 w-full bg-transparent text-base outline-none"
            placeholder="Nome, código ou curso"
            aria-label="Nome, código ou curso da disciplina"
            aria-controls="resultado-disciplinas"
            aria-activedescendant={results[active] ? `disciplina-${results[active].id}` : undefined}
            autoComplete="off"
          />
          <button type="button" className="btn btn-quiet btn-small" onClick={onClose}>
            Esc
          </button>
        </div>
        <div id="resultado-disciplinas" ref={listRef} role="listbox" aria-label="Disciplinas" className="max-h-[50vh] overflow-auto p-2">
          <p className="px-3 py-2 text-xs font-semibold tracking-wide text-muted">
            {query.trim() ? "Resultados" : "Disciplinas para começar"}
          </p>
          {results.length === 0 ? (
            <p className="px-3 py-6 text-sm text-ink-soft">
              Nenhuma disciplina com esse nome. Tente o código, como SI305, ou o curso.
            </p>
          ) : (
            results.map((item, index) => (
              <button
                key={item.id}
                id={`disciplina-${item.id}`}
                type="button"
                role="option"
                aria-selected={index === active}
                data-index={index}
                className={`flex w-full items-start gap-3 rounded-2xl px-3 py-3 text-left ${index === active ? "bg-blue-soft" : "hover:bg-mist"}`}
                onMouseEnter={() => setActive(index)}
                onClick={() => go(item.id)}
              >
                <span className="badge badge-blue mt-0.5">{item.code}</span>
                <span>
                  <span className="block font-semibold text-ink">{item.name}</span>
                  <span className="mt-0.5 block text-sm text-muted">
                    {item.course} · {item.period}
                  </span>
                </span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
