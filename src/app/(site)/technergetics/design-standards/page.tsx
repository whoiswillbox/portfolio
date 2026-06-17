"use client";

import * as React from "react";
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import {
  CaseStudyLayout,
  type CaseStudySectionData,
} from "@/components/case-study-layout";
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

const CONTRIBUTIONS = ["Design Tokens", "Component Library", "Documentation", "Handoff"];

// Per-platform summary + sections. Placeholder copy — ready to fill with the
// real web/mobile standards content and assets.
const CONTENT: Record<Platform, { summary: string; sections: CaseStudySectionData[] }> = {
  web: {
    summary: "The conventions and components behind Technergetics' web experiences.",
    sections: [
      {
        heading: "Foundations",
        paragraphs: [
          "Layout grids and breakpoints, the typography scale, and color and spacing tokens that keep Technergetics' web products consistent.",
        ],
      },
    ],
  },
  mobile: {
    summary: "The conventions and components behind Technergetics' mobile experiences.",
    sections: [
      {
        heading: "Foundations",
        paragraphs: [
          "Touch targets, navigation patterns, and iOS/Android platform conventions that keep Technergetics' mobile apps consistent.",
        ],
      },
    ],
  },
};

export default function DesignStandards() {
  const [platform, setPlatform] = React.useState<Platform>("web");
  const content = CONTENT[platform];

  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="Design Standards"
        summary={content.summary}
        meta={META}
        contributions={CONTRIBUTIONS}
        sections={content.sections}
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
      />
    </ContentCard>
  );
}
