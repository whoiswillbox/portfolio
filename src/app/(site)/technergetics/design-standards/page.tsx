"use client";

import * as React from "react";
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { cn } from "@/lib/utils";

type Platform = "web" | "mobile";

const TABS = [
  { id: "web", label: "Web", Icon: ComputerDesktopIcon },
  { id: "mobile", label: "Mobile", Icon: DevicePhoneMobileIcon },
] as const;

const COPY: Record<Platform, { subtitle: string; body: string }> = {
  web: {
    subtitle: "The conventions and components behind Technergetics' web experiences.",
    body: "Layout grids and breakpoints, the typography scale, color and spacing tokens, and the shared component patterns that keep Technergetics' web products consistent.",
  },
  mobile: {
    subtitle: "The conventions and components behind Technergetics' mobile experiences.",
    body: "Touch targets, navigation patterns, iOS/Android platform conventions, and the shared component patterns that keep Technergetics' mobile apps consistent.",
  },
};

export default function DesignStandards() {
  const [platform, setPlatform] = React.useState<Platform>("web");
  const copy = COPY[platform];

  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
        <header className="flex flex-col gap-4">
          <h1 className="text-h1 font-bold tracking-tight">Design Standards</h1>
          <p className="max-w-xl text-body-lg text-muted-foreground">{copy.subtitle}</p>

          {/* Web / Mobile toggle */}
          <div
            role="tablist"
            aria-label="Platform"
            className="inline-flex w-fit items-center gap-0.5 rounded-lg border p-0.5"
          >
            {TABS.map(({ id, label, Icon }) => (
              <button
                key={id}
                type="button"
                role="tab"
                aria-selected={platform === id}
                onClick={() => setPlatform(id)}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 font-mono text-body-xs uppercase tracking-wide transition-colors",
                  platform === id
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="size-4" />
                {label}
              </button>
            ))}
          </div>
        </header>

        <div className="mt-12">
          <p className="max-w-2xl text-body-md leading-relaxed text-foreground">{copy.body}</p>
        </div>
      </article>
    </ContentCard>
  );
}
