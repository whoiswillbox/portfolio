"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  ComputerDesktopIcon,
  DevicePhoneMobileIcon,
  DeviceTabletIcon,
  HandThumbUpIcon,
  HandThumbDownIcon,
  ChevronDownIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import { HandThumbUpIcon as HandThumbUpSolid, HandThumbDownIcon as HandThumbDownSolid } from "@heroicons/react/24/solid";
import { cn } from "@/lib/utils";

type FeedbackEntry = {
  t: string;
  c?: string;
  q?: string;
  a?: string;
  rating: "up" | "down";
  feedback?: string;
};

type Entry = {
  t: string;
  q: string;
  a: string;
  country?: string;
  city?: string;
  region?: string;
  lat?: string;
  lon?: string;
  ip?: string;
  c?: string;
  page?: string;
  device?: "Desktop" | "Mobile" | "Tablet";
  os?: string;
  referrer?: string;
};

type Thread = {
  key: string;
  entries: Entry[]; // oldest → newest
  latest: number; // ms of most recent entry
  country?: string;
  city?: string;
  region?: string;
  lat?: string;
  lon?: string;
  ip?: string;
  page?: string;
  device?: "Desktop" | "Mobile" | "Tablet";
  os?: string;
  referrer?: string;
};

/* Group entries into conversation threads (by conversation id; entries with no
   id stand alone). Threads sorted newest-first; messages within oldest-first. */
function groupThreads(entries: Entry[]): Thread[] {
  const map = new Map<string, Entry[]>();
  entries.forEach((e, i) => {
    const key = e.c ?? `solo:${e.t}:${i}`;
    const arr = map.get(key) ?? [];
    arr.push(e);
    map.set(key, arr);
  });

  const threads: Thread[] = [];
  for (const [key, group] of map) {
    const sorted = [...group].sort((a, b) => +new Date(a.t) - +new Date(b.t));
    const first = sorted[0];
    threads.push({
      key,
      entries: sorted,
      latest: +new Date(sorted[sorted.length - 1].t),
      country: first.country,
      city: first.city,
      region: first.region,
      lat: first.lat,
      lon: first.lon,
      ip: first.ip,
      page: first.page,
      device: first.device,
      os: first.os,
      referrer: first.referrer,
    });
  }
  return threads.sort((a, b) => b.latest - a.latest);
}

/* Bucket a thread by when its latest message landed, so the log reads by
   session (Today / Yesterday / Past 7 Days / Older). Fixed day-count windows
   (not calendar periods), hence "Past N Days" rather than "This Week/Month". */
const DATE_GROUPS = ["Today", "Yesterday", "Past 7 Days", "Older"] as const;
type DateGroup = (typeof DATE_GROUPS)[number];

function groupOf(t: Thread, now: number): DateGroup {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const dayMs = 86_400_000;
  if (t.latest >= startOfToday) return "Today";
  if (t.latest >= startOfToday - dayMs) return "Yesterday";
  if (t.latest >= startOfToday - 7 * dayMs) return "Past 7 Days";
  return "Older";
}

/* Within "Older" (> 7 days), anything more than a month back gets nested
   under a month-year header (e.g. "June 2026") instead of piling into one
   flat list forever — 7 days to a month ago renders as a flat "Past 30 Days"
   list since that span is still small enough to scan directly. */
function isOlderThanAMonth(t: Thread, now: number): boolean {
  return now - t.latest >= 30 * 86_400_000;
}

function monthYearOf(t: Thread): string {
  return new Date(t.latest).toLocaleDateString(undefined, { month: "long", year: "numeric" });
}

/* Heuristic: does this answer read like the bot hedging or admitting it
   couldn't help? Phrase list is intentionally loose (substring match) since
   the bot's exact wording drifts over time — the goal is a rough "worth a
   second look" signal, not a precise classifier. */
