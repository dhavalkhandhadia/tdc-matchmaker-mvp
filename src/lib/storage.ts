"use client";

import { ASSIGNED_CUSTOMERS, INITIAL_NOTES } from "./seedData";
import { JourneyStage, MatchmakerNote, Profile, SentMatchRecord } from "./types";

const STORAGE_KEYS = {
  AUTH: "tdc_matchmaker_session_v1",
  STAGES: "tdc_customer_stages_v1",
  NOTES: "tdc_customer_notes_v1",
  SENT_MATCHES: "tdc_sent_matches_v1",
};

export interface MatchmakerSession {
  username: string;
  name: string;
  role: string;
  loggedInAt: string;
}

export function getSession(): MatchmakerSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.AUTH);
    const session = raw ? JSON.parse(raw) : null;
    return session && ['username', 'name', 'role', 'loggedInAt'].every((key) => typeof session[key] === 'string' && session[key].trim()) ? session : null;
  } catch {
    return null;
  }
}

export function setSession(session: MatchmakerSession): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.setItem(STORAGE_KEYS.AUTH, JSON.stringify(session));
    return true;
  } catch {
    return false;
  }
}

export function clearSession(): boolean {
  if (typeof window === "undefined") return false;
  try {
    localStorage.removeItem(STORAGE_KEYS.AUTH);
    return true;
  } catch {
    return false;
  }
}

export function getCustomersWithPersistedState(): Profile[] {
  if (typeof window === "undefined") return ASSIGNED_CUSTOMERS;
  try {
    const rawStages = localStorage.getItem(STORAGE_KEYS.STAGES);
    const stageMap: Record<string, JourneyStage> = rawStages
      ? JSON.parse(rawStages)
      : {};
    return ASSIGNED_CUSTOMERS.map((c) => ({
      ...c,
      journeyStage: stageMap[c.id] || c.journeyStage,
    }));
  } catch {
    return ASSIGNED_CUSTOMERS;
  }
}

export function updateCustomerStage(
  customerId: string,
  stage: JourneyStage
): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.STAGES);
    const stageMap: Record<string, JourneyStage> = raw ? JSON.parse(raw) : {};
    stageMap[customerId] = stage;
    localStorage.setItem(STORAGE_KEYS.STAGES, JSON.stringify(stageMap));
    return true;
  } catch {
    return false;
  }
}

export function getCustomerNotes(customerId: string): MatchmakerNote[] {
  if (typeof window === "undefined") {
    return INITIAL_NOTES.filter((n) => n.customerId === customerId);
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    const allNotes: MatchmakerNote[] = raw ? JSON.parse(raw) : INITIAL_NOTES;
    return allNotes.filter((n) => n.customerId === customerId);
  } catch {
    return INITIAL_NOTES.filter((n) => n.customerId === customerId);
  }
}

export function addCustomerNote(
  note: Omit<MatchmakerNote, "id" | "createdAt">
): MatchmakerNote | null {
  if (typeof window === "undefined") return null;
  const newNote: MatchmakerNote = {
    ...note,
    id: `note-${Date.now()}`,
    createdAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.NOTES);
    const allNotes: MatchmakerNote[] = raw ? JSON.parse(raw) : INITIAL_NOTES;
    const updated = [newNote, ...allNotes];
    localStorage.setItem(STORAGE_KEYS.NOTES, JSON.stringify(updated));
    return newNote;
  } catch {
    return null;
  }
}

export function getSentMatches(customerId?: string): SentMatchRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SENT_MATCHES);
    const stored: Array<Omit<SentMatchRecord, "status"> & { status: SentMatchRecord["status"] | "Sent via Email" }> = raw ? JSON.parse(raw) : [];
    const all: SentMatchRecord[] = stored.map(({ status, ...match }) => ({
      ...match,
      status: status === "Sent via Email" ? "Draft recorded" : status,
    }));
    if (all.some((match, index) => match.status !== stored[index].status)) {
      try {
        localStorage.setItem(STORAGE_KEYS.SENT_MATCHES, JSON.stringify(all));
      } catch {
        // A failed migration write must not hide readable drafts.
      }
    }
    return customerId ? all.filter((match) => match.customerId === customerId) : all;
  } catch {
    return [];
  }
}

export function recordSentMatch(
  record: Omit<SentMatchRecord, "id" | "sentAt" | "status">
): SentMatchRecord | null {
  if (typeof window === "undefined") return null;
  const saved: SentMatchRecord = {
    ...record,
    id: `sent-${Date.now()}`,
    sentAt: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short",
    }),
    status: "Draft recorded",
  };

  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SENT_MATCHES);
    const all: SentMatchRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = all.filter(
      (x) =>
        !(
          x.customerId === record.customerId &&
          x.candidateId === record.candidateId
        )
    );
    localStorage.setItem(
      STORAGE_KEYS.SENT_MATCHES,
      JSON.stringify([saved, ...filtered])
    );
    return saved;
  } catch {
    return null;
  }
}
