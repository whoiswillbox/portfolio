import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CopyToken } from "@/components/copy-token";

/* Living reference — every sample is rendered with the ACTUAL type utility, so
   this page always reflects the real scale (size, weight, tracking, leading). */

type TypeToken = { token: string; px: string; sample?: string };

// Display — oversized, for hero moments. (font-heading = EB Garamond)
const DISPLAY: TypeToken[] = [
  { token: "text-display-lg", px: "72 / 4.5rem" },
  { token: "text-display", px: "56 / 3.5rem" },
  { token: "text-display-sm", px: "40 / 2.5rem" },
];

// Headings — section titles. (font-heading = EB Garamond)
const HEADINGS: TypeToken[] = [
  { token: "text-h1", px: "36 / 2.25rem" },
  { token: "text-h2", px: "30 / 1.875rem" },
  { token: "text-h3", px: "24 / 1.5rem" },
  { token: "text-h4", px: "20 / 1.25rem" },
  { token: "text-h5", px: "18 / 1.125rem" },
  { token: "text-h6", px: "16 / 1rem" },
];

// Body — running text. (font-sans = Plus Jakarta Sans)
const BODY: TypeToken[] = [
  { token: "text-body-lg", px: "18 / 1.125rem", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-md", px: "16 / 1rem", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-sm", px: "14 / 0.875rem", sample: "The quick brown fox jumps over the lazy dog." },
  { token: "text-body-xs", px: "12 / 0.75rem", sample: "The quick brown fox jumps over the lazy dog." },
];

const FONTS = [
  { token: "font-sans", name: "Plus Jakarta Sans", role: "UI and body copy.", cls: "font-sans" },
  { token: "font-heading", name: "EB Garamond", role: "Headings and display.", cls: "font-heading" },
  { token: "font-mono", name: "Geist Mono", role: "Labels, code, and token names.", cls: "font-mono" },
];

const WEIGHTS = [
  { token: "font-normal", name: "Regular", value: "400", cls: "font-normal" },
  { token: "font-medium", name: "Medium", value: "500", cls: "font-medium" },
  { token: "font-semibold", name: "Semibold", value: "600", cls: "font-semibold" },
  { token: "font-bold", name: "Bold", value: "700", cls: "font-bold" },
];

function TypeRow({ token, px, sample, heading }: TypeToken & { heading?: boolean }) {
  return (
    <div className="flex flex-col gap-2 py-4">
      <div className="flex items-baseline justify-between gap-4">
        <CopyToken value={token} className="-ml-1.5" />
        <span className="shrink-0 font-mono text-[0.65rem] text-muted-foreground">{px}px</span>
      </div>
      <p className={`${token} ${heading ? "font-heading font-semibold" : "font-sans"} truncate text-foreground`}>
        {sample ?? "The quick brown fox"}
      </p>
    </div>
  );
}

export default function Typography() {
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
          <h1 className="text-h1 font-semibold">Typography</h1>
          <p className="text-body-lg text-muted-foreground">
            Type sets hierarchy and rhythm — a small, deliberate scale keeps the
            interface legible and consistent.
          </p>
        </div>

        {/* Fonts */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Fonts</h2>
            <p className="text-body-sm text-muted-foreground">
              Three families — <span className="font-mono text-body-xs">font-sans</span>,{" "}
              <span className="font-mono text-body-xs">font-heading</span>, and{" "}
              <span className="font-mono text-body-xs">font-mono</span>.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {FONTS.map((f) => (
              <div key={f.token} className="flex flex-col gap-2 py-4 sm:flex-row sm:items-center sm:gap-6">
                <div className="w-44 shrink-0">
                  <CopyToken value={f.token} className="-ml-1.5" />
                  <div className="px-1.5 text-body-sm text-muted-foreground">{f.role}</div>
                </div>
                <p className={`${f.cls} text-h4 text-foreground`}>{f.name} — Ag 123</p>
              </div>
            ))}
          </div>
        </section>

        {/* Display */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Display</h2>
            <p className="text-body-sm text-muted-foreground">
              Oversized type for hero moments. Set in{" "}
              <span className="font-mono text-body-xs">font-heading</span>.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {DISPLAY.map((t) => (
              <TypeRow key={t.token} {...t} heading />
            ))}
          </div>
        </section>

        {/* Headings */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Headings</h2>
            <p className="text-body-sm text-muted-foreground">
              Section titles, <span className="font-mono text-body-xs">text-h1</span> →{" "}
              <span className="font-mono text-body-xs">text-h6</span>. Set in{" "}
              <span className="font-mono text-body-xs">font-heading</span>.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {HEADINGS.map((t) => (
              <TypeRow key={t.token} {...t} heading />
            ))}
          </div>
        </section>

        {/* Body */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Body</h2>
            <p className="text-body-sm text-muted-foreground">
              Running text, <span className="font-mono text-body-xs">text-body-lg</span> →{" "}
              <span className="font-mono text-body-xs">text-body-xs</span>. Set in{" "}
              <span className="font-mono text-body-xs">font-sans</span>.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {BODY.map((t) => (
              <TypeRow key={t.token} {...t} />
            ))}
          </div>
        </section>

        {/* Weights */}
        <section className="mb-14 flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <h2 className="text-h3 font-semibold">Weights</h2>
            <p className="text-body-sm text-muted-foreground">
              <span className="font-mono text-body-xs">font-normal</span> →{" "}
              <span className="font-mono text-body-xs">font-bold</span>.
            </p>
          </div>
          <div className="flex flex-col divide-y divide-border">
            {WEIGHTS.map((w) => (
              <div key={w.token} className="flex items-center gap-4 py-3">
                <div className="w-40 shrink-0">
                  <CopyToken value={w.token} className="-ml-1.5" />
                  <div className="px-1.5 font-mono text-[0.65rem] text-muted-foreground">{w.value}</div>
                </div>
                <p className={`${w.cls} text-h4 text-foreground`}>{w.name}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </ContentCard>
  );
}