const HEDGE_PHRASES = [
  "not totally sure",
  "not sure what",
  "could you rephrase",
  "can you rephrase",
  "not sure that's",
  "don't know",
  "not plugged in",
  "not really sure",
  "i'm not sure",
  "unclear what you're asking",
  "could you clarify",
];

function isHedge(text: string): boolean {
  const t = text.toLowerCase();
  return HEDGE_PHRASES.some((p) => t.includes(p));
}

function threadNeedsReview(t: Thread): boolean {
  return t.entries.some((e) => isHedge(e.a));
}

/* Rough topic classification, keyword-matched against the question text.
   Mirrors the knowledge-base categories in src/lib/chat/knowledge/ (bio,
   projects, personal, music, smalltalk) so a spike in a topic here points
   straight at which knowledge file to expand. Client-side heuristic only —
   the actual (deployed) bot has no per-answer category in the log. */
const TOPICS = [
  { id: "projects", label: "Projects / work", keywords: ["project", "barbri", "technergetics", "jetdash", "lightcert", "swiperight", "sqe2", "powerscore", "onebarbri", "design standards", "role", "case study"] },
  { id: "resume", label: "Résumé / career", keywords: ["resume", "résumé", "cv", "experience", "career", "job", "skill", "school", "education", "promoted", "hire", "salary"] },
  { id: "personal", label: "Personal / stunt / surf", keywords: ["surf", "stunt", "imdb", "double", "tribes of palos verdes", "extracurricular", "gaming", "hobby"] },
  { id: "music", label: "Music", keywords: ["music", "song", "playlist", "spotify", "band", "artist", "lorde", "listen"] },
  { id: "smalltalk", label: "Small talk", keywords: ["who are you", "how are you", "do you like", "what are you", "top rat", "bottom", "joke"] },
  { id: "contact", label: "Contact", keywords: ["contact", "email", "linkedin", "github", "reach", "hire you"] },
] as const;
type TopicId = (typeof TOPICS)[number]["id"] | "other";

function topicOf(question: string): TopicId {
  const q = question.toLowerCase();
  for (const t of TOPICS) {
    if (t.keywords.some((k) => q.includes(k))) return t.id;
  }
  return "other";
}

const TOPIC_LABELS: Record<TopicId, string> = {
  ...Object.fromEntries(TOPICS.map((t) => [t.id, t.label])),
  other: "Other",
} as Record<TopicId, string>;

/* A thread's topic is whichever category its questions hit most — a thread
   that wanders (e.g. asks about projects then music) still gets one clear
   label instead of one per message. */
function topicOfThread(t: Thread): TopicId {
  const counts = new Map<TopicId, number>();
  for (const e of t.entries) {
    const topic = topicOf(e.q);
    counts.set(topic, (counts.get(topic) ?? 0) + 1);
  }
  let best: TopicId = "other";
  let bestCount = 0;
  for (const [topic, count] of counts) {
    if (count > bestCount) {
      best = topic;
      bestCount = count;
    }
  }
  return best;
}

/* "Los Angeles, CA, US" — region (state/province) between city and country
   when available; Vercel only sends it for some countries (notably the US),
   so it silently drops out elsewhere rather than leaving a stray comma. */
function locationOf(t: Pick<Thread, "city" | "region" | "country">): string {
  return [t.city, t.region, t.country].filter(Boolean).join(", ");
}

function matches(t: Thread, query: string): boolean {
  if (!query.trim()) return true;
  const q = query.toLowerCase();
  return t.entries.some(
    (e) =>
      e.q.toLowerCase().includes(q) ||
      e.a.toLowerCase().includes(q) ||
      t.city?.toLowerCase().includes(q) ||
      t.country?.toLowerCase().includes(q)
  );
}

/* Vercel's geo headers give lat/long at roughly ISP-node precision (not an
   exact address) — enough to see the metro/neighborhood a visitor is
   routing from. Opens in the browser's default map handler when clicked. */
