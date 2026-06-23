"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  XMarkIcon,
  MagnifyingGlassIcon,
  PlusIcon,
  TrashIcon,
  CheckIcon,
  ArrowLeftIcon,
} from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { Button } from "@/components/ui/button";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
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
  return study ? `${study.href}?box=${c.id}` : `/who?c=${c.id}`;
}

/** Short preview: the latest message, with chat markers stripped out. */
function previewOf(c: Conversation): string {
  const text = c.messages[c.messages.length - 1]?.text ?? "";
  return stripCaseStudyMarker(stripContactMarker(text));
}

export default function ConversationsPage() {
  const router = useRouter();
  const { state, isMobile } = useSidebar();
  const showTrigger = state === "collapsed" || isMobile;
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
      {/* Top bar — sidebar trigger (when collapsed) + Back, top-left like the
          chat and case-study pages. */}
      <div className="flex items-center gap-1 p-2 max-sm:hidden">
        {showTrigger && <SidebarTrigger />}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.back()}
          className="font-mono text-body-xs uppercase tracking-wide text-muted-foreground"
        >
          <ArrowLeftIcon className="size-4" />
          Back
        </Button>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-16">
          <header className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1 font-semibold">Conversations</h1>
            <p className="text-body-md text-muted-foreground">
              Everything you&apos;ve asked Box, in one place.
            </p>
          </div>
          <Button asChild>
            <Link href="/who">
              <PlusIcon className="size-4" />
              New chat
            </Link>
          </Button>
        </header>

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
        {conversations.length > 0 && (
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
        )}

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

        {/* List */}
        <div className="mt-6 flex flex-col gap-1">
          {filtered.length === 0 ? (
            <p className="py-12 text-center text-body-sm text-muted-foreground">
              {conversations.length === 0
                ? "No conversations yet."
                : "No conversations match your filters."}
            </p>
          ) : (
            filtered.map((c) => {
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
            })
          )}
        </div>
        </div>
      </div>
    </ContentCard>
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
