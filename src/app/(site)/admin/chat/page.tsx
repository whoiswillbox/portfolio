"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { AdminTabs } from "@/components/admin-tabs";

type Entry = {
  t: string;
  q: string;
  a: string;
  country?: string;
  city?: string;
  ip?: string;
  c?: string;
};

type Thread = {
  key: string;
  entries: Entry[]; // oldest → newest
  latest: number; // ms of most recent entry
  country?: string;
  city?: string;
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
      ip: first.ip,
    });
  }
  return threads.sort((a, b) => b.latest - a.latest);
}

export default function ChatLogPage() {
  const router = useRouter();
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/chat-log");
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

  return (
    <div className="mx-auto w-full max-w-3xl">
      <AdminTabs />
      <h1 className="text-h3 tracking-tight">Chat log</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        What visitors have asked the AI assistant (most recent first).
      </p>

      {error && <p className="mt-4 text-body-sm text-critical">{error}</p>}

      {entries && (
        <div className="mt-6 flex flex-col gap-4">
          {(() => {
            const threads = groupThreads(entries);
            return (
              <>
                <p className="text-body-xs text-muted-foreground">
                  {threads.length} conversation{threads.length === 1 ? "" : "s"} ·{" "}
                  {entries.length} message{entries.length === 1 ? "" : "s"}
                </p>
                {threads.length === 0 && (
                  <p className="text-body-sm text-muted-foreground">No messages yet.</p>
                )}
                {threads.map((thread) => (
                  <div key={thread.key} className="rounded-lg border">
                    <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 text-body-xs text-muted-foreground">
                      <span>{new Date(thread.latest).toLocaleString()}</span>
                      {(thread.city || thread.country) && (
                        <span>· {[thread.city, thread.country].filter(Boolean).join(", ")}</span>
                      )}
                      {thread.ip && <span>· {thread.ip}</span>}
                      {thread.entries.length > 1 && (
                        <span>· {thread.entries.length} messages</span>
                      )}
                    </div>
                    <div className="flex flex-col gap-3 p-3">
                      {thread.entries.map((e, i) => (
                        <div key={i} className="flex flex-col gap-1">
                          <p className="text-body-sm font-medium">{e.q}</p>
                          <p className="text-body-sm text-muted-foreground">{e.a}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
