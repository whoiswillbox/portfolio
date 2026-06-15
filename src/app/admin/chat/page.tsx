"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

type Entry = {
  t: string;
  q: string;
  a: string;
  country?: string;
  city?: string;
  ip?: string;
};

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
    <div className="mx-auto min-h-dvh w-full max-w-3xl p-6">
      <h1 className="text-h3 font-semibold tracking-tight">Chat log</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        What visitors have asked the AI assistant (most recent first).
      </p>

      {error && <p className="mt-4 text-body-sm text-critical">{error}</p>}

      {entries && (
        <div className="mt-6 flex flex-col gap-3">
          <p className="text-body-xs text-muted-foreground">
            {entries.length} message{entries.length === 1 ? "" : "s"}
          </p>
          {entries.length === 0 && (
            <p className="text-body-sm text-muted-foreground">No messages yet.</p>
          )}
          {entries.map((e, i) => (
            <div key={i} className="rounded-lg border p-3">
              <div className="flex flex-wrap items-center gap-2 text-body-xs text-muted-foreground">
                <span>{new Date(e.t).toLocaleString()}</span>
                {(e.city || e.country) && (
                  <span>· {[e.city, e.country].filter(Boolean).join(", ")}</span>
                )}
                {e.ip && <span>· {e.ip}</span>}
              </div>
              <p className="mt-2 text-body-sm font-medium">Q: {e.q}</p>
              <p className="mt-1 text-body-sm text-muted-foreground">A: {e.a}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
