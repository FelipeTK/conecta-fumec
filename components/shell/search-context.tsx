"use client";

import { createContext, useContext } from "react";

type SearchContextValue = {
  openSearch: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({
  children,
  openSearch,
}: {
  children: React.ReactNode;
  openSearch: () => void;
}) {
  return <SearchContext.Provider value={{ openSearch }}>{children}</SearchContext.Provider>;
}

export function useSearch(): SearchContextValue {
  const value = useContext(SearchContext);
  if (!value) throw new Error("useSearch precisa estar dentro de SearchProvider.");
  return value;
}
