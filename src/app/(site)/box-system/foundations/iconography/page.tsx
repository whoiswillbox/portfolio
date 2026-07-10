"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  LightBulbIcon,
  MagnifyingGlassIcon,
  HomeIcon,
  BellIcon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellSolid } from "@heroicons/react/24/solid";
import * as Outline from "@heroicons/react/24/outline";
import * as Solid from "@heroicons/react/24/solid";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";
import { cn } from "@/lib/utils";

/* Living reference — every sample is a real Heroicon rendered at the ACTUAL
   size / color token, so the page reflects the real conventions. */

// Small guidance line shown under a section's description — how/when to use.
function UsageHint({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2 rounded-lg bg-muted/60 px-3 py-2 text-body-sm text-muted-foreground">
      <LightBulbIcon className="mt-0.5 size-4 shrink-0 text-muted-foreground" />
      <p>{children}</p>
    </div>
  );
}

// Sizes used for icons (Tailwind size-* → the icon's box). px = rem × 16.
const SIZES = [
  { token: "size-3", px: "12", use: "Inline with small text, dense controls." },
  { token: "size-4", px: "16", use: "The default — buttons, list items, most UI." },
  { token: "size-5", px: "20", use: "Standalone actions and section headers." },
  { token: "size-6", px: "24", use: "Prominent, touch-friendly targets." },
];

type IconStyle = "outline" | "solid";
type IconEntry = { name: string; Icon: React.ComponentType<React.SVGProps<SVGSVGElement>> };

// The full 24px sets, dynamically. Filter each module to component exports.
function toEntries(mod: Record<string, unknown>): IconEntry[] {
  return Object.entries(mod)
    .filter(([name]) => name.endsWith("Icon"))
    .map(([name, Icon]) => ({ name, Icon: Icon as IconEntry["Icon"] }))
    .sort((a, b) => a.name.localeCompare(b.name));
}
const ICON_SETS: Record<IconStyle, IconEntry[]> = {
  outline: toEntries(Outline),
  solid: toEntries(Solid),
};

// One gallery tile — copies the import name, shows the glyph + label.
function IconTile({ name, Icon }: IconEntry) {
  const [copied, setCopied] = React.useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(name).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  };
  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy "${name}"`}
      className="group flex flex-col items-center gap-2 rounded-lg border border-border bg-surface p-3 transition-colors hover:bg-surface-hover"
    >
      <Icon className="size-6 text-icon" />
      <span className="w-full truncate text-center font-mono text-[0.6rem] text-muted-foreground">
        {copied ? "Copied!" : name.replace(/Icon$/, "")}
      </span>
    </button>
  );
}

export default function Iconography() {
  const [query, setQuery] = React.useState("");
  const [iconStyle, setIconStyle] = React.useState<IconStyle>("outline");

  const filtered = React.useMemo(() => {
    const set = ICON_SETS[iconStyle];
    const q = query.trim().toLowerCase();
    if (!q) return set;
    return set.filter((i) => i.name.toLowerCase().includes(q));
  }, [query, iconStyle]);

  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <Link
          href="/box-system/foundations"
          className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" />
          Foundations
        </Link>

        <div className="flex flex-col gap-3 mb-12">
          <h1 className="text-h1 font-semibold">Iconography</h1>
          <p className="text-body-lg text-muted-foreground">
            Icons carry meaning at a glance. One consistent set, sized and
            colored on the same scales as everything else.
          </p>
        </div>

        {/* Icon set */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Icon set</h2>
            <p className="text-body-sm text-muted-foreground">
              We use <span className="font-mono text-body-xs">@heroicons/react</span> —
              the <span className="font-medium">24px outline</span> style by default,
              with <span className="font-medium">solid</span> for filled / active states.
            </p>
            <UsageHint>
              Reach for <span className="font-mono text-body-xs">24/outline</span> for
              nearly everything; use <span className="font-mono text-body-xs">24/solid</span>{" "}
              only to signal an active or selected state. Keep styles consistent within
              a single control group.
            </UsageHint>
          </div>
          <div className="flex items-center gap-8 py-2">
            <div className="flex flex-col items-center gap-2">
              <BellIcon className="size-8 text-icon" />
              <span className="font-mono text-body-xs text-muted-foreground">24/outline</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <BellSolid className="size-8 text-icon" />
              <span className="font-mono text-body-xs text-muted-foreground">24/solid</span>
            </div>
          </div>
        </section>

        {/* Sizes */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Sizes</h2>
            <p className="text-body-sm text-muted-foreground">
              Icon sizing uses the Tailwind <span className="font-mono text-body-xs">size-*</span>{" "}
              scale — <span className="font-mono text-body-xs">size-4</span> is the default.
            </p>
            <UsageHint>
              Match the icon to its neighbor: <span className="font-mono text-body-xs">size-4</span>{" "}
              pairs with body text and buttons, <span className="font-mono text-body-xs">size-3</span>{" "}
              with small / dense UI, and <span className="font-mono text-body-xs">size-5</span>+ for
              standalone or touch targets. Keep icon and label optically balanced.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SIZES.map((s) => (
              <div key={s.token} className="flex items-center gap-6 py-4">
                <div className="grid w-16 shrink-0 place-items-center">
                  <HomeIcon className={cn(s.token, "text-icon")} />
                </div>
                <CopyToken value={s.token} className="-ml-1.5 shrink-0 self-start" />
                <div className="ml-auto flex shrink-0 flex-col items-end gap-0.5 text-right">
                  <p className="text-body-sm text-muted-foreground">{s.use}</p>
                  <span className="font-mono text-[0.65rem] text-muted-foreground">{s.px}px</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Library gallery */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Library</h2>
            <p className="text-body-sm text-muted-foreground">
              All {filtered.length === ICON_SETS[iconStyle].length ? ICON_SETS[iconStyle].length : `${filtered.length} of ${ICON_SETS[iconStyle].length}`} icons in the 24/{iconStyle} set. Click any to
              copy its component name.
            </p>
          </div>
          {/* Style toggle + search */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <div className="inline-flex w-fit shrink-0 items-center gap-1 rounded-lg bg-muted p-1 ring-1 ring-border">
              {(["outline", "solid"] as const).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setIconStyle(s)}
                  className={cn(
                    "rounded-md px-3 py-1.5 text-body-sm font-medium capitalize transition-colors",
                    iconStyle === s
                      ? "bg-background text-foreground shadow-sm"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {s}
                </button>
              ))}
            </div>
            <div className="relative flex-1">
              <MagnifyingGlassIcon className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search icons…"
                className="h-10 w-full rounded-lg border border-border bg-surface pl-9 pr-3 text-body-sm text-foreground placeholder:text-muted-foreground focus:border-border-focus focus:outline-none"
              />
            </div>
          </div>
          {filtered.length === 0 ? (
            <p className="py-8 text-center text-body-sm text-muted-foreground">
              No icons match &ldquo;{query}&rdquo;.
            </p>
          ) : (
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-5 md:grid-cols-6">
              {filtered.map((i) => (
                <IconTile key={i.name} {...i} />
              ))}
            </div>
          )}
        </section>
      </div>
    </ContentCard>
  );
}
