"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { HandThumbUpIcon, HandThumbDownIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";
import { AdminTabs } from "@/components/admin-tabs";

type Entry = {
  t: string;
  c?: string;
  q?: string;
  a: string;
  rating: "up" | "down";
  feedback?: string;
  country?: string;
  city?: string;
  ip?: string;
};

export default function FeedbackPage() {
  const router = useRouter();
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/feedback-log");
        if (res.status === 401) {
          router.replace("/admin/login?next=/admin/feedback");
          return;
        }
        if (res.status === 501) {
          setError("ADMIN_KEY isn't set on the server.");
          return;
        }
        if (!res.ok) {
          setError("Couldn't load feedback.");
          return;
        }
        const data = await res.json();
        setEntries(data.log ?? []);
      } catch {
        setError("Network error.");
      }
    })();
  }, [router]);

  const ups = entries?.filter((e) => e.rating === "up").length ?? 0;
  const downs = entries?.filter((e) => e.rating === "down").length ?? 0;

  return (
    <div className="mx-auto w-full max-w-3xl">
      <AdminTabs />
      <h1 className="text-h3 font-semibold tracking-tight">Feedback</h1>
      <p className="mt-1 text-body-sm text-muted-foreground">
        Thumbs up/down visitors gave AI answers (most recent first).
      </p>

      {error && <p className="mt-4 text-body-sm text-critical">{error}</p>}

      {entries && (
        <div className="mt-6 flex flex-col gap-4">
          <div className="flex items-center gap-4 text-body-sm">
            <span className="flex items-center gap-1.5 text-success">
              <HandThumbUpIcon className="size-4" /> {ups}
            </span>
            <span className="flex items-center gap-1.5 text-critical">
              <HandThumbDownIcon className="size-4" /> {downs}
            </span>
            <span className="text-muted-foreground">
              · {entries.length} rating{entries.length === 1 ? "" : "s"}
            </span>
          </div>

          {entries.length === 0 && (
            <p className="text-body-sm text-muted-foreground">No feedback yet.</p>
          )}

          {entries.map((e, i) => (
            <div key={i} className="rounded-lg border">
              <div className="flex flex-wrap items-center gap-2 border-b px-3 py-2 text-body-xs text-muted-foreground">
                <span
                  className={cn(
                    "flex items-center gap-1 font-medium",
                    e.rating === "up" ? "text-success" : "text-critical"
                  )}
                >
                  {e.rating === "up" ? (
                    <HandThumbUpIcon className="size-3.5" />
                  ) : (
                    <HandThumbDownIcon className="size-3.5" />
                  )}
                  {e.rating === "up" ? "Helpful" : "Not helpful"}
                </span>
                <span>· {new Date(e.t).toLocaleString()}</span>
                {(e.city || e.country) && (
                  <span>· {[e.city, e.country].filter(Boolean).join(", ")}</span>
                )}
                {e.ip && <span>· {e.ip}</span>}
              </div>
              <div className="flex flex-col gap-1 p-3">
                {e.q && <p className="text-body-sm font-medium">{e.q}</p>}
                <p className="text-body-sm text-muted-foreground">{e.a}</p>
                {e.feedback && (
                  <p className="mt-1 text-body-sm italic text-muted-foreground border-l-2 border-border pl-2">"{e.feedback}"</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