function mapUrl(lat: string, lon: string): string {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}

const DEVICE_ICON: Record<NonNullable<Thread["device"]>, React.ComponentType<{ className?: string }>> = {
  Desktop: ComputerDesktopIcon,
  Mobile: DevicePhoneMobileIcon,
  Tablet: DeviceTabletIcon,
};

function DeviceBadge({ device, os }: { device?: Thread["device"]; os?: string }) {
  if (!device) return null;
  const Icon = DEVICE_ICON[device];
  return (
    <span className="inline-flex items-center gap-1" title={[device, os].filter(Boolean).join(" · ")}>
      <Icon className="size-3.5 shrink-0" />
      {os && <span>{os}</span>}
    </span>
  );
}

function Meta({
  thread,
  visitCount,
  isOwner,
  onFilterByIp,
}: {
  thread: Thread;
  visitCount: number;
  isOwner: boolean;
  onFilterByIp?: (ip: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-body-xs text-muted-foreground">
      <span>{new Date(thread.latest).toLocaleString()}</span>
      {(thread.city || thread.country) && <span>· {locationOf(thread)}</span>}
      {thread.device && (
        <>
          · <DeviceBadge device={thread.device} os={thread.os} />
        </>
      )}
      {thread.page && <span>· {thread.page}</span>}
      {thread.referrer && thread.referrer !== "Direct" && (
        <span>· via {thread.referrer}</span>
      )}
      {thread.lat && thread.lon && (
        <>
          ·{" "}
          <a
            href={mapUrl(thread.lat, thread.lon)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="underline decoration-dotted underline-offset-2 hover:text-foreground"
          >
            View on map
          </a>
        </>
      )}
      {thread.ip && (
        <span>
          ·{" "}
          {onFilterByIp ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFilterByIp(thread.ip!); }}
              className="underline decoration-dotted underline-offset-2 hover:text-foreground"
              title="Show all conversations from this visitor"
            >
              {thread.ip}
            </button>
          ) : (
            thread.ip
          )}
        </span>
      )}
      {isOwner ? (
        <span className="rounded-full bg-muted px-1.5 py-0.5 text-foreground" title="Matches your own IP — likely you testing">
          It&rsquo;s me
        </span>
      ) : (
        visitCount > 1 && (
          onFilterByIp ? (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onFilterByIp(thread.ip!); }}
              className="rounded-full bg-surface-info px-1.5 py-0.5 text-info transition-opacity hover:opacity-80"
              title="Show all conversations from this visitor"
            >
              Returning · {visitCount} visits
            </button>
          ) : (
            <span className="rounded-full bg-surface-info px-1.5 py-0.5 text-info" title="Same visitor has messaged before">
              Returning · {visitCount} visits
            </span>
          )
        )
      )}
    </div>
  );
}

function TopicPill({ topic }: { topic: TopicId }) {
  return (
    <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-body-xs text-muted-foreground">
      {TOPIC_LABELS[topic]}
    </span>
  );
}

/* A one-off (single message) thread — the least signal in the log, so it's a
   dense single row: question as the title, no answer preview. Selecting it
   shows the full detail (question + answer + metadata) in the right pane. */
/* A thread's card in the left-pane list — one message or many, same
   treatment (message count, flag, topic, first question, metadata line) so
   the list reads consistently regardless of depth. Selecting it shows the
   full transcript in the right pane. */
