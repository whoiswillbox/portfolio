"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  LightBulbIcon,
  HomeIcon,
  BellIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  XCircleIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline";
import { BellIcon as BellSolid } from "@heroicons/react/24/solid";
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

// Icon color tokens (mirrors the Colors page). Shown as icon-* ; copied as the
// working text-icon-* utility (icons take color from the text- utility).
const COLORS = [
  { token: "icon", copyAs: "text-icon", cls: "text-icon", use: "Default icon color." },
  { token: "icon-secondary", copyAs: "text-icon-secondary", cls: "text-icon-secondary", use: "Lower-prominence icons." },
  { token: "icon-subtle", copyAs: "text-icon-subtle", cls: "text-icon-subtle", use: "Subtle / decorative glyphs." },
  { token: "icon-brand", copyAs: "text-icon-brand", cls: "text-icon-brand", use: "Attention-pulling icons.", Icon: BellIcon },
  { token: "icon-info", copyAs: "text-icon-info", cls: "text-icon-info", use: "Informational status.", Icon: InformationCircleIcon },
  { token: "icon-success", copyAs: "text-icon-success", cls: "text-icon-success", use: "Success status.", Icon: CheckCircleIcon },
  { token: "icon-caution", copyAs: "text-icon-caution", cls: "text-icon-caution", use: "Caution status.", Icon: ExclamationTriangleIcon },
  { token: "icon-critical", copyAs: "text-icon-critical", cls: "text-icon-critical", use: "Critical / error status.", Icon: XCircleIcon },
];

type View = "primitives" | "semantics";

export default function Iconography() {
  const [view, setView] = React.useState<View>("semantics");

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

        <div className="flex flex-col gap-4 mb-12">
          <div className="flex flex-col gap-3">
            <h1 className="text-h1 font-semibold">Iconography</h1>
            <p className="text-body-lg text-muted-foreground">
              Icons carry meaning at a glance. One consistent set, sized and
              colored on the same scales as everything else.
            </p>
          </div>
          {/* Primitives / Semantics toggle */}
          <div className="inline-flex w-fit items-center gap-1 rounded-lg bg-muted p-1 ring-1 ring-border">
            {(["primitives", "semantics"] as const).map((v) => (
              <button
                key={v}
                type="button"
                onClick={() => setView(v)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-body-sm font-medium capitalize transition-colors",
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

        {view === "semantics" ? (
        <>
        {/* Library */}
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
          </div>
          <div className="flex flex-col divide-y divide-border">
            {SIZES.map((s) => (
              <div key={s.token} className="flex items-center gap-6 py-4">
                <div className="grid w-16 shrink-0 place-items-center">
                  <HomeIcon className={cn(s.token, "text-icon")} />
                </div>
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <CopyToken value={s.token} className="-ml-1.5 self-start" />
                  <p className="text-body-sm text-muted-foreground">{s.use}</p>
                </div>
                <span className="ml-auto shrink-0 font-mono text-[0.65rem] text-muted-foreground">{s.px}px</span>
              </div>
            ))}
          </div>
        </section>

        {/* Colors */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Colors</h2>
            <p className="text-body-sm text-muted-foreground">
              Icon color tokens —{" "}
              <span className="font-mono text-body-xs">text-icon</span> by prominence,
              plus intent variants. (Also on the Colors page.)
            </p>
            <UsageHint>
              Match icon color to context — <span className="font-mono text-body-xs">text-icon</span>{" "}
              alongside body text, <span className="font-mono text-body-xs">text-icon-subtle</span>{" "}
              for decoration, and the intent colors when an icon reinforces a status.
            </UsageHint>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {COLORS.map(({ token, copyAs, cls, use, Icon }) => {
              const Glyph = Icon ?? BellIcon;
              return (
                <div key={token} className="flex items-center gap-6 py-4">
                  <div className="grid w-16 shrink-0 place-items-center">
                    <Glyph className={cn("size-6", cls)} />
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                    <CopyToken value={token} copyValue={copyAs} className="-ml-1.5 self-start" />
                    <p className="text-body-sm text-muted-foreground">{use}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
        </>
        ) : (
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Source</h2>
            <p className="text-body-sm text-muted-foreground">
              Icons aren&apos;t design tokens — they&apos;re a vendored library.
              There&apos;s no primitive layer to tune; the &quot;primitives&quot;
              here are simply the raw import.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            <div className="flex items-center gap-6 py-4">
              <div className="grid w-16 shrink-0 place-items-center">
                <Cog6ToothIcon className="size-6 text-icon" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <CopyToken value="@heroicons/react/24/outline" className="-ml-1.5 self-start" />
                <p className="text-body-sm text-muted-foreground">The default icon import — outline style, 24px grid.</p>
              </div>
            </div>
            <div className="flex items-center gap-6 py-4">
              <div className="grid w-16 shrink-0 place-items-center">
                <BellSolid className="size-6 text-icon" />
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                <CopyToken value="@heroicons/react/24/solid" className="-ml-1.5 self-start" />
                <p className="text-body-sm text-muted-foreground">Filled style — for active / selected states.</p>
              </div>
            </div>
          </div>
        </section>
        )}
      </div>
    </ContentCard>
  );
}
