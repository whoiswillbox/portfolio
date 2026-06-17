import Image from "next/image";

/**
 * The canonical case-study article layout: hero (title + summary + optional
 * header slot) → hero image → sticky metadata sidebar + body (optional metrics,
 * sections, and any extra children like galleries/alerts).
 *
 * Presentational and slot-based, so it's shared by every case study — the
 * hand-authored pages (jetdash, upgrade), the registry-driven CaseStudyArticle
 * (next-gen-bar + the in-chat panel), and Design Standards (which adds a
 * Web/Mobile toggle via `headerExtra` and swaps `sections`).
 *
 * Does NOT include the ContentCard wrapper — the caller provides it (or the
 * scrolling container, as the chat panel does).
 */

export type CaseStudyMeta = { label: string; value: string };
export type CaseStudySectionData = { heading: string; paragraphs: string[] };
export type CaseStudyMetric = { value: string; label: string };

export function CaseStudyLayout({
  title,
  summary,
  hero,
  headerExtra,
  meta = [],
  contributions,
  sidebarExtra,
  metrics,
  sections = [],
  children,
}: {
  title: string;
  summary: string;
  /** Real hero image; when omitted a gradient placeholder is shown. */
  hero?: { src: string; alt: string };
  /** Rendered in the header under the summary (e.g. a link or a toggle). */
  headerExtra?: React.ReactNode;
  meta?: CaseStudyMeta[];
  contributions?: string[];
  /** Rendered at the bottom of the metadata sidebar (e.g. an external link). */
  sidebarExtra?: React.ReactNode;
  metrics?: CaseStudyMetric[];
  sections?: CaseStudySectionData[];
  /** Appended after the sections (e.g. an image gallery or an Alert). */
  children?: React.ReactNode;
}) {
  return (
    <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
      {/* Hero */}
      <header className="flex flex-col gap-3">
        <h1 className="text-h1 font-bold tracking-tight">{title}</h1>
        <p className="max-w-xl text-body-lg text-muted-foreground">{summary}</p>
        {headerExtra}
      </header>

      {/* Hero image (or gradient placeholder) */}
      {hero ? (
        <div className="relative mt-8 aspect-[16/7] w-full overflow-hidden rounded-xl ring-1 ring-border">
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 56rem, 100vw"
            className="object-cover"
          />
        </div>
      ) : (
        <div className="mt-8 aspect-[16/7] w-full rounded-xl bg-gradient-to-br from-muted to-muted-foreground/30" />
      )}

      {/* Body: metadata sidebar + sections. The sidebar pins right as the hero
          leaves the viewport (md:top-20). */}
      <div className="mt-20 grid gap-10 md:grid-cols-[180px_1fr]">
        <aside className="flex flex-col gap-6 md:sticky md:top-20 md:self-start">
          {meta.map((m) => (
            <Field key={m.label} label={m.label} value={m.value} />
          ))}
          {contributions && contributions.length > 0 && (
            <div className="flex flex-col gap-1">
              <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
                Contributions
              </p>
              <ul className="flex flex-col gap-0.5">
                {contributions.map((c) => (
                  <li key={c} className="text-body-sm text-muted-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {sidebarExtra}
        </aside>

        <div className="flex flex-col gap-16">
          {metrics && metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {metrics.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-0.5 rounded-lg border bg-background px-2 py-3 text-center"
                >
                  <span className="text-body-lg font-bold text-foreground">{m.value}</span>
                  <span className="text-[0.65rem] leading-tight text-muted-foreground">
                    {m.label}
                  </span>
                </div>
              ))}
            </div>
          )}

          {sections.map((s) => (
            <section key={s.heading} className="flex flex-col gap-3">
              <h2 className="text-h3 font-semibold tracking-tight">{s.heading}</h2>
              {s.paragraphs.map((p, i) => (
                <p key={i} className="text-body-md leading-relaxed text-foreground">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {children}
        </div>
      </div>
    </article>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1">
      <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
        {label}
      </p>
      <p className="text-body-sm text-muted-foreground">{value}</p>
    </div>
  );
}