function ThreadCard({
  thread,
  visitCount,
  isOwner,
  selected,
  onSelect,
}: {
  thread: Thread;
  visitCount: number;
  isOwner: boolean;
  selected: boolean;
  onSelect: () => void;
}) {
  const first = thread.entries[0];
  const flagged = threadNeedsReview(thread);

  return (
    <button
      type="button"
      onClick={onSelect}
      className={cn(
        "flex w-full flex-col gap-2 rounded-lg border px-3 py-2.5 text-left transition-colors",
        flagged && "border-caution/50",
        selected ? "bg-muted" : "hover:bg-muted/50"
      )}
    >
      <div className="flex items-center gap-2">
        <span className="text-body-xs font-medium text-foreground">
          {thread.entries.length} messages
        </span>
        {flagged && (
          <ExclamationTriangleIcon className="size-3.5 shrink-0 text-caution" aria-label="Bot may not have answered well somewhere in this thread" />
        )}
        <TopicPill topic={topicOfThread(thread)} />
      </div>
      <p className="truncate text-body-sm font-medium text-foreground">{first.q}</p>
      <p className="truncate text-body-xs text-muted-foreground">
        {new Date(thread.latest).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        {(thread.city || thread.country) && ` · ${locationOf(thread)}`}
        {isOwner && " · It's me"}
        {!isOwner && visitCount > 1 && " · Returning"}
      </p>
    </button>
  );
}

/* A labelled group of threads — conversations (2+ messages) lead as full
   cards, one-offs follow as a dense list. Shared between the top-level date
   groups and the nested month-year sub-groups under "Older". */
function ThreadGroupList({
  label,
  threads,
  visitCountByIp,
  isOwnerThread,
  selectedKey,
  onSelect,
  defaultOpen = true,
}: {
  label: string;
  threads: Thread[];
  visitCountByIp: Map<string, number>;
  isOwnerThread: (t: Thread) => boolean;
  selectedKey: string | null;
  onSelect: (key: string) => void;
  /** Only Today / Yesterday / Past 7 Days start open — everything older
      (Past 30 Days, month-year groups) starts collapsed since it's usually
      the bulk of the list and not what you're scanning for by default. */
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = React.useState(defaultOpen);
  return (
    <div className="flex flex-col gap-2">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex items-center gap-1 text-body-xs font-medium uppercase tracking-wide text-muted-foreground hover:text-foreground"
      >
        <ChevronDownIcon className={cn("size-3 shrink-0 transition-transform", !open && "-rotate-90")} />
        {label}
        <span className="normal-case tracking-normal text-muted-foreground/70">({threads.length})</span>
      </button>
      {open && (
        <div className="flex flex-col gap-2">
          {threads.map((thread) => (
            <ThreadCard
              key={thread.key}
              thread={thread}
              visitCount={thread.ip ? visitCountByIp.get(thread.ip) ?? 1 : 1}
              isOwner={isOwnerThread(thread)}
              selected={thread.key === selectedKey}
              onSelect={() => onSelect(thread.key)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* Delete requires an explicit second click (Delete → Confirm?) rather than a
   modal — fewer moving parts for a single destructive action, and the
   confirm state auto-resets if you click elsewhere (onBlur) or navigate. */
function DeleteThreadButton({ onDelete }: { onDelete: () => void }) {
  const [confirming, setConfirming] = React.useState(false);
  return (
    <button
      type="button"
      onClick={() => {
        if (confirming) {
          onDelete();
          setConfirming(false);
        } else {
          setConfirming(true);
        }
      }}
      onBlur={() => setConfirming(false)}
      className={cn(
        "ml-auto flex shrink-0 items-center gap-1.5 rounded-lg border px-2.5 py-1 text-body-xs transition-colors",
        confirming
          ? "border-critical/50 bg-surface-critical text-critical"
          : "border-input bg-background text-muted-foreground hover:border-critical/50 hover:text-critical"
      )}
    >
      <TrashIcon className="size-3.5 shrink-0" />
      {confirming ? "Confirm delete?" : "Delete"}
    </button>
  );
}

/* Right pane — the full transcript + all metadata for the selected thread.
   Mirrors the real Box AI transcript styling (BotBubble / user bubble in
   box-ai.tsx) so a logged conversation reads exactly like it did live —
   right-aligned dark pill for the question, plain text + thumbs row for the
   answer. Thumbs reflect the ACTUAL recorded rating (solid + colored icon)
   when feedback exists for that message, joined from the separate feedback
   log by conversation id + answer text; otherwise shown outlined/inert. */
function ThreadDetail({
  thread,
  visitCount,
  isOwner,
  feedbackFor,
  onFilterByIp,
  onDelete,
}: {
  thread: Thread;
  visitCount: number;
  isOwner: boolean;
  feedbackFor: (conversationId: string | undefined, answer: string) => FeedbackEntry | undefined;
  onFilterByIp: (ip: string) => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex h-full flex-col gap-4 overflow-y-auto p-4">
      <div className="flex items-start gap-2">
        <Meta thread={thread} visitCount={visitCount} isOwner={isOwner} onFilterByIp={onFilterByIp} />
        <DeleteThreadButton onDelete={onDelete} />
      </div>
      <div className="flex flex-col gap-4">
        {thread.entries.map((e, i) => {
          const fb = feedbackFor(thread.key, e.a);
          const rating = fb?.rating;
          return (
            <div key={i} className="flex flex-col gap-3">
              <div className="ml-auto max-w-[85%] rounded-lg bg-primary px-3 py-2 text-body-sm text-primary-foreground">
                {e.q}
              </div>
              <div className="flex w-full flex-col gap-1">
                <p className={cn("font-sans text-body-sm", isHedge(e.a) ? "text-caution" : "text-foreground")}>
                  {e.a}
                </p>
                {rating && (
                  <div className="flex items-center gap-2 pl-1">
                    {rating === "up" ? (
                      <span className="rounded-md p-1.5 text-success">
                        <HandThumbUpSolid className="size-3.5" />
                      </span>
                    ) : (
                      <span className="rounded-md p-1.5 text-critical">
                        <HandThumbDownSolid className="size-3.5" />
                      </span>
                    )}
                    <span className={cn("text-body-xs font-medium", rating === "up" ? "text-success" : "text-critical")}>
                      {rating === "up" ? "Helpful" : "Not helpful"}
                    </span>
                  </div>
                )}
                {fb?.feedback && (
                  <p className="mt-1 border-l-2 border-border pl-2 text-body-sm italic text-muted-foreground">
                    &ldquo;{fb.feedback}&rdquo;
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function ChatLogPage() {
  const router = useRouter();
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [feedback, setFeedback] = React.useState<FeedbackEntry[]>([]);
  const [ownerIps, setOwnerIps] = React.useState<string[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [reviewOnly, setReviewOnly] = React.useState(false);
  const [ratingFilter, setRatingFilter] = React.useState<"all" | "up" | "down">("all");
  const [topicFilter, setTopicFilter] = React.useState<TopicId | "all">("all");
  const [ipFilter, setIpFilter] = React.useState<string | null>(null);
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chat-log", { cache: "no-store" });
        if (res.status === 401) {
          router.replace("/admin/login?next=/admin/chat");
          return;
        }
        if (res.status === 501) {
          setError("ADMIN_KEY isn't set on the server.");
          return;
        }
        if (!res.ok) {
          setError("Couldn't load the log.");
          return;
        }
        const data = await res.json();
        setEntries(data.log ?? []);
        setFeedback(data.feedback ?? []);
        setOwnerIps(data.ownerIps ?? []);
      } catch {
        setError("Network error.");
      }
    })();
  }, [router]);
  const isOwnerThread = React.useCallback(
    (t: Thread) => Boolean(t.ip && ownerIps.includes(t.ip)),
    [ownerIps]
  );
  // Feedback is a SEPARATE log (own Redis list), joined here by conversation
  // id + answer text — both are truncated to the same 300 chars server-side
  // (see logChat/logFeedback), so an exact match is reliable.
  const feedbackFor = React.useCallback(
    (conversationId: string | undefined, answer: string): FeedbackEntry | undefined =>
      feedback.find((f) => f.c === conversationId && f.a === answer),
    [feedback]
  );

  const allThreads = React.useMemo(() => (entries ? groupThreads(entries) : []), [entries]);
  // Returning-visitor detection — the IP is a one-way hash (never the raw
  // address, see lib/chat/log.ts), but the SAME hash showing up across
  // multiple distinct threads means the same person came back, which is a
  // much stronger engagement signal than message count alone. Owner traffic
  // (ownerIps) is excluded — that's just testing, not a real visitor.
  const visitCountByIp = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of allThreads) {
      if (!t.ip || ownerIps.includes(t.ip)) continue;
      counts.set(t.ip, (counts.get(t.ip) ?? 0) + 1);
    }
    return counts;
  }, [allThreads, ownerIps]);
  const reviewCount = React.useMemo(
    () => allThreads.filter(threadNeedsReview).length,
    [allThreads]
  );
  const helpfulCount = React.useMemo(
    () => allThreads.filter((t) => t.entries.some((e) => feedbackFor(t.key, e.a)?.rating === "up")).length,
    [allThreads, feedbackFor]
  );
  const notHelpfulCount = React.useMemo(
    () => allThreads.filter((t) => t.entries.some((e) => feedbackFor(t.key, e.a)?.rating === "down")).length,
    [allThreads, feedbackFor]
  );
  // Topic breakdown — how many threads land in each category, sorted busiest
  // first, so a glance at the counts tells you where visitors' interest (and
  // the knowledge base's gaps) actually concentrate.
  const topicCounts = React.useMemo(() => {
    const counts = new Map<TopicId, number>();
    for (const t of allThreads) {
      const topic = topicOfThread(t);
      counts.set(topic, (counts.get(topic) ?? 0) + 1);
    }
    return [...counts.entries()].sort((a, b) => b[1] - a[1]);
  }, [allThreads]);
  const threadHasRating = React.useCallback(
    (t: Thread, rating: "up" | "down") => t.entries.some((e) => feedbackFor(t.key, e.a)?.rating === rating),
    [feedbackFor]
  );
  const threads = React.useMemo(
    () =>
      allThreads
        .filter((t) => matches(t, query))
        .filter((t) => !reviewOnly || threadNeedsReview(t))
        .filter((t) => ratingFilter === "all" || threadHasRating(t, ratingFilter))
        .filter((t) => topicFilter === "all" || topicOfThread(t) === topicFilter)
        .filter((t) => !ipFilter || t.ip === ipFilter),
    [allThreads, query, reviewOnly, ratingFilter, topicFilter, ipFilter, threadHasRating]
  );
  const now = React.useMemo(() => Date.now(), []);
  const grouped = React.useMemo(() => {
    const map = new Map<DateGroup, Thread[]>();
    for (const g of DATE_GROUPS) map.set(g, []);
    for (const t of threads) map.get(groupOf(t, now))!.push(t);
    return map;
  }, [threads, now]);
  const selectedThread = React.useMemo(
    () => allThreads.find((t) => t.key === selectedKey) ?? null,
    [allThreads, selectedKey]
  );

  // A real conversation's key IS its conversation id (see groupThreads); a
  // one-off "solo" thread's key is a synthetic solo:<timestamp>:<index>
  // string with no server-side id, so its single entry's own timestamp is
  // what identifies it to the delete endpoint instead.
  const handleDeleteThread = React.useCallback(async (thread: Thread) => {
    const body = thread.key.startsWith("solo:")
      ? { timestamp: thread.entries[0].t }
      : { conversationId: thread.key };
    try {
      const res = await fetch("/api/chat-log", {
        method: "DELETE",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) return;
    } catch {
      return;
    }
    // Optimistic local removal — drop every entry that belonged to this
    // thread instead of re-fetching the whole log.
    setEntries((prev) =>
      prev?.filter((e) =>
        thread.key.startsWith("solo:") ? e.t !== thread.entries[0].t : e.c !== thread.key
      ) ?? null
    );
    setSelectedKey((k) => (k === thread.key ? null : k));
  }, []);

  return (
    <div className="mx-auto flex h-full min-h-0 w-full max-w-6xl flex-col">
      <div className="shrink-0 px-1">
        <h1 className="text-h3 tracking-tight">Chat history</h1>
        <p className="mt-1 text-body-sm text-muted-foreground">
          What visitors have asked the AI assistant (most recent first).
        </p>
        {error && <p className="mt-4 text-body-sm text-critical">{error}</p>}
      </div>

      {entries && (
        <div className="mt-6 flex min-h-0 flex-1 flex-col gap-4">
          {/* Shared header — search and all filters apply to both panes (they
              narrow the left list; the right pane just shows whatever's
              selected from that narrowed list). */}
          <div className="flex shrink-0 flex-col gap-3 px-1">
            <div className="flex items-center gap-2">
              <div className="flex h-8 max-w-sm flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 dark:bg-input/30">
                <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search…"
                  className="w-full bg-transparent text-body-sm outline-none placeholder:text-muted-foreground"
                />
              </div>

              <button
                type="button"
                onClick={() => setReviewOnly((v) => !v)}
                disabled={reviewCount === 0}
                className={cn(
                  "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-body-sm transition-colors disabled:opacity-40",
                  reviewOnly
                    ? "border-caution/50 bg-surface-caution text-caution"
                    : "border-input bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <ExclamationTriangleIcon className="size-3.5 shrink-0" />
                Needs review{reviewCount > 0 ? ` (${reviewCount})` : ""}
              </button>

              {/* Rating filter — Helpful / Not helpful, from the separate
                  feedback log joined in via feedbackFor. */}
              <button
                type="button"
                onClick={() => setRatingFilter((v) => (v === "up" ? "all" : "up"))}
                disabled={helpfulCount === 0}
                className={cn(
                  "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-body-sm transition-colors disabled:opacity-40",
                  ratingFilter === "up"
                    ? "border-success/50 bg-surface-success text-success"
                    : "border-input bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <HandThumbUpIcon className="size-3.5 shrink-0" />
                Helpful{helpfulCount > 0 ? ` (${helpfulCount})` : ""}
              </button>
              <button
                type="button"
                onClick={() => setRatingFilter((v) => (v === "down" ? "all" : "down"))}
                disabled={notHelpfulCount === 0}
                className={cn(
                  "flex h-8 shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 text-body-sm transition-colors disabled:opacity-40",
                  ratingFilter === "down"
                    ? "border-critical/50 bg-surface-critical text-critical"
                    : "border-input bg-background text-muted-foreground hover:text-foreground"
                )}
              >
                <HandThumbDownIcon className="size-3.5 shrink-0" />
                Not helpful{notHelpfulCount > 0 ? ` (${notHelpfulCount})` : ""}
              </button>
            </div>

            {/* Active visitor filter — set by clicking a visitor's IP hash or
                "Returning" badge in the detail pane, so their whole history
                is browsable instead of just a count. */}
            {ipFilter && (
              <div className="flex items-center gap-1.5 rounded-lg bg-surface-info px-3 py-1.5 text-body-sm text-info">
                <span>Showing conversations from {ipFilter}</span>
                <button
                  type="button"
                  onClick={() => setIpFilter(null)}
                  className="ml-auto text-body-xs underline decoration-dotted underline-offset-2 hover:opacity-80"
                >
                  Clear
                </button>
              </div>
            )}

            {/* Topic breakdown — busiest first. Click a pill to filter the list
                to that topic; click again (or All) to clear. Directly answers
                "what should I add more knowledge-base content about". */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setTopicFilter("all")}
                className={cn(
                  "rounded-full px-2.5 py-1 text-body-xs transition-colors",
                  topicFilter === "all"
                    ? "bg-foreground text-background"
                    : "bg-muted text-muted-foreground hover:text-foreground"
                )}
              >
                All ({allThreads.length})
              </button>
              {topicCounts.map(([topic, count]) => (
                <button
                  key={topic}
                  type="button"
                  onClick={() => setTopicFilter((v) => (v === topic ? "all" : topic))}
                  className={cn(
                    "rounded-full px-2.5 py-1 text-body-xs transition-colors",
                    topicFilter === topic
                      ? "bg-foreground text-background"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  )}
                >
                  {TOPIC_LABELS[topic]} ({count})
                </button>
              ))}
            </div>
          </div>

          <div className="flex min-h-0 flex-1 gap-4">
            {/* Left pane — selectable list, narrowed by the shared filters above. */}
            <div className="flex w-full max-w-sm shrink-0 flex-col gap-3 overflow-y-auto pr-1">
              {threads.length === 0 && (
                <p className="text-body-sm text-muted-foreground">
                  {reviewOnly
                    ? "No flagged conversations."
                    : ratingFilter !== "all"
                      ? ratingFilter === "up"
                        ? "No conversations rated helpful."
                        : "No conversations rated not helpful."
                      : query
                        ? "No conversations match your search."
                        : "No messages yet."}
                </p>
              )}

              {DATE_GROUPS.map((g) => {
                const threadsInGroup = grouped.get(g) ?? [];
                if (threadsInGroup.length === 0) return null;

                if (g !== "Older") {
                  return (
                    <ThreadGroupList
                      key={g}
                      label={g}
                      threads={threadsInGroup}
                      visitCountByIp={visitCountByIp}
                      isOwnerThread={isOwnerThread}
                      selectedKey={selectedKey}
                      onSelect={setSelectedKey}
                    />
                  );
                }

                // "Older" (> 7 days): anything within the last month stays a
                // flat list; beyond that, nest under a month-year header so
                // the list doesn't turn into one endless pile over time.
                const recentOlder = threadsInGroup.filter((t) => !isOlderThanAMonth(t, now));
                const monthsAgo = threadsInGroup.filter((t) => isOlderThanAMonth(t, now));
                const byMonth = new Map<string, Thread[]>();
                for (const t of monthsAgo) {
                  const label = monthYearOf(t);
                  const arr = byMonth.get(label) ?? [];
                  arr.push(t);
                  byMonth.set(label, arr);
                }
                return (
                  <React.Fragment key={g}>
                    {recentOlder.length > 0 && (
                      <ThreadGroupList
                        label="Past 30 Days"
                        threads={recentOlder}
                        visitCountByIp={visitCountByIp}
                        isOwnerThread={isOwnerThread}
                        selectedKey={selectedKey}
                        onSelect={setSelectedKey}
                        defaultOpen={false}
                      />
                    )}
                    {[...byMonth.entries()].map(([label, monthThreads]) => (
                      <ThreadGroupList
                        key={label}
                        label={label}
                        threads={monthThreads}
                        visitCountByIp={visitCountByIp}
                        isOwnerThread={isOwnerThread}
                        selectedKey={selectedKey}
                        onSelect={setSelectedKey}
                        defaultOpen={false}
                      />
                    ))}
                  </React.Fragment>
                );
              })}
            </div>

            {/* Right pane — the selected thread's full transcript. */}
            <div className="min-h-0 flex-1 overflow-hidden rounded-lg border border-border">
              {selectedThread ? (
                <ThreadDetail
                  thread={selectedThread}
                  visitCount={selectedThread.ip ? visitCountByIp.get(selectedThread.ip) ?? 1 : 1}
                  isOwner={isOwnerThread(selectedThread)}
                  feedbackFor={feedbackFor}
                  onFilterByIp={setIpFilter}
                  onDelete={() => handleDeleteThread(selectedThread)}
                />
              ) : (
                <div className="flex h-full items-center justify-center text-body-sm text-muted-foreground">
                  Select a conversation to view it
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
