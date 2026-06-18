"use client";

import * as React from "react";
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { WEB_SUMMARY, WEB_CONTRIBUTIONS, WEB_SECTIONS, WEB_GROUPS } from "./web-content";
import { cn } from "@/lib/utils";

type Platform = "web" | "mobile";

const TABS = [
  { id: "web", label: "Web", Icon: ComputerDesktopIcon },
  { id: "mobile", label: "Mobile", Icon: DevicePhoneMobileIcon },
] as const;

const META = [
  { label: "Company", value: "Technergetics" },
  { label: "Timeline", value: "2022–24" },
  { label: "Role", value: "Lead UX Designer" },
];

export default function DesignStandards() {
  const [platform, setPlatform] = React.useState<Platform>("web");
  const isWeb = platform === "web";

  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="Design Standards"
        summary={
          isWeb
            ? WEB_SUMMARY
            : "The conventions and components behind Technergetics' mobile experiences."
        }
        meta={META}
        contributions={isWeb ? WEB_CONTRIBUTIONS : undefined}
        sections={isWeb ? WEB_SECTIONS : []}
        groups={isWeb ? WEB_GROUPS : []}
        headerExtra={
          <div
            role="tablist"
            aria-label="Platform"
            className="mt-1 inline-flex w-fit items-center gap-0.5 rounded-lg border p-0.5"
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
        }
      >
        {!isWeb && (
          <p className="text-body-md leading-relaxed text-muted-foreground">
            Mobile standards coming soon.
          </p>
        )}
      </CaseStudyLayout>
    </ContentCard>
  );
}
