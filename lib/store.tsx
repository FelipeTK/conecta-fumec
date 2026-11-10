"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { STORAGE_KEY } from "@/lib/constants";
import { buildCatalog, type Catalog } from "@/lib/catalog";
import { disciplines } from "@/lib/seed";
import type {
  Evaluation,
  Group,
  GroupRequest,
  Interest,
  InterestReply,
  LocalState,
  Material,
  MaterialRequest,
} from "@/lib/types";

const emptyLocal = (): LocalState => ({
  savedDisciplineIds: [],
  groups: [],
  interests: [],
  materials: [],
  groupRequests: [],
  interestReplies: [],
  materialRequests: [],
  evaluations: [],
});

type StoreValue = {
  local: LocalState;
  hydrated: boolean;
  catalog: Catalog;
  toggleSavedDiscipline: (id: string) => void;
  addGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  addInterest: (interest: Interest) => void;
  removeInterest: (id: string) => void;
  addMaterial: (material: Material) => void;
  removeMaterial: (id: string) => void;
  addGroupRequest: (request: GroupRequest) => void;
  removeGroupRequest: (id: string) => void;
  addInterestReply: (reply: InterestReply) => void;
  removeInterestReply: (id: string) => void;
  addMaterialRequest: (request: MaterialRequest) => void;
  removeMaterialRequest: (id: string) => void;
  addEvaluation: (evaluation: Evaluation) => void;
  resetLocal: () => void;
};

const StoreContext = createContext<StoreValue | null>(null);

function asArray<T>(value: unknown, guard: (item: unknown) => item is T): T[] {
  if (!Array.isArray(value)) return [];
  return value.filter(guard);
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isLocalId(value: unknown): value is string {
  return typeof value === "string" && value.startsWith("local-");
}

function isGroup(value: unknown): value is Group {
  return isRecord(value) && isLocalId(value.id) && typeof value.disciplineId === "string" && typeof value.title === "string";
}

function isInterest(value: unknown): value is Interest {
  return isRecord(value) && isLocalId(value.id) && typeof value.disciplineId === "string" && typeof value.note === "string";
}

function isMaterial(value: unknown): value is Material {
  return isRecord(value) && isLocalId(value.id) && typeof value.disciplineId === "string" && typeof value.title === "string";
}

function isGroupRequest(value: unknown): value is GroupRequest {
  return isRecord(value) && isLocalId(value.id) && typeof value.groupId === "string";
}

function isInterestReply(value: unknown): value is InterestReply {
  return isRecord(value) && isLocalId(value.id) && typeof value.interestId === "string";
}

function isMaterialRequest(value: unknown): value is MaterialRequest {
  return isRecord(value) && isLocalId(value.id) && typeof value.materialId === "string";
}

function isEvaluation(value: unknown): value is Evaluation {
  return isRecord(value) && isLocalId(value.id) && typeof value.foundGroup === "string" && isRecord(value.tasks);
}

function readLocal(raw: string): LocalState | null {
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!isRecord(parsed)) return null;
    const known = new Set(disciplines.map((item) => item.id));
    const saved = asArray(parsed.savedDisciplineIds, (item): item is string => typeof item === "string").filter((id) =>
      known.has(id),
    );
    return {
      savedDisciplineIds: saved,
      groups: asArray(parsed.groups, isGroup),
      interests: asArray(parsed.interests, isInterest),
      materials: asArray(parsed.materials, isMaterial),
      groupRequests: asArray(parsed.groupRequests, isGroupRequest),
      interestReplies: asArray(parsed.interestReplies, isInterestReply),
      materialRequests: asArray(parsed.materialRequests, isMaterialRequest),
      evaluations: asArray(parsed.evaluations, isEvaluation),
    };
  } catch {
    return null;
  }
}

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [local, setLocal] = useState<LocalState>(emptyLocal);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = readLocal(raw);
      if (parsed) setLocal(parsed);
    }
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(local));
  }, [hydrated, local]);

  const value = useMemo<StoreValue>(() => {
    const drop = <T extends { id: string }>(items: T[], id: string) => items.filter((item) => item.id !== id);
    return {
      local,
      hydrated,
      catalog: buildCatalog(local),
      toggleSavedDiscipline: (id) =>
        setLocal((current) => ({
          ...current,
          savedDisciplineIds: current.savedDisciplineIds.includes(id)
            ? current.savedDisciplineIds.filter((item) => item !== id)
            : [...current.savedDisciplineIds, id],
        })),
      addGroup: (group) => setLocal((current) => ({ ...current, groups: [group, ...current.groups] })),
      removeGroup: (id) =>
        setLocal((current) => ({
          ...current,
          groups: drop(current.groups, id),
          groupRequests: current.groupRequests.filter((item) => item.groupId !== id),
        })),
      addInterest: (interest) => setLocal((current) => ({ ...current, interests: [interest, ...current.interests] })),
      removeInterest: (id) =>
        setLocal((current) => ({
          ...current,
          interests: drop(current.interests, id),
          interestReplies: current.interestReplies.filter((item) => item.interestId !== id),
        })),
      addMaterial: (material) => setLocal((current) => ({ ...current, materials: [material, ...current.materials] })),
      removeMaterial: (id) =>
        setLocal((current) => ({
          ...current,
          materials: drop(current.materials, id),
          materialRequests: current.materialRequests.filter((item) => item.materialId !== id),
        })),
      addGroupRequest: (request) =>
        setLocal((current) => ({ ...current, groupRequests: [request, ...current.groupRequests] })),
      removeGroupRequest: (id) =>
        setLocal((current) => ({ ...current, groupRequests: drop(current.groupRequests, id) })),
      addInterestReply: (reply) =>
        setLocal((current) => ({ ...current, interestReplies: [reply, ...current.interestReplies] })),
      removeInterestReply: (id) =>
        setLocal((current) => ({ ...current, interestReplies: drop(current.interestReplies, id) })),
      addMaterialRequest: (request) =>
        setLocal((current) => ({ ...current, materialRequests: [request, ...current.materialRequests] })),
      removeMaterialRequest: (id) =>
        setLocal((current) => ({ ...current, materialRequests: drop(current.materialRequests, id) })),
      addEvaluation: (evaluation) =>
        setLocal((current) => ({ ...current, evaluations: [evaluation, ...current.evaluations] })),
      resetLocal: () => setLocal(emptyLocal()),
    };
  }, [hydrated, local]);

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore(): StoreValue {
  const value = useContext(StoreContext);
  if (!value) throw new Error("useStore precisa estar dentro de StoreProvider.");
  return value;
}
