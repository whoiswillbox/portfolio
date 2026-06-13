"use client";

import * as React from "react";
import {
  Send,
  Shuffle,
  User,
  Briefcase,
  LayoutGrid,
  Mail,
  HelpCircle,
  ArrowLeft,
  MessageSquare,
  X,
  Box,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { answerFor } from "@/lib/chat/match";
import { qaEntries, suggestedQuestionIds } from "@/lib/chat/repository";

type Message = { id: string; role: "user" | "bot"; text: string };
type Conversation = { id: string; title: string; messages: Message[] };

const STORAGE_KEY = "will-chat-conversations";

const suggestions = suggestedQuestionIds
  .map((id) => qaEntries.find((e) => e.id === id))
  .filter((e): e is NonNullable<typeof e> => Boolean(e));

const suggestionIcons: Record<string, LucideIcon> = {
  who: User,
  "what-do-you-do": Briefcase,
  projects: LayoutGrid,
  contact: Mail,
};

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function titleFrom(text: string): string {
  const t = text.trim();
  return t.length > 40 ? `${t.slice(0, 40)}…` : t;
}

export function ChatPanel() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Load persisted conversations on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setConversations(JSON.parse(raw));
    } catch {
      /* ignore corrupt storage */
    }
    setLoaded(true);
  }, []);

  // Persist whenever conversations change (after initial load).
  React.useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations));
    } catch {
      /* ignore quota errors */
    }
  }, [conversations, loaded]);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const send = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    const userMsg: Message = { id: uid(), role: "user", text: trimmed };
    const botMsg: Message = { id: uid(), role: "bot", text: answerFor(trimmed) };
    setInput("");

    if (active) {
      setConversations((prev) =>
        prev.map((c) =>
          c.id === active.id ? { ...c, messages: [...c.messages, userMsg, botMsg] } : c
        )
      );
    } else {
      const convo: Conversation = {
        id: uid(),
        title: titleFrom(trimmed),
        messages: [userMsg, botMsg],
      };
      setConversations((prev) => [convo, ...prev]);
      setActiveId(convo.id);
    }
  };

  const goHome = () => {
    setActiveId(null);
    setInput("");
  };

  const deleteConversation = (id: string) => {
    setConversations((prev) => prev.filter((c) => c.id !== id));
    if (activeId === id) setActiveId(null);
  };

  const searchForm = (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        send(input);
      }}
      className="flex items-center gap-2"
    >
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask a question…"
        aria-label="Ask a question about Will"
        className="text-body-sm"
      />
      <Button type="submit" size="icon" disabled={!input.trim()} aria-label="Send">
        <Send className="size-4" />
      </Button>
    </form>
  );

  return (
    <aside
      className="hidden w-80 shrink-0 flex-col border-l bg-sidebar lg:flex"
      style={{
        backgroundImage:
          "radial-gradient(color-mix(in oklch, var(--muted-foreground) 12%, transparent) 1px, transparent 1px)",
        backgroundSize: "16px 16px",
      }}
    >
      {active && (
        <div className="border-b p-2">
          <Button variant="ghost" size="sm" onClick={goHome} className="text-muted-foreground">
            <ArrowLeft className="size-4" />
            Back
          </Button>
        </div>
      )}
      <div
        ref={scrollRef}
        className={cn("flex-1 overflow-y-auto", !active && "flex flex-col justify-center")}
      >
        {!active ? (
          <div className="flex w-full flex-col gap-3 p-4 text-left">
            <Box className="size-8 text-white" strokeWidth={1.5} />
            <h2 className="text-h5 font-semibold tracking-tight">Learn about Will</h2>
            {searchForm}
            <div className="flex items-center gap-2 text-body-xs text-muted-foreground">
              <Shuffle className="size-3.5" />
              Pick a question, any question
            </div>
            <div className="flex flex-col">
              {suggestions.map((s, i) => {
                const Icon = suggestionIcons[s.id] ?? HelpCircle;
                return (
                  <button
                    key={s.id}
                    onClick={() => send(s.question)}
                    className={cn(
                      "flex items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-muted/60",
                      i !== 0 && "border-t"
                    )}
                  >
                    <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-muted text-muted-foreground">
                      <Icon className="size-4" />
                    </span>
                    <span className="text-body-sm">{s.question}</span>
                  </button>
                );
              })}
            </div>

            {conversations.length > 0 && (
              <div className="mt-4 flex flex-col gap-1">
                <p className="px-1 text-body-xs font-medium text-muted-foreground">
                  Conversations
                </p>
                {conversations.map((c) => (
                  <div
                    key={c.id}
                    className="group flex items-center gap-2 rounded-md px-1 transition-colors hover:bg-muted/60"
                  >
                    <button
                      onClick={() => setActiveId(c.id)}
                      className="flex min-w-0 flex-1 items-center gap-2 py-2 text-left"
                    >
                      <MessageSquare className="size-4 shrink-0 text-muted-foreground" />
                      <span className="truncate text-body-sm">{c.title}</span>
                    </button>
                    <button
                      onClick={() => deleteConversation(c.id)}
                      aria-label="Delete conversation"
                      className="shrink-0 rounded p-1 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                    >
                      <X className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex flex-col gap-3 p-4">
            {messages.map((m) =>
              m.role === "bot" ? (
                <BotBubble key={m.id} text={m.text} />
              ) : (
                <div
                  key={m.id}
                  className="ml-auto max-w-[85%] rounded-lg rounded-br-sm bg-primary px-3 py-2 text-body-sm text-primary-foreground"
                >
                  {m.text}
                </div>
              )
            )}
          </div>
        )}
      </div>

      {/* Active-conversation input pinned to the bottom */}
      {active && <div className="border-t p-3">{searchForm}</div>}
    </aside>
  );
}

function BotBubble({ text }: { text: string }) {
  return (
    <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-body-sm text-foreground">
      {text}
    </div>
  );
}
