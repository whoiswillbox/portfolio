"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  XMarkIcon,
  CubeIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
} from "@heroicons/react/24/outline";
import { InformationCircleIcon } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertAction } from "@/components/ui/alert";
import { ChatInput } from "@/components/chat-input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ContactCard } from "@/components/contact-card";
import { showContactCard, stripContactMarker } from "@/lib/contact";
import { caseStudies, caseStudyForConversation, findCaseStudy, stripCaseStudyMarker, type CaseStudy } from "@/lib/case-studies";
import { ContentCard } from "@/components/content-card";
import { CaseStudyPanel } from "@/components/case-study-panel";
import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";
import { respondTo } from "@/lib/chat/match";
import {
  loadConversations,
  saveConversations,
  type Message,
  type Conversation,
} from "@/lib/chat/store";

const USAGE_KEY = "will-chat-usage";
const NOTICE_KEY = "will-chat-notice-dismissed";

// True on localhost (next dev), false in the production build.
const IS_DEV = process.env.NODE_ENV !== "production";
const DAILY_LIMIT = 20; // AI messages per visitor per day

// Dev preview: when NEXT_PUBLIC_FORCE_USAGE_UI=1, show the usage counter and
// count local (free) replies too — lets you design the "messages left" / limit
// states without spending API credits. Off in production.
const FORCE_USAGE_UI = process.env.NEXT_PUBLIC_FORCE_USAGE_UI === "1";

const today = () => new Date().toISOString().slice(0, 10);

/* Preset prompt chips for the empty state — conversational openers that map to
   topics in the repository so the local matcher (and the LLM) answer well. */
const CHIPS = [
  { label: "⭐ What's your favorite project?", prompt: "What's your favorite project?" },
  { label: "🧭 Tell me about your experience", prompt: "Tell me about your experience" },
  { label: "💼 What do you do at BARBRI?", prompt: "What do you do at BARBRI?" },
  { label: "🎨 What are your design skills?", prompt: "What are your design skills?" },
  { label: "🚀 How'd you get into product design?", prompt: "How'd you get into product design?" },
  { label: "🏄 What do you do for fun?", prompt: "What do you do for fun?" },
  { label: "📬 How can I reach you?", prompt: "How can I reach you?" },
];

/* Fun, first-person headings for the empty state — picked at random. */
const HEADINGS = [
  "Get to know the designer behind the work",
  "Curious about my design journey?",
  "Ask about my work, process, or path",
  "How'd I get into product design?",
  "Dig into my experience",
  "Wondering what I've shipped?",
  "Let's talk shop — my craft and career",
  "Pick my brain on product design",
  "Want the story behind my projects?",
  "Curious how I work?",
  "Ask me about my path into product",
  "Get the rundown on my background",
  "What's my design story?",
  "Interview me about my work",
  "Run your discovery on me",
  "Ask me how I think about design",
  "Ask me what I'm building lately",
  "Ask me about the work I'm proudest of",
  "Ask me what got me into design",
  "Ask me about my day-to-day",
  "Ask me where I've worked",
  "Ask me what drives my craft",
];

const randomHeading = () => HEADINGS[Math.floor(Math.random() * HEADINGS.length)];

/* Surf-themed "thinking" verbs, shown while a reply is generating. */
const SURF_PHRASES = [
  "Paddling out",
  "Catching the wave",
  "Dropping in",
  "Reading the swell",
  "Waxing the board",
  "Duck diving",
  "Carving",
  "Hanging ten",
  "Eyeing the set",
  "Shredding",
  "Riding the break",
  "Cruising the lineup",
  "Chasing the barrel",
  "Wiping out (kidding)",
];

const randomSurf = () => SURF_PHRASES[Math.floor(Math.random() * SURF_PHRASES.length)];

