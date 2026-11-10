"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

export function useQueryFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();

  function setFilters(patch: Record<string, string | null>) {
    const next = new URLSearchParams(params.toString());
    for (const [key, value] of Object.entries(patch)) {
      if (!value) next.delete(key);
      else next.set(key, value);
    }
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return { params, setFilters };
}
