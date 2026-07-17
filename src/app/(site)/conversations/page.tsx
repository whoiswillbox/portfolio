"use client";

import * as React from "react";
import Link from "next/link";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
} from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import {
  loadConversations,
  saveConversations,
  subscribeConversations,
  type Conversation,
} from "@/lib/chat/store";
import { caseStudyForConversation, stripCaseStudyMarker } from "@/lib/case-studies";
import { stripContactMarker } from "@/lib/contact";
import { cn } from "@/lib/utils";

type Filter = "all" | "projects" | "general";
const FILTER_ITEMS: Filter[] = ["all", "projects", "general"];
const FILTER_LABELS: Record<Filter, string> = {
  all: "All",
  projects: "Projects",
  general: "General",
};

/** Where a conversation reopens — its project page (case studies) or /who. */
function hrefFor(c: Conversation): string {
  const study = caseStudyForConversation(c);
  return study ? `${study.href}?box=${c.id}` : `/?c=${c.id}`;
}

/** Short preview: the latest message, with chat markers stripped out. */
function previewOf(c: Conversation): string {
  const text = c.messages[c.messages.length - 1]?.text ?? "";
  return stripCaseStudyMarker(stripContactMarker(text));
}

/** Bucket a conversation by when it was started, so the list reads by session
    (Today / Yesterday / Previous 7 Days / Older). Legacy conversations have no
    createdAt → "Earlier". */
const DATE_GROUPS = ["Today", "Yesterday", "Previous 7 Days", "Older", "Earlier"] as const;
type DateGroup = (typeof DATE_GROUPS)[number];

function groupOf(c: Conversation, now: number): DateGroup {
  if (c.createdAt == null) return "Earlier";
  const startOfToday = new Date(now).setHours(0, 0, 0, 0);
  const dayMs = 86_400_000;
  if (c.createdAt >= startOfToday) return "Today";
  if (c.createdAt >= startOfToday - dayMs) return "Yesterday";
  if (c.createdAt >= startOfToday - 7 * dayMs) return "Previous 7 Days";
  return "Older";
}