function uid(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function titleFrom(text: string): string {
  const t = text.trim();
  return t.length > 40 ? `${t.slice(0, 40)}…` : t;
}

export function BoxAI({
  embedded = false,
  seedSlug,
}: {
  /** Rendered inside the launcher panel (which has its own close control), so
   *  the internal top bar (sidebar trigger + Back) is suppressed. */
  embedded?: boolean;
  /** Seed a fresh project-framed conversation on mount (by case-study slug). */
  seedSlug?: string;
} = {}) {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  const [heading, setHeading] = React.useState(HEADINGS[0]);
  const [sending, setSending] = React.useState(false);
  const [thinking, setThinking] = React.useState(SURF_PHRASES[0]);
  const [usage, setUsage] = React.useState<{ date: string; count: number }>({
    date: today(),
    count: 0,
  });
  const [aiActive, setAiActive] = React.useState(false);
  const [showNotice, setShowNotice] = React.useState(false);
  // Case study opened in the right-hand content card (null = single column).
  const [openCaseStudy, setOpenCaseStudy] = React.useState<CaseStudy | null>(null);
  // Project context (from the page) that seeds the opener + follow-up chips
  // when the launcher is opened — without docking the side case-study panel.
  const [contextStudy, setContextStudy] = React.useState<CaseStudy | null>(null);
  // Side-by-side split resizes horizontally on desktop, vertically on mobile.
  const [isDesktop, setIsDesktop] = React.useState(true);
  React.useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const update = () => setIsDesktop(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  const scrollRef = React.useRef<HTMLDivElement>(null);


  // Show the privacy notice unless the visitor has dismissed it before. In local
  // dev we always re-show it on refresh (ignore the saved flag) so it's easy to
  // keep iterating on; in production we respect the dismissal.
  React.useEffect(() => {
    if (IS_DEV) {
      setShowNotice(true);
      return;
    }
    try {
      setShowNotice(localStorage.getItem(NOTICE_KEY) !== "1");
    } catch {
      setShowNotice(true);
    }
  }, []);

  const dismissNotice = () => {
    setShowNotice(false);
    if (IS_DEV) return; // don't persist in dev, so a refresh brings it back
    try {
      localStorage.setItem(NOTICE_KEY, "1");
    } catch {
      /* ignore */
    }
  };

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

  // Load persisted conversations on mount, and (launcher use) seed a fresh
  // project-framed conversation: a bot opener + that project's follow-up chips.
  // Load + seed live in one guarded effect so StrictMode's double-invoke can't
  // re-run load and wipe the seed, and so it only seeds once.
  const initRef = React.useRef(false);
  React.useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    let loadedConvos = loadConversations();

    // Collapse duplicate empty seeds: a conversation that's only the bot opener
    // with no user reply. The launcher used to create one on every mount, so
    // they piled up (dozens of identical empty "About <project>"). Keep at most
    // one empty seed per title so it still shows in the sidebar and stays
    // clickable; conversations with a real reply are always kept (real ones
    // start with a user message, so this can't delete anything written).
    const isEmptySeed = (c: Conversation) =>
      c.messages.length === 1 && c.messages[0].role === "bot";
    const seenEmptyTitles = new Set<string>();
    loadedConvos = loadedConvos.filter((c) => {
      if (!isEmptySeed(c)) return true;
      if (seenEmptyTitles.has(c.title)) return false;
      seenEmptyTitles.add(c.title);
      return true;
    });

    const study = seedSlug ? caseStudies[seedSlug] : undefined;
    if (study) {
      // Reuse an existing conversation about this project if the visitor already
      // has one; otherwise seed a single fresh one. Either way there's only ever
      // one "About <project>".
      const existing = loadedConvos.find((c) => c.title === `About ${study.title}`);
      if (existing) {
        setConversations(loadedConvos);
        setActiveId(existing.id);
      } else {
        const id = uid();
        const botMsg: Message = {
          id: uid(),
          role: "bot",
          text:
            study.opener ??
            `You're checking out ${study.title}. What would you like to know about it? 👇`,
        };
        setConversations([
          {
            id,
            title: `About ${study.title}`,
            messages: [botMsg],
            shown: [],
            caseStudySlug: study.slug,
          },
          ...loadedConvos,
        ]);
        setActiveId(id);
      }
      setContextStudy(study);
    } else {
      setConversations(loadedConvos);
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist whenever conversations change (after initial load). saveConversations
  // also notifies the sidebar so its list stays in sync.
  React.useEffect(() => {
    if (!loaded) return;
    saveConversations(conversations);
  }, [conversations, loaded]);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  // This view owns its top bar (SiteTopbar is hidden on /who), so it exposes
  // the sidebar trigger when the sidebar is collapsed / on mobile.
  const { state: sidebarState, isMobile } = useSidebar();
  const showTrigger = sidebarState === "collapsed" || isMobile;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  // Ask the grounded LLM via /api/chat; fall back to local matching if the API
  // isn't configured, is rate-limited, or errors.
  const fetchReply = async (
    trimmed: string,
    history: Message[],
    shown: string[],
    conversationId: string
  ): Promise<{ text: string; entryId: string | null; fromApi: boolean }> => {
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversationId,
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
    // From the empty state, re-asking a prompt that already has a conversation
    // (e.g. clicking the same chip twice) reopens it instead of spawning a
    // duplicate.
    if (!active) {
      const existing = conversations.find(
        (c) => c.messages[0]?.role === "user" && c.messages[0].text === trimmed
      );
      if (existing) {
        openConversation(existing.id);
        setInput("");
        return;
      }
    }
    const shown = active?.shown ?? [];
    const priorMessages = active?.messages ?? [];
    const userMsg: Message = { id: uid(), role: "user", text: trimmed };
    setInput("");
    setThinking(randomSurf());
    setSending(true);
    const startedAt = Date.now();

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

    const reply = await fetchReply(trimmed, [...priorMessages, userMsg], shown, convoId!);

    // Keep the "thinking" indicator up for a beat so it's visible even when the
    // free local fallback answers instantly (no API call on localhost).
    const MIN_THINK_MS = 750;
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_THINK_MS) {
      await new Promise((r) => setTimeout(r, MIN_THINK_MS - elapsed));
    }

    const botMsg: Message = { id: uid(), role: "bot", text: reply.text };

    // If the reply references a case study, open it in the side content card.
    const cs = findCaseStudy(reply.text);
    if (cs) setOpenCaseStudy(cs);

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

  const router = useRouter();
  const goHome = () => {
    setActiveId(null);
    setInput("");
    setHeading(randomHeading());
    setOpenCaseStudy(null); // close the case study panel when leaving the chat
    setContextStudy(null);
    // Drop the ?c=<id> param so the sidebar returns to the BOX home item
    // (this conversation was opened from there).
    if (!embedded) router.replace("/who");
  };

  // Open a conversation and restore its case study panel, so reopening it (from
  // the sidebar) brings back the same side-by-side view. A study-framed
  // conversation carries its slug; otherwise fall back to scanning its messages
  // for a case-study marker.
  const openConversation = React.useCallback(
    (id: string) => {
      setActiveId(id);
      const convo = conversations.find((c) => c.id === id);
      const cs =
        (convo ? caseStudyForConversation(convo) : null) ??
        convo?.messages.map((m) => findCaseStudy(m.text)).find(Boolean) ??
        null;
      setOpenCaseStudy(cs);
      if (cs) setContextStudy(cs);
    },
    [conversations]
  );

  // When arrived at via the sidebar (/who?c=<id>), open that conversation once
  // conversations have loaded.
  const requestedConvo = useSearchParams().get("c");
  React.useEffect(() => {
    if (!loaded || !requestedConvo) return;
    if (conversations.some((c) => c.id === requestedConvo)) {
      openConversation(requestedConvo);
    }
  }, [loaded, requestedConvo, conversations, openConversation]);

  const searchForm = (
    <ChatInput
      value={input}
      onValueChange={setInput}
      onSend={() => send(input)}
      placeholder={atLimit ? "Daily limit reached" : "Ask Box…"}
      ariaLabel="Ask Box a question about Will"
      disabled={atLimit}
      sending={sending}
      attachedSection={
        showNotice ? (
          <Alert className="border-0 bg-transparent p-0 text-left text-info">
            <InformationCircleIcon className="size-4" />
            <AlertDescription className="text-info/90">
              Conversations are saved to help improve Box&apos;s answers over time.
              Please don&apos;t share anything sensitive.
            </AlertDescription>
            <AlertAction>
              <button
                type="button"
                onClick={dismissNotice}
                aria-label="Dismiss"
                className="rounded p-0.5 text-info transition-colors hover:bg-info/10"
              >
                <XMarkIcon className="size-4" />
              </button>
            </AlertAction>
          </Alert>
        ) : null
      }
    />
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

  const disclaimer = (
    <p className="mt-2 px-1 text-center text-body-xs text-muted-foreground">
      Box never makes mistakes, no need to cross-check.
    </p>
  );

  const chatCard = (
    <ContentCard className="flex h-full w-full min-w-0 flex-col">
      {!embedded && (showTrigger || active) && (
        <div className="flex items-center gap-1 p-2">
          {showTrigger && <SidebarTrigger />}
          {active && (
            <Button
              variant="ghost"
              size="sm"
              onClick={goHome}
              className="font-mono text-body-xs uppercase tracking-wide text-muted-foreground"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </Button>
          )}
        </div>
      )}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 min-h-0 overflow-y-auto",
          !active && "flex flex-col justify-center",
          // Reserve a top strip so the floating sidebar trigger / close button
          // don't overlay the conversation when embedded in the launcher.
          embedded && active && "pt-12"
        )}
      >
        {!active ? (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-6 text-center">
            <CubeIcon className="mb-4 size-12 self-center text-foreground" strokeWidth={1} />
            <h1 className="text-h1 font-bold uppercase tracking-tight">{heading}</h1>
            <div className="mt-3">{searchForm}</div>
            {disclaimer}
            {usageNote}
            <div className="flex flex-wrap justify-center gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.prompt}
                  onClick={() => send(chip.prompt)}
                  disabled={atLimit}
                  className="rounded-lg border bg-muted/40 px-3 py-1.5 font-mono text-body-xs uppercase tracking-wide text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>

          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-3 p-6">
            {messages.map((m, idx) =>
              m.role === "bot" ? (
                <BotBubble
                  key={m.id}
                  text={m.text}
                  conversationId={active?.id}
                  question={
                    messages
                      .slice(0, idx)
                      .reverse()
                      .find((x) => x.role === "user")?.text
                  }
                />
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
              <div className="flex items-center gap-2 px-1 py-1 font-mono text-body-xs uppercase tracking-wide text-muted-foreground">
                <span className="animate-pulse">{thinking} 🏄‍♂️</span>
                <span className="inline-flex gap-1">
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.3s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current [animation-delay:-0.15s]" />
                  <span className="size-1.5 animate-bounce rounded-full bg-current" />
                </span>
              </div>
            )}

            {/* Case-study follow-up prompts — shown when a case study is open
                or the conversation is framed about a project, and it's the
                visitor's turn. */}
            {(openCaseStudy ?? contextStudy) &&
              !sending &&
              messages[messages.length - 1]?.role === "bot" && (
                <div className="flex flex-wrap gap-2">
                  {(openCaseStudy ?? contextStudy)!.prompts.map((p) => (
                    <button
                      key={p}
                      onClick={() => send(p)}
                      disabled={atLimit}
                      className="rounded-lg border bg-muted/40 px-3 py-1.5 font-mono text-body-xs uppercase tracking-wide text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                    >
                      {p}
                    </button>
                  ))}
                </div>
              )}
          </div>
        )}
      </div>

      {/* Active-conversation input pinned to the bottom */}
      {active && (
        <div className="p-3">
          <div className="mx-auto flex w-full max-w-xl flex-col gap-1">
            {searchForm}
            {disclaimer}
            {usageNote}
          </div>
        </div>
      )}
      </ContentCard>
  );

  // Single column when no case study is open.
  if (!openCaseStudy) {
    return <div className="h-full w-full">{chatCard}</div>;
  }

  // Side-by-side, resizable. Defaults to chat 40 / case study 60.
  return (
    <ResizablePanelGroup
      orientation={isDesktop ? "horizontal" : "vertical"}
      className="gap-2"
      style={{ overflow: "visible" }}
    >
      <ResizablePanel
        defaultSize="40%"
        minSize="30%"
        maxSize="70%"
        className="min-h-0 min-w-0"
        style={{ overflow: "visible" }}
      >
        {chatCard}
      </ResizablePanel>
      <ResizableHandle withHandle className="bg-transparent" />
      <ResizablePanel
        defaultSize="60%"
        minSize="30%"
        maxSize="70%"
        className="min-h-0 min-w-0"
        style={{ overflow: "visible" }}
      >
        <ContentCard className="flex h-full w-full min-w-0 flex-col duration-300 ease-out animate-in fade-in slide-in-from-right-4">
          <CaseStudyPanel study={openCaseStudy} />
        </ContentCard>
      </ResizablePanel>
    </ResizablePanelGroup>
  );
}

function BotBubble({
  text,
  question,
  conversationId,
}: {
  text: string;
  question?: string;
  conversationId?: string;
}) {
  const [rating, setRating] = React.useState<"up" | "down" | null>(null);
  const rate = (value: "up" | "down") =>
    setRating((prev) => {
      const next = prev === value ? null : value;
      // Record the rating (fire-and-forget). Skip when clearing a rating.
      if (next) {
        fetch("/api/feedback", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ conversationId, question, answer: text, rating: next }),
        }).catch(() => {
          /* never let feedback break the UI */
        });
      }
      return next;
    });

  return (
    <div className="group flex max-w-[85%] flex-col gap-1">
      <div className="rounded-lg rounded-bl-sm bg-muted px-3 py-2 text-body-sm text-foreground">
        {stripCaseStudyMarker(stripContactMarker(text))}
      </div>
      {showContactCard(text) && <ContactCard />}
      <div className="flex items-center gap-0.5 pl-1">
        <button
          type="button"
          onClick={() => rate("up")}
          aria-pressed={rating === "up"}
          aria-label="Good response"
          className={cn(
            "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95",
            rating === "up" && "bg-surface-success text-success hover:bg-surface-success hover:text-success"
          )}
        >
          <HandThumbUpIcon className={cn("size-3.5", rating === "up" && "fill-current")} />
        </button>
        <button
          type="button"
          onClick={() => rate("down")}
          aria-pressed={rating === "down"}
          aria-label="Bad response"
          className={cn(
            "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95",
            rating === "down" && "bg-surface-critical text-critical hover:bg-surface-critical hover:text-critical"
          )}
        >
          <HandThumbDownIcon className={cn("size-3.5", rating === "down" && "fill-current")} />
        </button>
      </div>
    </div>
  );
}
