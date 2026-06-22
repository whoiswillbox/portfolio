"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  ArrowLeftIcon,
  XMarkIcon,
  CubeIcon,
  ChevronDownIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  FolderIcon,
  BuildingOffice2Icon,
  DocumentTextIcon,
  LifebuoyIcon,
  MusicalNoteIcon,
  BoltIcon,
  PuzzlePieceIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";
import { InformationCircleIcon, HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from "@heroicons/react/24/solid";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertAction } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { ChatInput } from "@/components/chat-input";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { ContactCard } from "@/components/contact-card";
import { showContactCard, stripContactMarker } from "@/lib/contact";
import { caseStudyForConversation, findCaseStudy, stripCaseStudyMarker, type CaseStudy } from "@/lib/case-studies";
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
  subscribeConversations,
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

const Lottie = React.lazy(() => import("lottie-react"));

let _animDataCache: object | null = null;
let _animDataPromise: Promise<void | null> | null = null;
function preloadBoxAnim() {
  if (_animDataCache || _animDataPromise) return;
  _animDataPromise = fetch("/animations/box.json").then(r => r.json()).then(d => { _animDataCache = d; }).catch(() => { /* ignore */ });
}

function AnimatedBoxIcon({ className }: { className?: string }) {
  const [animData, setAnimData] = React.useState<object | null>(_animDataCache);
  React.useEffect(() => {
    if (_animDataCache) { setAnimData(_animDataCache); return; }
    fetch("/animations/box.json").then(r => r.json()).then(d => { _animDataCache = d; setAnimData(d); }).catch(() => null);
  }, []);

  if (animData) {
    return (
      <React.Suspense fallback={null}>
        <div className={className} style={{ display: "flex", alignItems: "center", justifyContent: "center", filter: "grayscale(1) opacity(0.5)", overflow: "hidden" }}>
          <Lottie animationData={animData} loop style={{ width: "100%", height: "100%", flexShrink: 0 }} />
        </div>
      </React.Suspense>
    );
  }

  // Render nothing until JSON is loaded to avoid SVG→Lottie flash
  return (
    <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={cn(className, "opacity-0")} aria-hidden="true">
      <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" />
    </svg>
  );
}

function FadeOnScroll({ children }: { children: React.ReactNode }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(true);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);
  return (
    <div ref={ref} className={cn("transition-opacity duration-500", visible ? "opacity-100" : "opacity-0")}>
      {children}
    </div>
  );
}

/* Reasoning trace — keyword → steps shown while waiting for first token. */
type ReasoningStep = { label: string; Icon: React.ElementType };
const REASONING_STEPS: { keywords: string[]; steps: ReasoningStep[] }[] = [
  {
    keywords: ["project", "built", "shipped", "work", "portfolio", "design", "barbri", "technergetics", "lightcert", "swiperight", "jetdash"],
    steps: [
      { label: "Checking your projects…", Icon: FolderIcon },
      { label: "Pulling case study details…", Icon: BoltIcon },
    ],
  },
  {
    keywords: ["music", "playlist", "song", "listen", "artist", "spotify", "track"],
    steps: [
      { label: "Reading your music knowledge…", Icon: MusicalNoteIcon },
      { label: "Checking Spotify data…", Icon: MusicalNoteIcon },
    ],
  },
  {
    keywords: ["surf", "surfing", "wave", "board", "ocean", "skate"],
    steps: [
      { label: "Checking your surfing background…", Icon: LifebuoyIcon },
    ],
  },
  {
    keywords: ["experience", "job", "role", "career", "resume", "hire", "recruiter", "work at"],
    steps: [
      { label: "Reviewing your experience…", Icon: BuildingOffice2Icon },
      { label: "Checking your resume…", Icon: DocumentTextIcon },
    ],
  },
  {
    keywords: ["design", "skill", "process", "figma", "ux", "ui", "research"],
    steps: [
      { label: "Looking at your design background…", Icon: FolderIcon },
    ],
  },
  {
    keywords: ["fun", "hobby", "outside", "personal", "life", "game", "gaming"],
    steps: [
      { label: "Checking your personal interests…", Icon: PuzzlePieceIcon },
    ],
  },
  {
    keywords: ["school", "swiperight", "student", "class"],
    steps: [
      { label: "Checking your school projects…", Icon: AcademicCapIcon },
    ],
  },
];

