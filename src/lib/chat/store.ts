/* ============================================================================
   Chat conversation store — the single source of truth for Box AI's saved
   conversations, shared between the chat (box-ai.tsx) and the sidebar
   (app-sidebar.tsx). Persisted to localStorage; writers notify readers in the
   same tab via a custom event (the native `storage` event only fires in OTHER
   tabs) and across tabs via `storage`.
   ========================================================================== */

export const STORAGE_KEY = "will-chat-conversations";
const CHAT_EVENT = "chat:conversations";

export type Message = { id: string; role: "user" | "bot"; text: string };

export type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  /** Topic ids already covered, so "what else" walks through new ones. */
  shown: string[];
  /** Set when the conversation is framed around a case study, so reopening it
      restores that project's side-by-side card. */
  caseStudySlug?: string;
};

export function loadConversations(): Conversation[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as Conversation[]).map((c) => ({
      ...c,
      shown: c.shown ?? [],
    }));
  } catch {
    return [];
  }
}

export function saveConversations(convos: Conversation[]): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(convos));
  } catch {
    /* ignore quota errors */
  }
  if (typeof window !== "undefined") window.dispatchEvent(new Event(CHAT_EVENT));
}

/** Subscribe to conversation changes (same tab + cross tab). Returns cleanup. */
export function subscribeConversations(cb: () => void): () => void {
  const onCustom = () => cb();
  const onStorage = (e: StorageEvent) => {
    if (e.key === STORAGE_KEY) cb();
  };
  window.addEventListener(CHAT_EVENT, onCustom);
  window.addEventListener("storage", onStorage);
  return () => {
    window.removeEventListener(CHAT_EVENT, onCustom);
    window.removeEventListener("storage", onStorage);
  };
}