export default function ConversationsPage() {
  const [conversations, setConversations] = React.useState<Conversation[]>([]);
  const [query, setQuery] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [selectMode, setSelectMode] = React.useState(false);
  const [selected, setSelected] = React.useState<Set<string>>(new Set());

  React.useEffect(() => {
    const sync = () => setConversations(loadConversations());
    sync();
    return subscribeConversations(sync);
  }, []);

  const persist = (next: Conversation[]) => {
    setConversations(next);
    saveConversations(next);
  };

  const q = query.trim().toLowerCase();
  const filtered = conversations.filter((c) => {
    if (filter !== "all") {
      const isProject = !!caseStudyForConversation(c);
      if (filter === "projects" ? !isProject : isProject) return false;
    }
    if (!q) return true;
    return (
      c.title.toLowerCase().includes(q) ||
      c.messages.some((m) => m.text.toLowerCase().includes(q))
    );
  });

  // Group the filtered list by date bucket. `now` is set on mount (avoids an
  // SSR/CSR mismatch from Date.now() during render). Order within a group is the
  // stored order (newest-first).
  const [now, setNow] = React.useState<number | null>(null);
  React.useEffect(() => setNow(Date.now()), []);
  const grouped = React.useMemo(() => {
    const map = new Map<DateGroup, Conversation[]>();
    if (now == null) return map;
    for (const c of filtered) {
      const g = groupOf(c, now);
      const arr = map.get(g);
      if (arr) arr.push(c);
      else map.set(g, [c]);
    }
    return map;
  }, [filtered, now]);

  const toggleSelect = (id: string) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const allFilteredSelected =
    filtered.length > 0 && filtered.every((c) => selected.has(c.id));
  const toggleSelectAll = () =>
    setSelected(allFilteredSelected ? new Set() : new Set(filtered.map((c) => c.id)));

  const exitSelect = () => {
    setSelectMode(false);
    setSelected(new Set());
  };
  const deleteSelected = () => {
    persist(conversations.filter((c) => !selected.has(c.id)));
    exitSelect();
  };

  return (
    <ContentCard className="flex h-full flex-col">
      <div className="flex min-h-0 flex-1 flex-col overflow-auto">
        <div className="mx-auto flex w-full max-w-4xl flex-1 flex-col px-6 pb-10 pt-16 max-sm:[@media(display-mode:standalone)]:pt-24">
        {conversations.length > 0 && (
          <header className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-3">
              <h1 className="text-h1">Conversations</h1>
              <p className="text-body-md text-muted-foreground">
                Everything you&apos;ve asked Box, in one place.
              </p>
            </div>
            <Button asChild>
              <Link href="/?box-home=1">
                <PlusIcon className="size-4" />
                New chat
              </Link>
            </Button>
          </header>
        )}

        {conversations.length === 0 ? (
          <div className="flex flex-1 items-center justify-center">
            <ConversationsEmptyState />
          </div>
        ) : (
          <>
            {/* Search + filter (filter right-aligned, matching the search field) */}
            <div className="mt-8 flex items-center gap-2">
              <div className="flex h-8 flex-1 items-center gap-2 rounded-lg border border-input bg-background px-3 dark:bg-input/30">
                <MagnifyingGlassIcon className="size-4 shrink-0 text-muted-foreground" />
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Search conversations…"
                  className="w-full bg-transparent text-body-sm outline-none placeholder:text-muted-foreground"
                />
              </div>
              <Select value={filter} onValueChange={(v) => setFilter(v as Filter)}>
                <SelectTrigger className="shrink-0 bg-background px-3 text-body-sm text-muted-foreground">
                  Filter by&nbsp;<SelectValue />
                </SelectTrigger>
                <SelectContent position="popper" align="start">
                  {FILTER_ITEMS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {FILTER_LABELS[item]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Select toggle */}
            <div className="mt-4 flex justify-end">
              <Button
                variant="ghost"
                size="sm"
                onClick={selectMode ? exitSelect : () => setSelectMode(true)}
                className="font-mono text-body-xs uppercase tracking-wide text-muted-foreground"
              >
                {selectMode ? "Cancel" : "Select"}
              </Button>
            </div>

            {/* Selection toolbar */}
            {selectMode && (
              <div className="mt-3 flex items-center justify-between rounded-lg border bg-muted/40 px-3 py-2">
                <button
                  type="button"
                  onClick={toggleSelectAll}
                  className="flex items-center gap-2 text-body-sm text-foreground"
                >
                  <Checkbox on={allFilteredSelected} />
                  Select all
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-body-xs text-muted-foreground">
                    {selected.size} selected
                  </span>
                  <Button
                    variant="destructive"
                    size="sm"
                    disabled={selected.size === 0}
                    onClick={deleteSelected}
                  >
                    <TrashIcon className="size-4" />
                    Delete
                  </Button>
                </div>
              </div>
            )}

            {/* List — grouped by date (Today / Yesterday / …). */}
            <div className="mt-6 flex flex-col gap-6">
              {filtered.length === 0 ? (
                <p className="py-12 text-center text-body-sm text-muted-foreground">
                  No conversations match your filters.
                </p>
              ) : (
                DATE_GROUPS.map((group) => {
                  const rows = grouped.get(group);
                  if (!rows?.length) return null;
                  return (
                    <section key={group} className="flex flex-col gap-1">
                      <h2 className="px-3 pb-1 font-mono text-body-xs uppercase tracking-wide text-muted-foreground">
                        {group}
                      </h2>
                      {rows.map((c) => {
                        const rowBody = (
                          <div className="flex min-w-0 flex-1 flex-col gap-0.5 px-3 py-2.5">
                            <span className="truncate font-mono text-body-xs uppercase tracking-wide text-foreground">
                              {c.title}
                            </span>
                            <span className="truncate text-body-sm text-muted-foreground">
                              {previewOf(c)}
                            </span>
                          </div>
                        );
                        return (
                          <div
                            key={c.id}
                            className="group flex items-center rounded-lg transition-colors hover:bg-muted/60"
                          >
                            {selectMode ? (
                              <button
                                type="button"
                                onClick={() => toggleSelect(c.id)}
                                className="flex min-w-0 flex-1 items-center gap-3 pl-3 text-left"
                              >
                                <Checkbox on={selected.has(c.id)} />
                                {rowBody}
                              </button>
                            ) : (
                              <>
                                <Link href={hrefFor(c)} className="flex min-w-0 flex-1">
                                  {rowBody}
                                </Link>
                                <button
                                  type="button"
                                  onClick={() => persist(conversations.filter((x) => x.id !== c.id))}
                                  aria-label="Delete conversation"
                                  className="mr-2 shrink-0 rounded p-1.5 text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                                >
                                  <XMarkIcon className="size-4" />
                                </button>
                              </>
                            )}
                          </div>
                        );
                      })}
                    </section>
                  );
                })
              )}
            </div>
          </>
        )}
        </div>
      </div>
    </ContentCard>
  );
}

/* Reuses the box glyph from CaseStudyEmptyState (same illustration language)
   with copy + a "Start a chat" CTA suited to a brand-new visitor. */
function ConversationsEmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 px-8 py-14 text-center">
      <svg
        viewBox="0 -8 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-24 text-foreground"
        aria-hidden="true"
      >
        <path d="M3 9 L3 17.5 L12 22.5 L12 14 Z"
          fill="currentColor" fillOpacity="0.1"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M21 9 L21 17.5 L12 22.5 L12 14 Z"
          fill="currentColor" fillOpacity="0.05"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M3 9 L12 14 L9 8 L1 4 Z"
          fill="currentColor" fillOpacity="0.08"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M21 9 L12 14 L15 8 L23 4 Z"
          fill="currentColor" fillOpacity="0.05"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M3 9 L12 4 L10 0.5 L2 4.5 Z"
          fill="currentColor" fillOpacity="0.07"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M21 9 L12 4 L14 0.5 L22 4.5 Z"
          fill="currentColor" fillOpacity="0.04"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        <path d="M3 9 L12 4 L21 9 L12 14 Z"
          fill="none"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
      </svg>

      <div className="flex flex-col gap-3">
        <p className="font-heading text-h3 text-foreground">No conversations yet</p>
        <p className="max-w-xs text-body-sm text-muted-foreground">
          Ask Box about my work, skills, or projects — everything you chat about shows up here.
        </p>
      </div>

      <Button asChild className="mt-2">
        <Link href="/?box-home=1">
          <PlusIcon className="size-4" />
          Start a chat
        </Link>
      </Button>
    </div>
  );
}

function Checkbox({ on }: { on: boolean }) {
  return (
    <span
      className={cn(
        "flex size-4 shrink-0 items-center justify-center rounded border transition-colors",
        on ? "border-foreground bg-foreground text-background" : "border-input"
      )}
    >
      {on && <CheckIcon className="size-3" strokeWidth={3} />}
    </span>
  );
}
