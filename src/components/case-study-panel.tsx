import { XMarkIcon } from "@heroicons/react/24/outline";
import type { CaseStudy } from "@/lib/case-studies";

/**
 * Full case-study view for the right-hand content card. Renders alongside the
 * chat so a visitor can read the case study while continuing to ask about it.
 */
export function CaseStudyPanel({
  study,
  onClose,
}: {
  study: CaseStudy;
  onClose: () => void;
}) {
  return (
    <div className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="flex items-center justify-between gap-2 p-2">
        <span className="pl-1 font-mono text-body-xs uppercase tracking-[0.2em] text-muted-foreground">
          Case study
        </span>
        <button
          type="button"
          onClick={onClose}
          aria-label="Close case study"
          className="rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95"
        >
          <XMarkIcon className="size-4" />
        </button>
      </div>

      {/* Scrollable body */}
      <div className="min-h-0 flex-1 overflow-y-auto">
        {/* Cover band — gradient stand-in for project artwork. */}
        <div className="h-28 bg-gradient-to-br from-primary/80 to-primary" />

        <div className="flex flex-col gap-4 p-5">
          <div className="flex flex-col gap-0.5">
            <h2 className="text-h3 font-bold uppercase tracking-tight text-foreground">
              {study.title}
            </h2>
            <p className="font-mono text-body-xs uppercase tracking-wide text-muted-foreground">
              {study.meta}
            </p>
          </div>

          <p className="text-body-sm text-foreground">{study.summary}</p>

          {/* Metrics */}
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

          {/* Sections */}
          <div className="flex flex-col gap-3">
            {study.sections.map((s) => (
              <div key={s.heading} className="flex flex-col gap-1">
                <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-muted-foreground">
                  {s.heading}
                </p>
                <p className="text-body-sm text-foreground">{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
