import type { ReactNode } from "react";

export function EmptyState({ title, body, action }: { title: string; body: string; action?: ReactNode }) {
  return (
    <div className="rounded-3xl border border-dashed border-line bg-white px-5 py-8">
      <h3 className="text-lg font-semibold text-ink">{title}</h3>
      <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink-soft">{body}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}
