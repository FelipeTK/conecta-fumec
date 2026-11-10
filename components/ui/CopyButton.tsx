"use client";

import { useState } from "react";

export function CopyButton({ text, label = "Copiar registros" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      type="button"
      className="btn btn-secondary btn-small"
      onClick={async () => {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      }}
    >
      {copied ? "Copiado" : label}
    </button>
  );
}
