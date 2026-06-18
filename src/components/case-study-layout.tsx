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
export type CaseStudyGroupImage = { src: string; alt: string; width: number; height: number };
export type CaseStudyGroupItem = {
  heading: string;
  paragraphs: string[];
  image?: CaseStudyGroupImage;
  /** Animated GIF — rendered with <img> so it plays (Next/Image doesn't animate). Constrained to w-64 for phone mockups; pass wide:true for landscape assets; pass size to override width class. */
  gif?: { src: string; alt: string; wide?: boolean; size?: string };
};
/** A labelled group of pattern sub-sections (left category label + right
    content), e.g. the Design Standards pattern docs. */
export type CaseStudyGroup = { label: string; items: CaseStudyGroupItem[] };

export function CaseStudyLayout({
  title,
  summary,
  hero,
  heroContent,
  headerExtra,
  meta = [],
  contributions,
  sidebarExtra,
  metrics,
  sections = [],
  noHero = false,
  groups = [],
  children,
}: {
  title: string;
  summary: string;
  /** Real hero image; when omitted a gradient placeholder is shown. */
  hero?: { src: string; alt: string; contain?: boolean; position?: string };
  /** Arbitrary JSX rendered inside the hero container (overrides `hero`). */
  heroContent?: React.ReactNode;
  /** Suppress the gradient placeholder when no hero image is available yet. */
  noHero?: boolean;

  /** Rendered in the header under the summary (e.g. a link or a toggle). */
  headerExtra?: React.ReactNode;
  meta?: CaseStudyMeta[];
  contributions?: string[];
  /** Rendered at the bottom of the metadata sidebar (e.g. an external link). */
  sidebarExtra?: React.ReactNode;
  metrics?: CaseStudyMetric[];
  sections?: CaseStudySectionData[];
  /** Labelled pattern groups rendered below the intro (left label + content). */
  groups?: CaseStudyGroup[];
  /** Appended after the sections (e.g. an image gallery or an Alert). */
  children?: React.ReactNode;
}) {
  return (
    <article className="@container mx-auto flex w-full max-w-4xl flex-col gap-14 px-6 pb-10 pt-28">
      {/* Hero */}
      <header className="relative flex flex-col gap-3">
        <h1 className="text-h1 font-bold tracking-tight">{title}</h1>
        {summary && <p className="max-w-xl font-heading text-body-lg text-muted-foreground">{summary}</p>}
        {headerExtra && <div className="absolute right-0 top-0 flex h-full items-center">{headerExtra}</div>}
      </header>

      {/* Hero image / content (or gradient placeholder) */}
      {heroContent ? (
        <div className="relative flex aspect-[16/9] w-full items-center justify-center overflow-hidden rounded-xl bg-muted ring-1 ring-border">
          {heroContent}
        </div>
      ) : hero ? (
        <div className={`relative aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-border ${hero.contain ? "bg-muted" : ""}`}>
          <Image
            src={hero.src}
            alt={hero.alt}
            fill
            priority
            sizes="(min-width: 1024px) 56rem, 100vw"
            className={hero.contain ? "object-contain p-8" : "object-cover"}
            style={hero.position ? { objectPosition: hero.position } : undefined}
          />
        </div>
      ) : !noHero ? (
        <div className="aspect-[16/7] w-full rounded-xl bg-gradient-to-br from-muted to-muted-foreground/30" />
      ) : null}

      {/* Body: metadata sidebar + sections. The sidebar pins right as the hero
          leaves the viewport (md:top-20). */}
      <div className="grid gap-10 @md:grid-cols-[180px_1fr]">
        <aside className="flex flex-col gap-6 @md:sticky @md:top-20 @md:self-start">
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
                <p key={i} className="whitespace-pre-line font-heading text-body-md leading-relaxed text-foreground">
                  {p}
                </p>
              ))}
            </section>
          ))}

          {children}
        </div>
      </div>

      {/* Labelled pattern groups: left category label + right sub-sections,
          aligned to the same columns as the metadata above. */}
      {groups.length > 0 && (
        <div className="mt-32 flex flex-col gap-32">
          {groups.map((g) => (
            <div key={g.label} className="grid gap-10 @md:grid-cols-[180px_1fr]">
              <h2 className="text-h3 font-semibold tracking-tight text-foreground @md:sticky @md:top-20 @md:self-start">
                {g.label}
              </h2>
              <div className="flex flex-col gap-20">
                {g.items.map((item) => (
                  <div key={item.heading} className="flex flex-col gap-3">
                    <h3 className="text-body-lg font-medium tracking-tight text-foreground">{item.heading}</h3>
                    {item.paragraphs.map((p, i) => (
                      <p key={i} className="text-body-sm leading-relaxed text-muted-foreground">
                        {p}
                      </p>
                    ))}
                    {item.image && (
                      <Image
                        src={item.image.src}
                        alt={item.image.alt}
                        width={item.image.width}
                        height={item.image.height}
                        quality={90}
                        sizes="(min-width: 768px) 42rem, 100vw"
                        className="mt-1 h-auto w-full rounded-lg"
                      />
                    )}
                    {item.gif && (
                      <div className={`mt-1 flex items-center justify-center overflow-hidden rounded-xl bg-muted dark:bg-white ring-1 ring-border ${item.gif.wide ? "" : "p-6"}`}>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={item.gif.src}
                          alt={item.gif.alt}
                          className={`h-auto rounded-lg mix-blend-multiply ${item.gif.wide ? "w-full" : (item.gif.size ?? "w-64")}`}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
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
