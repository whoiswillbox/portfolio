"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, ChevronDownIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

type Entry = {
  t: string;
  q: string;
  a: string;
  country?: string;
  city?: string;
  lat?: string;
  lon?: string;
  ip?: string;
  c?: string;
};

type Thread = {
  key: string;
  entries: Entry[]; // oldest → newest
  latest: number; // ms of most recent entry
  country?: string;
  city?: string;
  lat?: string;
  lon?: string;
  ip?: string;
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
      lat: first.lat,
      lon: first.lon,
      ip: first.ip,
    });
  }
  return threads.sort((a, b) => b.latest - a.latest);
}

/* Bucket a thread by when its latest message landed, so the log reads by
   session (Today / Yesterday / Previous 7 Days / Older) — same convention as
   the public Conversations page. */
const DATE_GROUPS = ["Today", "Yesterday", "Previous 7 Days", "Older"] as const;
type DateGroup = (typeof DATE_GROUPS)[number];

function groupOf(t: Thread, now: number): DateGroup {
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const dayMs = 86_400_000;
  if (t.latest >= startOfToday) return "Today";
  if (t.latest >= startOfToday - dayMs) return "Yesterday";
  if (t.latest >= startOfToday - 7 * dayMs) return "Previous 7 Days";
  return "Older";
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

/* A small filled-pill depth indicator — darker/bolder the deeper the thread,
   so a 10-message conversation visually outweighs a 1-message drive-by
   without needing to open either. Capped at 5 dots so it doesn't grow
   unboundedly for very long threads. */
function DepthPips({ count }: { count: number }) {
  const filled = Math.min(count, 5);
  return (
    <span className="flex items-center gap-0.5" aria-hidden>
      {Array.from({ length: 5 }, (_, i) => (
        <span
          key={i}
          className={cn(
            "size-1.5 rounded-full",
            i < filled ? "bg-foreground" : "bg-border"
          )}
        />
      ))}
    </span>
  );
}

/* Vercel's geo headers give lat/long at roughly ISP-node precision (not an
   exact address) — enough to see the metro/neighborhood a visitor is
   routing from. Opens in the browser's default map handler. */
function mapUrl(lat: string, lon: string): string {
  return `https://www.google.com/maps?q=${lat},${lon}`;
}

function Meta({ thread, visitCount }: { thread: Thread; visitCount: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 text-body-xs text-muted-foreground">
      <span>{new Date(thread.latest).toLocaleString()}</span>
      {(thread.city || thread.country) && (
        <span>· {[thread.city, thread.country].filter(Boolean).join(", ")}</span>
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
      {thread.ip && <span>· {thread.ip}</span>}
      {visitCount > 1 && (
        <span className="rounded-full bg-surface-info px-1.5 py-0.5 text-info" title="Same visitor has messaged before">
          Returning · {visitCount} visits
        </span>
      )}
    </div>
  );
}

/* A one-off (single message) thread — the least signal in the log, so it
   renders as a dense single row: question as the title, no card padding, no
   answer preview. Click to reveal the answer inline. */
function TopicPill({ topic }: { topic: TopicId }) {
  return (
    <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-body-xs text-muted-foreground">
      {TOPIC_LABELS[topic]}
    </span>
  );
}

function SoloRow({ thread, visitCount }: { thread: Thread; visitCount: number }) {
  const [open, setOpen] = React.useState(false);
  const entry = thread.entries[0];
  const flagged = isHedge(entry.a);
  return (
    <div className="border-b border-border/60 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-start gap-3 py-2 text-left"
      >
        <ChevronDownIcon
          className={cn(
            "mt-1 size-3 shrink-0 text-muted-foreground transition-transform",
            open && "rotate-180"
          )}
        />
        <div className="flex min-w-0 flex-1 flex-col gap-0.5">
          <div className="flex items-center gap-1.5">
            {flagged && (
              <ExclamationTriangleIcon className="size-3.5 shrink-0 text-caution" aria-label="Bot may not have answered this well" />
            )}
            {visitCount > 1 && (
              <span className="shrink-0 rounded-full bg-surface-info px-1.5 py-0.5 text-body-xs text-info" title="Same visitor has messaged before">
                Returning
              </span>
            )}
            <p className="truncate text-body-sm text-foreground">{entry.q}</p>
          </div>
          {open && <p className="text-body-sm text-muted-foreground">{entry.a}</p>}
        </div>
        <TopicPill topic={topicOf(entry.q)} />
        <span className="shrink-0 text-body-xs text-muted-foreground">
          {new Date(thread.latest).toLocaleDateString(undefined, { month: "short", day: "numeric" })}
        </span>
      </button>
    </div>
  );
}

/* A real conversation (2+ messages) — the highest-signal rows, so they keep
   the fuller card treatment: depth pips + message count up front, first
   question as the collapsed title, full transcript on expand. */
function ThreadCard({ thread, visitCount }: { thread: Thread; visitCount: number }) {
  const [open, setOpen] = React.useState(false);
  const first = thread.entries[0];
  const flagged = threadNeedsReview(thread);

  return (
    <div className={cn("rounded-lg border", flagged && "border-caution/50")}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full flex-col gap-2 px-3 py-2.5 text-left"
      >
        <div className="flex items-center gap-2">
          <DepthPips count={thread.entries.length} />
          <span className="text-body-xs font-medium text-foreground">
            {thread.entries.length} messages
          </span>
          {flagged && (
            <ExclamationTriangleIcon className="size-3.5 shrink-0 text-caution" aria-label="Bot may not have answered well somewhere in this thread" />
          )}
          <TopicPill topic={topicOfThread(thread)} />
          <ChevronDownIcon
            className={cn("ml-auto size-3.5 shrink-0 text-muted-foreground transition-transform", open && "rotate-180")}
          />
        </div>
        <Meta thread={thread} visitCount={visitCount} />
        {!open && (
          <p className="truncate text-body-sm font-medium text-foreground">{first.q}</p>
        )}
      </button>
      {open && (
        <div className="flex flex-col gap-3 border-t px-3 py-3">
          {thread.entries.map((e, i) => (
            <div key={i} className="flex flex-col gap-1">
              <p className="text-body-sm font-medium">{e.q}</p>
              <p className={cn("text-body-sm", isHedge(e.a) ? "text-caution" : "text-muted-foreground")}>{e.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function ChatLogPage() {
  const router = useRouter();
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [query, setQuery] = React.useState("");
  const [reviewOnly, setReviewOnly] = React.useState(false);
  const [topicFilter, setTopicFilter] = React.useState<TopicId | "all">("all");

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
      } catch {
        setError("Network error.");
      }
    })();
  }, [router]);

  const allThreads = React.useMemo(() => (entries ? groupThreads(entries) : []), [entries]);
  const conversationCount = React.useMemo(
    () => allThreads.filter((t) => t.entries.length > 1).length,
    [allThreads]
  );
  const soloCount = allThreads.length - conversationCount;
  // Returning-visitor detection — the IP is a one-way hash (never the raw
  // address, see lib/chat/log.ts), but the SAME hash showing up across
  // multiple distinct threads means the same person came back, which is a
  // much stronger engagement signal than message count alone.
  const visitCountByIp = React.useMemo(() => {
    const counts = new Map<string, number>();
    for (const t of allThreads) {
      if (!t.ip) continue;
      counts.set(t.ip, (counts.get(t.ip) ?? 0) + 1);
    }
    return counts;
  }, [allThreads]);
  const returningCount = React.useMemo(
    () => [...visitCountByIp.values()].filter((n) => n > 1).length,
    [visitCountByIp]
  );
  const reviewCount = React.useMemo(
    () => allThreads.filter(threadNeedsReview).length,
    [allThreads]
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
  const threads = React.useMemo(
    () =>
      allThreads
        .filter((t) => matches(t, query))
        .filter((t) => !reviewOnly || threadNeedsReview(t))
        .filter((t) => topicFilter === "all" || topicOfThread(t) === topicFilter),
    [allThreads, query, reviewOnly, topicFilter]
  );
  const now = React.useMemo(() => Date.now(), []);
  const grouped = React.useMemo(() => {
    const map = new Map<DateGroup, Thread[]>();
    for (const g of DATE_GROUPS) map.set(g, []);
    for (const t of threads) map.get(groupOf(t, now))!.push(t);
    return map;
  }, [threads, now]);

  return (
    <div className="mx-auto w-full max-w-3xl">
      <h1 className="text-h3 tracking-tight">Chat log</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        What visitors have asked the AI assistant (most recent first).
      </p>

      {error && <p className="mt-4 text-body-sm text-critical">{error}</p>}

      {entries && (
        <div className="mt-6 flex flex-col gap-4">
          <p className="text-body-xs text-muted-foreground">
            {conversationCount} conversation{conversationCount === 1 ? "" : "s"} ·{" "}
            {soloCount} one-off question{soloCount === 1 ? "" : "s"} ·{" "}
            {entries.length} message{entries.length === 1 ? "" : "s"} total
            {returningCount > 0 && (
              <>
                {" "}·{" "}
                <span className="text-info">
                  {returningCount} returning visitor{returningCount === 1 ? "" : "s"}
                </span>
              </>
            )}
            {reviewCount > 0 && (
              <>
                {" "}·{" "}
                <span className="text-caution">
                  {reviewCount} may need review
                </span>
              </>
            )}
          </p>

          <div className="flex items-center gap-2">
            <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 dark:bg-input/30">
              <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search questions, answers, location…"
                className="w-full bg-transparent text-body-sm outline-none placeholder:text-muted-foreground"
              />
            </div>
            <button
              type="button"
              onClick={() => setReviewOnly((v) => !v)}
              disabled={reviewCount === 0}
              className={cn(
                "flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-body-sm transition-colors disabled:opacity-40",
                reviewOnly
                  ? "border-caution/50 bg-surface-caution text-caution"
                  : "border-input bg-background text-muted-foreground hover:text-foreground"
              )}
            >
              <ExclamationTriangleIcon className="size-3.5 shrink-0" />
              Needs review{reviewCount > 0 ? ` (${reviewCount})` : ""}
            </button>
          </div>

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

          {threads.length === 0 && (
            <p className="text-body-sm text-muted-foreground">
              {reviewOnly
                ? "No flagged conversations."
                : query
                  ? "No conversations match your search."
                  : "No messages yet."}
            </p>
          )}

          {DATE_GROUPS.map((g) => {
            const threadsInGroup = grouped.get(g) ?? [];
            if (threadsInGroup.length === 0) return null;
            // Conversations (2+ messages) carry the most signal — lead with
            // them as full cards. One-off single questions follow as a dense
            // list, since there's nothing more to discover in them beyond the
            // one answer.
            const conversations = threadsInGroup.filter((t) => t.entries.length > 1);
            const soloes = threadsInGroup.filter((t) => t.entries.length === 1);
            return (
              <div key={g} className="flex flex-col gap-3">
                <h2 className="text-body-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {g}
                </h2>
                {conversations.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {conversations.map((thread) => (
                      <ThreadCard
                        key={thread.key}
                        thread={thread}
                        visitCount={thread.ip ? visitCountByIp.get(thread.ip) ?? 1 : 1}
                      />
                    ))}
                  </div>
                )}
                {soloes.length > 0 && (
                  <div className="rounded-lg border px-3">
                    {soloes.map((thread) => (
                      <SoloRow
                        key={thread.key}
                        thread={thread}
                        visitCount={thread.ip ? visitCountByIp.get(thread.ip) ?? 1 : 1}
                      />
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
