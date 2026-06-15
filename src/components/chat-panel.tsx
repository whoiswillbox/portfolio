"use client";

import * as React from "react";
import {
  Send,
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
import { respondTo } from "@/lib/chat/match";
import { qaEntries, suggestedQuestionIds } from "@/lib/chat/repository";

type Message = { id: string; role: "user" | "bot"; text: string };
type Conversation = {
  id: string;
  title: string;
  messages: Message[];
  /** Topic ids already covered, so "what else" walks through new ones. */
  shown: string[];
};

const STORAGE_KEY = "will-chat-conversations";
const USAGE_KEY = "will-chat-usage";
const DAILY_LIMIT = 20; // AI messages per visitor per day

// Dev preview: when NEXT_PUBLIC_FORCE_USAGE_UI=1, show the usage counter and
// count local (free) replies too — lets you design the "messages left" / limit
// states without spending API credits. Off in production.
const FORCE_USAGE_UI = process.env.NEXT_PUBLIC_FORCE_USAGE_UI === "1";

const today = () => new Date().toISOString().slice(0, 10);

const suggestions = suggestedQuestionIds
  .map((id) => qaEntries.find((e) => e.id === id))
  .filter((e): e is NonNullable<typeof e> => Boolean(e));

const suggestionIcons: Record<string, LucideIcon> = {
  who: User,
  "what-do-you-do": Briefcase,
  projects: LayoutGrid,
  contact: Mail,
};

/* Fun, first-person headings for the empty state — picked at random. */
const HEADINGS = [
  "Ask me anything",
  "Go on, pick my brain",
  "What do you wanna know?",
  "Interrogate me",
  "Hit me with a question",
  "Let's get acquainted",
  "Curious about me?",
  "What's on your mind?",
  "Get to know me",
  "Quiz me",
];

const randomHeading = () => HEADINGS[Math.floor(Math.random() * HEADINGS.length)];

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
  const [heading, setHeading] = React.useState(HEADINGS[0]);
  const [sending, setSending] = React.useState(false);
  const [usage, setUsage] = React.useState<{ date: string; count: number }>({
    date: today(),
    count: 0,
  });
  const [aiActive, setAiActive] = React.useState(false);
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Daily AI-message counter, persisted per browser. Resets each calendar day.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(USAGE_KEY);
      if (raw) {
        const u = JSON.parse(raw);
        if (u.date === today()) setUsage(u);
      }
    } catch {
      /* ignore */
    }
  }, []);

  React.useEffect(() => {
    try {
      localStorage.setItem(USAGE_KEY, JSON.stringify(usage));
    } catch {
      /* ignore */
    }
  }, [usage]);

  const usedToday = usage.date === today() ? usage.count : 0;
  const remaining = Math.max(0, DAILY_LIMIT - usedToday);
  const showUsage = aiActive || FORCE_USAGE_UI;
  const atLimit = showUsage && remaining <= 0;
  const resetUsage = () => setUsage({ date: today(), count: 0 });

  // Randomize the heading after mount (avoids SSR hydration mismatch).
  React.useEffect(() => setHeading(randomHeading()), []);

  // Load persisted conversations on mount.
  React.useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed: Conversation[] = JSON.parse(raw);
        setConversations(parsed.map((c) => ({ ...c, shown: c.shown ?? [] })));
      }
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

  // Ask the grounded LLM via /api/chat; fall back to local matching if the API
  // isn't configured, is rate-limited, or errors.
  const fetchReply = async (
    trimmed: string,
    history: Message[],
    shown: string[]
  ): Promise<{ text: string; entryId: string | null; fromApi: boolean }> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          messages: history.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      if (!res.ok) throw new Error("api");
      const data = await res.json();
      if (typeof data.reply !== "string" || !data.reply.trim()) throw new Error("empty");
      return { text: data.reply, entryId: null, fromApi: true };
    } catch {
      return { ...respondTo(trimmed, shown), fromApi: false }; // local fallback (free)
    }
  };

  const send = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending || atLimit) return;
    const shown = active?.shown ?? [];
    const priorMessages = active?.messages ?? [];
    const userMsg: Message = { id: uid(), role: "user", text: trimmed };
    setInput("");
    setSending(true);

    // Add the user message immediately (create the conversation if needed).
    let convoId = activeId;
    if (active) {
      setConversations((prev) =>
        prev.map((c) => (c.id === active.id ? { ...c, messages: [...c.messages, userMsg] } : c))
      );
    } else {
      convoId = uid();
      setActiveId(convoId);
      setConversations((prev) => [
        { id: convoId!, title: titleFrom(trimmed), messages: [userMsg], shown: [] },
        ...prev,
      ]);
    }

    const reply = await fetchReply(trimmed, [...priorMessages, userMsg], shown);
    const botMsg: Message = { id: uid(), role: "bot", text: reply.text };

    // Only paid (API) replies count toward the daily limit — unless the dev
    // preview toggle is on, which also counts free local replies.
    if (reply.fromApi) setAiActive(true);
    if (reply.fromApi || FORCE_USAGE_UI) {
      setUsage((prev) => {
        const t = today();
        const base = prev.date === t ? prev.count : 0;
        return { date: t, count: base + 1 };
      });
    }

    setConversations((prev) =>
      prev.map((c) =>
        c.id === convoId
          ? {
              ...c,
              messages: [...c.messages, botMsg],
              shown:
                reply.entryId && !c.shown.includes(reply.entryId)
                  ? [...c.shown, reply.entryId]
                  : c.shown,
            }
          : c
      )
    );
    setSending(false);
  };

  const goHome = () => {
    setActiveId(null);
    setInput("");
    setHeading(randomHeading());
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
        placeholder={atLimit ? "Daily limit reached" : "Ask a question…"}
        aria-label="Ask a question about Will"
        className="text-body-sm"
        disabled={atLimit}
      />
      <Button
        type="submit"
        size="icon"
        disabled={!input.trim() || sending || atLimit}
        aria-label="Send"
      >
        <Send className="size-4" />
      </Button>
    </form>
  );

  const usageNote = showUsage ? (
    <p className="flex items-center gap-2 px-1 text-body-xs text-muted-foreground">
      <span>
        {atLimit
          ? "Daily limit reached — back tomorrow, or email csswillbox@gmail.com."
          : `${remaining} message${remaining === 1 ? "" : "s"} left today`}
      </span>
      {FORCE_USAGE_UI && (
        <button
          type="button"
          onClick={resetUsage}
          className="underline underline-offset-2 hover:text-foreground"
        >
          reset
        </button>
      )}
    </p>
  ) : null;

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
        className={cn("flex-1 min-h-0 overflow-y-auto", !active && "flex flex-col justify-center")}
      >
        {!active ? (
          <div className="flex w-full flex-col gap-3 p-4 text-left">
            <Box className="size-8 text-white" strokeWidth={1.5} />
            <h2 className="text-h5 font-semibold tracking-tight">{heading}</h2>
            {searchForm}
            {usageNote}
            <div className="flex flex-col">
              {suggestions.map((s, i) => {
                const Icon = suggestionIcons[s.id] ?? HelpCircle;
                return (
                  <button
                    key={s.id}
                    onClick={() => send(s.question)}
                    disabled={atLimit}
                    className={cn(
                      "flex items-center gap-3 px-1 py-3 text-left transition-colors hover:bg-muted/60 disabled:opacity-50",
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
            {sending && (
              <div className="max-w-[85%] rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-body-sm text-muted-foreground">
                <span className="inline-flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Active-conversation input pinned to the bottom */}
      {active && (
        <div className="flex flex-col gap-1 border-t p-3">
          {searchForm}
          {usageNote}
        </div>
      )}
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
