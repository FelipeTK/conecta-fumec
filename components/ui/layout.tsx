import Link from "next/link";
import type { ReactNode } from "react";

export function Container({
  children,
  className = "py-8 sm:py-10",
}: {
  children: ReactNode;
  className?: string;
}) {
  return <div className={`mx-auto w-full max-w-[1120px] px-5 ${className}`}>{children}</div>;
}

export function PageIntro({
  eyebrow,
  title,
  description,
  actions,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-2xl">
        {eyebrow ? <p className="text-sm font-semibold text-blue-deep">{eyebrow}</p> : null}
        <h1 className="mt-1 text-[2rem] font-semibold tracking-[-0.03em] text-balance text-ink sm:text-4xl">{title}</h1>
        {description ? <p className="mt-3 text-base leading-relaxed text-pretty text-ink-soft">{description}</p> : null}
      </div>
      {actions ? <div className="flex shrink-0 flex-wrap gap-2">{actions}</div> : null}
    </div>
  );
}

export function Breadcrumb({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Trilha" className="mb-4 text-sm text-muted">
      <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1">
        {items.map((item, index) => {
          const last = index === items.length - 1;
          return (
            <li key={`${item.label}-${index}`} className="flex items-center gap-1.5">
              {index > 0 ? <span aria-hidden="true">/</span> : null}
              {item.href && !last ? (
                <Link href={item.href} className="font-semibold text-blue-deep hover:underline">
                  {item.label}
                </Link>
              ) : (
                <span className={last ? "text-ink" : undefined} aria-current={last ? "page" : undefined}>
                  {item.label}
                </span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

export function ScreenFallback() {
  return (
    <Container>
      <div className="h-4 w-32 rounded bg-mist" />
      <div className="mt-3 h-10 w-2/3 max-w-xl rounded bg-mist" />
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <div className="h-40 rounded-3xl bg-white" />
        <div className="h-40 rounded-3xl bg-white" />
      </div>
      <p className="sr-only">Carregando o protótipo.</p>
    </Container>
  );
}

export function Missing({ title, body }: { title: string; body: string }) {
  return (
    <Container className="max-w-xl">
      <p className="text-sm font-semibold text-blue-deep">FUMEC Conecta</p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">{title}</h1>
      <p className="mt-3 text-ink-soft">{body}</p>
      <div className="mt-6 flex flex-wrap gap-2">
        <Link className="btn btn-primary" href="/">
          Ir para o início
        </Link>
        <Link className="btn btn-secondary" href="/disciplinas">
          Ver disciplinas
        </Link>
      </div>
    </Container>
  );
}
