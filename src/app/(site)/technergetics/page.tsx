"use client";

import * as React from "react";
import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import {
  FolderIcon,
  BuildingOffice2Icon,
  BoltIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const technergeticsItems = [
  { label: "Jetdash", href: "/technergetics/jetdash", description: "Ops dashboard for field technicians." },
  { label: "Upgrade", href: "/technergetics/upgrade", description: "Self-service plan upgrade flow." },
  { label: "Reusable Table", href: "/technergetics/reusable-table", description: "Design system data table component." },
  { label: "Design Standards", href: "/technergetics/design-standards", description: "Company-wide design language." },
  { label: "Lightcert", href: "/technergetics/lightcert", description: "Certification management platform." },
];

export default function Experience() {
  const [techOpen, setTechOpen] = React.useState(false);

  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-10">
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-h1 font-semibold">Experience</h1>
          <p className="text-body-lg text-muted-foreground">Work and projects.</p>
        </div>
        <div className="flex flex-col divide-y divide-border border-y border-border">

          {/* BARBRI */}
          <Link
            href="/projects/next-gen-bar"
            className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
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
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
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

          {/* Resume */}
          <Link
            href="/resume"
            className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted rounded-lg"
          >
            <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
              <DocumentTextIcon className="size-5 text-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium">Resume</div>
              <div className="text-xs text-muted-foreground">Full work history.</div>
            </div>
            <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
          </Link>

        </div>
      </div>
    </ContentCard>
  );
}
