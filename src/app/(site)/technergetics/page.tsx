"use client";

import * as React from "react";
import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { MobileOnly } from "@/components/mobile-only";
import {
  FolderIcon,
  BuildingOffice2Icon,
  BoltIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const technergeticsItems = [
  { label: "Jetdash", href: "/technergetics/jetdash", description: "Ops dashboard for field technicians." },
  { label: "Upgrade", href: "/technergetics/upgrade", description: "Self-service plan upgrade flow." },
  { label: "Reusable Table", href: "/technergetics/reusable-table", description: "Design system data table component." },
  { label: "Design Standards", href: "/technergetics/design-standards", description: "Company-wide design language." },
];

const schoolItems = [
  { label: "SwipeRight.ai", href: "/school/swiperight-ai", icon: AcademicCapIcon, description: "AI-powered dating app concept." },
];

type View = "work" | "school";

export default function Experience() {
  const [techOpen, setTechOpen] = React.useState(false);
  const [view, setView] = React.useState<View>("work");

  return (
    <MobileOnly fallback="/projects/next-gen-bar">
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto flex w-full max-w-4xl flex-col gap-6 px-6 pt-16 max-sm:[@media(display-mode:standalone)]:pt-24 pb-10">
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1">Experience</h1>
            <p className="text-body-lg text-muted-foreground">
              {view === "work" ? "Work and projects." : "Projects from university."}
            </p>
          </div>
          {/* Work / School toggle */}
          <div className="flex w-full items-center gap-1 rounded-lg bg-muted p-1 ring-1 ring-border">
            {(["work", "school"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "flex-1 rounded-md px-3 py-1.5 text-body-sm font-medium capitalize transition-colors",
                  view === v
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {v}
              </button>
            ))}
          </div>
        </div>

        {view === "work" ? (
        <div className="flex flex-col divide-y divide-border">

          {/* BARBRI */}
          <Link
            href="/projects/next-gen-bar"
            className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
              <FolderIcon className="size-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-sm font-medium">
                BARBRI
                <Badge variant="warning">PACKAGING</Badge>
              </div>
              <div className="text-xs text-muted-foreground">Next-gen bar exam prep.</div>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
          </Link>

          {/* Technergetics accordion */}
          <div>
            <button
              type="button"
              onClick={() => setTechOpen((o) => !o)}
              className="flex w-full items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                <BuildingOffice2Icon className="size-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0 text-left">
                <div className="text-sm font-medium">Technergetics</div>
                <div className="text-xs text-muted-foreground">Enterprise software products.</div>
              </div>
              <ChevronRightIcon className={cn("size-4 text-muted-foreground shrink-0 transition-transform duration-200", techOpen && "rotate-90")} />
            </button>
            {techOpen && (
              <div className="mb-2 flex flex-col divide-y divide-border border-t border-border ml-14">
                {technergeticsItems.map(({ label, href, description }) => (
                  <Link
                    key={href}
                    href={href}
                    className="flex items-center gap-3 py-3 pr-2 transition-colors hover:bg-muted active:bg-muted rounded-lg"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium">{label}</div>
                      <div className="text-xs text-muted-foreground">{description}</div>
                    </div>
                    <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Lightcert */}
          <Link
            href="/technergetics/lightcert"
            className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
              <BoltIcon className="size-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Lightcert</div>
              <div className="text-xs text-muted-foreground">Certification management platform.</div>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
          </Link>

          {/* Resume */}
          <Link
            href="/resume"
            className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
              <DocumentTextIcon className="size-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Resume</div>
              <div className="text-xs text-muted-foreground">Full work history.</div>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
          </Link>

        </div>
        ) : (
        <div className="flex flex-col divide-y divide-border">
          {schoolItems.map(({ label, href, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                <Icon className="size-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
              <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
        )}
      </div>
    </ContentCard>
    </MobileOnly>
  );
}
