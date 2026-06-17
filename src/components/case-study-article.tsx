import type { CaseStudy } from "@/lib/case-studies";

/**
 * The canonical case-study article layout (hero → image → metadata sidebar +
 * sections), driven by `caseStudies` data. Shared by the standalone case-study
 * pages and the in-chat CaseStudyPanel so every case study reads the same.
 * Matches the hand-authored upgrade/jetdash pages.
 */
export function CaseStudyArticle({ study }: { study: CaseStudy }) {
  // meta is "Role · Company · Timeline" — split into the sidebar fields.
  const [role, company, timeline] = study.meta.split("·").map((s) => s.trim());
  const META = [
    { label: "Company", value: company },
    { label: "Timeline", value: timeline },
    { label: "Role", value: role },
  ].filter((m) => m.value);

  return (
    <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
      {/* Hero */}
      <header className="flex flex-col gap-3">
        <h1 className="text-h1 font-bold tracking-tight">{study.title}</h1>
        <p className="max-w-xl text-body-lg text-muted-foreground">{study.summary}</p>
      </header>

      {/* Hero image — gradient placeholder. */}
      <div className="mt-8 aspect-[16/7] w-full rounded-xl bg-gradient-to-br from-muted to-muted-foreground/30" />

      {/* Body: metadata sidebar + sections */}
      <div className="mt-20 grid gap-10 md:grid-cols-[180px_1fr]">
        {/* Metadata */}
        <aside className="flex flex-col gap-6 md:sticky md:top-20 md:self-start">
          {META.map((m) => (
            <div key={m.label} className="flex flex-col gap-1">
              <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
                {m.label}
              </p>
              <p className="text-body-sm text-muted-foreground">{m.value}</p>
            </div>
          ))}
        </aside>

        {/* Sections */}
        <div className="flex flex-col gap-8">
          {study.metrics.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {study.metrics.map((m) => (
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

          {study.sections.map((s) => (
            <section key={s.heading} className="flex flex-col gap-3">
              <h2 className="text-h3 font-semibold tracking-tight">{s.heading}</h2>
              <p className="text-body-md leading-relaxed text-foreground">{s.body}</p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}