function getReasoningSteps(query: string): ReasoningStep[] {
  const lower = query.toLowerCase();
  const matched = REASONING_STEPS.find((r) => r.keywords.some((k) => lower.includes(k)));
  return matched?.steps ?? [{ label: "Thinking…", Icon: CubeIcon }];
}

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
  seed,
}: {
  /** Rendered inside the launcher panel (which has its own close control), so
   *  the internal top bar (sidebar trigger + Back) is suppressed. */
  embedded?: boolean;
  /** Seed a fresh project/topic-framed conversation on mount (opener +
   *  follow-up prompts). May be a static case study or a dynamic seed. */
  seed?: CaseStudy | null;
} = {}) {
  const seedRef = React.useRef(seed);
  React.useEffect(() => { seedRef.current = seed; }, [seed]);
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [input, setInput] = React.useState("");
  const [loaded, setLoaded] = React.useState(false);
  React.useEffect(() => { preloadBoxAnim(); }, []);
  const [heading, setHeading] = React.useState(HEADINGS[0]);
  const [sending, setSending] = React.useState(false);
  const [thinking, setThinking] = React.useState(SURF_PHRASES[0]);
  const [thinkSecs, setThinkSecs] = React.useState(0);
  const thinkTimerRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const abortRef = React.useRef<AbortController | null>(null);
  const [reasoningSteps, setReasoningSteps] = React.useState<ReasoningStep[]>([]);
  const [visibleSteps, setVisibleSteps] = React.useState<ReasoningStep[]>([]);
  const [streamingText, setStreamingText] = React.useState("");
  const [reasoningOpen, setReasoningOpen] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<string[]>([]);

  const [usage, setUsage] = React.useState<{ date: string; count: number }>({
    date: today(),
    count: 0,
  });
  const [aiActive, setAiActive] = React.useState(false);
  const [showNotice, setShowNotice] = React.useState(false);
  // Case study opened in the right-hand content card (null = single column).
  const [openCaseStudy, setOpenCaseStudy] = React.useState<CaseStudy | null>(null);
  // Skip the case study panel enter animation when switching between conversations
  // while the panel is already visible.
  const skipCaseStudyAnim = React.useRef(false);
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
  const [isScrolled, setIsScrolled] = React.useState(false);


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

    const study = seed ?? undefined;
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
  // savingRef prevents the subscribe below from echo-looping back into setConversations
  // when the event was triggered by our own save.
  const savingRef = React.useRef(false);
  React.useEffect(() => {
    if (!loaded) return;
    savingRef.current = true;
    saveConversations(conversations);
  }, [conversations, loaded]);

  // Sync deletions made from the sidebar back into this component's state.
  // Without this, box-ai holds a stale copy and "restores" deleted conversations
  // when the user clicks a chip that matches a deleted conversation's first message.
  React.useEffect(() => {
    if (!loaded) return;
    return subscribeConversations(() => {
      if (savingRef.current) { savingRef.current = false; return; }
      setConversations(loadConversations());
    });
  }, [loaded]);

  const active = conversations.find((c) => c.id === activeId) ?? null;
  const messages = active?.messages ?? [];

  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => setIsScrolled(el.scrollTop > 40);
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [active]);

  // This view owns its top bar (SiteTopbar is hidden on /who), so it exposes
  // the sidebar trigger when the sidebar is collapsed / on mobile.
  const { state: sidebarState, isMobile } = useSidebar();
  const showTrigger = sidebarState === "collapsed" || isMobile;

  React.useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages.length, sending, streamingText]);

  // Ask the grounded LLM via /api/chat; fall back to local matching if the API
  // isn't configured, is rate-limited, or errors.
  const fetchReply = async (
    trimmed: string,
    history: Message[],
    shown: string[],
    conversationId: string,
    onToken: (token: string) => void,
    signal: AbortSignal,
  ): Promise<{ text: string; entryId: string | null; fromApi: boolean; suggestions?: string[] }> => {
    try {
      // Build page context from the current seed so the model knows what the visitor is viewing.
      // Use seedRef.current to avoid stale closure if seed prop changed between renders.
      const currentSeed = seedRef.current;
      const pageContext = currentSeed
        ? [
            `Page: ${currentSeed.title}`,
            currentSeed.meta && `Meta: ${currentSeed.meta}`,
            currentSeed.summary && `Summary: ${currentSeed.summary}`,
            ...(currentSeed.sections ?? []).map((s) => `${s.heading}: ${s.body}`),
          ].filter(Boolean).join("\n")
        : undefined;

      const res = await fetch("/api/chat", {
        method: "POST",
        signal,
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          conversationId,
          pageContext,
          messages: history.map((m) => ({
            role: m.role === "bot" ? "assistant" : "user",
            content: m.text,
          })),
        }),
      });
      if (!res.ok) throw new Error("api");
      if (!res.body) throw new Error("no body");

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let fullText = "";
      let emitted = 0; // chars already sent to onToken

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        // Only emit text that precedes any sentinel prefix.
        // We conservatively hold back the last 20 chars in case the sentinel
        // is split across chunks — flush them once we know they're clean.
        const SENTINEL = "\n\n__SUGGESTIONS__";
        const sentinelIdx = fullText.indexOf(SENTINEL);
        const safeEnd = sentinelIdx !== -1
          ? sentinelIdx                              // sentinel found — stop here
          : Math.max(emitted, fullText.length - SENTINEL.length); // hold back potential prefix
        if (safeEnd > emitted) {
          onToken(fullText.slice(emitted, safeEnd));
          emitted = safeEnd;
        }
      }
      // Flush any remaining safe text (no sentinel found)
      const sentinelIdx2 = fullText.indexOf("\n\n__SUGGESTIONS__");
      const finalEnd = sentinelIdx2 !== -1 ? sentinelIdx2 : fullText.length;
      if (finalEnd > emitted) {
        onToken(fullText.slice(emitted, finalEnd));
      }

      // Split out suggestions sentinel
      const sentinelIdx = fullText.indexOf("\n\n__SUGGESTIONS__");
      let suggestions: string[] | undefined;
      let text = fullText;
      if (sentinelIdx !== -1) {
        text = fullText.slice(0, sentinelIdx);
        try { suggestions = JSON.parse(fullText.slice(sentinelIdx + "\n\n__SUGGESTIONS__".length)); } catch { /* ignore */ }
      }

      if (!text.trim()) throw new Error("empty");
      return { text, entryId: null, fromApi: true, suggestions };
    } catch {
      // Local fallback: simulate streaming by dripping the response word by word.
      const fallback = respondTo(trimmed, shown);
      // Wait so the thinking accordion is visible before streaming starts.
      await new Promise((r) => setTimeout(r, 9000));
      for (const char of fallback.text) {
        await new Promise((r) => setTimeout(r, 12));
        onToken(char);
      }
      return { ...fallback, fromApi: false, suggestions: undefined };
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
    abortRef.current = new AbortController();
    setThinking(randomSurf());
    setThinkSecs(0);
    setStreamingText("");
    setVisibleSteps([]);
    setReasoningOpen(false);
    setSuggestions([]);
    const steps = getReasoningSteps(trimmed);
    setReasoningSteps(steps);
    setSending(true);
    const startedAt = Date.now();
    thinkTimerRef.current = setInterval(() => {
      setThinkSecs(Math.floor((Date.now() - startedAt) / 1000));
    }, 1000);

    // Reveal reasoning steps one by one, 500ms apart, starting after 400ms.
    steps.forEach((_, i) => {
      setTimeout(() => {
        setVisibleSteps((prev) => [...prev, steps[i]]);
      }, 400 + i * 500);
    });

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

    let firstToken = true;
    const reply = await fetchReply(trimmed, [...priorMessages, userMsg], shown, convoId!, (chunk) => {
      if (firstToken) {
        firstToken = false;
        if (thinkTimerRef.current) { clearInterval(thinkTimerRef.current); thinkTimerRef.current = null; }
        setReasoningOpen(false);
      }
      setStreamingText((prev) => prev + chunk);
    }, abortRef.current!.signal);

    // Keep the "thinking" indicator up for a beat so it's visible even when the
    // free local fallback answers instantly (no API call on localhost).
    const MIN_THINK_MS = 750;
    const elapsed = Date.now() - startedAt;
    if (elapsed < MIN_THINK_MS) {
      await new Promise((r) => setTimeout(r, MIN_THINK_MS - elapsed));
    }

    // Use API suggestions if available, else generate fallbacks from seed/context
    if (reply.suggestions?.length) {
      setSuggestions(reply.suggestions);
    } else {
      const fallbackSuggestions = seedRef.current?.prompts?.slice(0, 3) ?? [
        "Tell me more about your experience",
        "What's your favorite project?",
        "How can I reach you?",
      ];
      setSuggestions(fallbackSuggestions);
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
              // If this reply introduced a case study, bind it to the conversation
              // so revisiting from the sidebar routes to the project page.
              ...(cs && !c.caseStudySlug ? { caseStudySlug: cs.slug } : {}),
            }
          : c
      )
    );
    if (thinkTimerRef.current) { clearInterval(thinkTimerRef.current); thinkTimerRef.current = null; }
    setStreamingText("");
    setVisibleSteps([]);
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
      // If panel is already showing, skip the enter animation on the new study.
      skipCaseStudyAnim.current = openCaseStudy !== null;
      setOpenCaseStudy(cs);
      if (cs) setContextStudy(cs);
    },
    [conversations, openCaseStudy]
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

  const usageNote = showUsage ? (
    <p className="flex items-center gap-2 text-body-xs text-muted-foreground/60">
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

  const searchForm = (
    <ChatInput
      value={input}
      onValueChange={setInput}
      onSend={() => send(input)}
      onStop={() => { abortRef.current?.abort(); }}
      placeholder={atLimit ? "Daily limit reached" : "Ask Box…"}
      ariaLabel="Ask Box a question about Will"
      disabled={atLimit}
      sending={sending}
      footerLeft={usageNote}
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

  const disclaimer = (
    <p className="mt-2 px-1 text-center text-body-xs text-muted-foreground">
      Box never makes mistakes, no need to cross-check.
    </p>
  );

  const chatCard = (
    <ContentCard className="flex h-full w-full min-w-0 flex-col">
      {!embedded && (showTrigger || openCaseStudy || activeId) && (
        <div className="flex items-center gap-1 p-2" style={{ paddingTop: "max(0.5rem, env(safe-area-inset-top))" }}>
          {showTrigger && <SidebarTrigger />}
          {activeId && !openCaseStudy && (
            <button
              type="button"
              onClick={goHome}
              aria-label="Back"
              className="inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-body-xs uppercase tracking-wide text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <ArrowLeftIcon className="size-4" />
              Back
            </button>
          )}
          {openCaseStudy && (
            <button
              type="button"
              onClick={() => {
                const href = openCaseStudy.href;
                setOpenCaseStudy(null);
                if (href) router.push(href);
              }}
              aria-label="Go to case study"
              className="ml-auto rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
            >
              <XMarkIcon className="size-4" />
            </button>
          )}
        </div>
      )}
      <div
        ref={scrollRef}
        className={cn(
          "flex-1 min-h-0 overflow-y-auto",
          !active && "flex flex-col justify-center",
          active && isScrolled && "[mask-image:linear-gradient(to_bottom,transparent_0%,black_15%,black_100%)]",
          // Reserve a top strip so the floating sidebar trigger / close button
          // don't overlay the conversation when embedded in the launcher.
          embedded && active && "pt-12"
        )}
      >
        {!active ? (
          <div className="mx-auto flex w-full max-w-2xl flex-col gap-3 p-6 text-center">
            <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="mb-4 size-12 self-center text-foreground" aria-hidden="true">
              <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
              <path d="M22 9 L12 15 L12 25 L22 19 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
              <path d="M2 9 L12 3 L22 9 L12 15 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
            </svg>
            <h1 className="text-h1 font-semibold">{heading}</h1>
            <div className="mt-3">{searchForm}</div>
            {disclaimer}
            <div className="flex flex-wrap justify-center gap-2">
              {CHIPS.map((chip) => (
                <button
                  key={chip.prompt}
                  onClick={() => send(chip.prompt)}
                  disabled={atLimit}
                  className="rounded-lg border bg-muted/40 px-3 py-1.5 text-body-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
                >
                  {chip.label}
                </button>
              ))}
            </div>

          </div>
        ) : (
          <div className="mx-auto flex w-full max-w-xl flex-col gap-8 px-6 pb-6 pt-28">
            {messages.map((m, idx) =>
              m.role === "bot" ? (
                <BotBubble
                  key={m.id}
                  text={m.text}
                  conversationId={active?.id}
                  isLast={idx === messages.length - 1 && !sending}
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
                  className="ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-body-sm text-primary-foreground"
                >
                  {m.text}
                </div>
              )
            )}
            {sending && (
              <div className="flex w-full flex-col gap-1">
                {!streamingText && (
                  <div className="w-full rounded-lg bg-muted px-3 py-2 flex flex-col font-mono text-body-xs uppercase tracking-wide text-muted-foreground mb-2">
                    <button
                      type="button"
                      onClick={() => setReasoningOpen((o) => !o)}
                      className="flex items-center gap-2 text-left hover:text-foreground transition-colors"
                    >
                      <span className="animate-pulse">{thinking} 🏄‍♂️</span>
                      {thinkSecs > 0 && <span>{thinkSecs}s</span>}
                      <ChevronDownIcon className={cn("ml-auto size-3 transition-transform duration-300", reasoningOpen ? "rotate-0" : "-rotate-90")} />
                    </button>
                    <div className={cn("grid transition-[grid-template-rows] duration-300 ease-out", reasoningOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]")}>
                      <div className="overflow-hidden">
                        <div className="flex flex-col pt-2">
                          {visibleSteps.map((step, i) => (
                            <div key={i} className="flex gap-2 animate-in fade-in slide-in-from-bottom-1 duration-300">
                              <div className="flex flex-col items-center">
                                <step.Icon className="size-3 opacity-60 shrink-0 mt-0.5" />
                                {i < visibleSteps.length - 1 && (
                                  <span className="w-px flex-1 bg-current opacity-20 my-0.5" />
                                )}
                              </div>
                              <span className="pb-2">{step.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {streamingText && (
                  <p className="font-sans text-body-sm text-foreground">
                    {streamingText.split(" ").map((word, i) => (
                      <span key={i} className="animate-in fade-in duration-300">{i > 0 ? " " : ""}{word}</span>
                    ))}
                  </p>
                )}
                <AnimatedBoxIcon className="size-20 text-muted-foreground -ml-6" />
              </div>
            )}

            {/* Follow-up prompt chips — dynamic suggestions from API, or static case-study prompts */}
            {!sending && messages[messages.length - 1]?.role === "bot" && (
              <div className="flex flex-wrap gap-2">
                {(suggestions.length > 0 ? suggestions : (openCaseStudy ?? contextStudy)?.prompts ?? []).map((p) => (
                  <button
                    key={p}
                    onClick={() => send(p)}
                    disabled={atLimit}
                    className="rounded-lg border bg-muted/40 px-3 py-1.5 text-body-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
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
          </div>
        </div>
      )}
      </ContentCard>
  );

  // Single column when no case study is open.
  if (!openCaseStudy) {
    return <div className="h-full w-full">{chatCard}</div>;
  }

  // Side-by-side, resizable. Defaults to chat 30 / case study 70.
  return (
    <ResizablePanelGroup
      orientation={isDesktop ? "horizontal" : "vertical"}
      className="gap-2"
      style={{ overflow: "visible" }}
    >
      <ResizablePanel
        defaultSize="30%"
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
        <ContentCard className={cn("flex h-full w-full min-w-0 flex-col", !skipCaseStudyAnim.current && "duration-300 ease-out animate-in fade-in slide-in-from-right-4")}>
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
  isLast,
}: {
  text: string;
  question?: string;
  conversationId?: string;
  isLast?: boolean;
}) {
  const [rating, setRating] = React.useState<"up" | "down" | null>(null);
  const [pendingRating, setPendingRating] = React.useState<"up" | "down" | null>(null);
  const [feedbackText, setFeedbackText] = React.useState("");

  const openModal = (value: "up" | "down") => {
    if (rating === value) { setRating(null); return; }
    setPendingRating(value);
    setFeedbackText("");
  };

  const submitFeedback = () => {
    if (!pendingRating) return;
    setRating(pendingRating);
    fetch("/api/feedback", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ conversationId, question, answer: text, rating: pendingRating, feedback: feedbackText }),
    }).catch(() => { /* never let feedback break the UI */ });
    setPendingRating(null);
  };

  return (
    <>
      <Dialog open={!!pendingRating} onOpenChange={(open) => { if (!open) setPendingRating(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{pendingRating === "up" ? "Give positive feedback" : "Give negative feedback"}</DialogTitle>
          </DialogHeader>
          <textarea
            value={feedbackText}
            onChange={(e) => setFeedbackText(e.target.value)}
            placeholder={pendingRating === "up" ? "What was satisfying about this response?" : "What was wrong with this response?"}
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring min-h-[100px] resize-none"
          />
          <DialogFooter>
            <Button variant="ghost" onClick={() => setPendingRating(null)}>Cancel</Button>
            <Button onClick={submitFeedback}>Submit</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="group flex w-full flex-col gap-1">
        <p className="font-sans text-body-sm text-foreground">
          {stripCaseStudyMarker(stripContactMarker(text))}
        </p>
        {showContactCard(text) && <ContactCard />}
        <div className="flex items-center gap-0.5 pl-1">
          <button
            type="button"
            onClick={() => openModal("up")}
            aria-pressed={rating === "up"}
            aria-label="Good response"
            className={cn(
              "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95",
              rating === "up" && "text-foreground hover:text-foreground"
            )}
          >
            {rating === "up" ? <HandThumbUpSolid className="size-3.5" /> : <HandThumbUpIcon className="size-3.5" />}
          </button>
          <button
            type="button"
            onClick={() => openModal("down")}
            aria-pressed={rating === "down"}
            aria-label="Bad response"
            className={cn(
              "rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95",
              rating === "down" && "text-foreground hover:text-foreground"
            )}
          >
            {rating === "down" ? <HandThumbDownSolid className="size-3.5" /> : <HandThumbDownIcon className="size-3.5" />}
          </button>
        </div>
        {isLast && (
          <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-8 text-muted-foreground mt-1 animate-in fade-in duration-500" aria-hidden="true">
            <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
            <path d="M22 9 L12 15 L12 25 L22 19 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
            <path d="M2 9 L12 3 L22 9 L12 15 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
          </svg>
        )}
      </div>
    </>
  );
}
