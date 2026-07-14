import type { CaseStudy } from "@/lib/case-studies";
import { CaseStudyArticle } from "@/components/case-study-article";
import { CaseStudyEmptyState } from "@/components/case-study-empty-state";
import { caseStudyPages } from "@/components/case-study-pages";

/**
 * Full case-study view for the right-hand content card. Renders alongside the
 * chat so a visitor can read the case study while continuing to ask about it.
 * No close button here — it's reached from the chat, which owns the Back
 * control that collapses the whole side-by-side view.
 *
 * When a study has a hand-authored standalone page (see caseStudyPages), that
 * exact page is rendered here so the chat matches the /... route 1:1 (hero,
 * platform toggle, image groups, contributions). Otherwise it falls back to the
 * condensed registry article driven by caseStudies.ts.
 */
export function CaseStudyPanel({ study }: { study: CaseStudy }) {
  if (study.inProgress) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <CaseStudyEmptyState />
      </div>
    );
  }

  const RealPage = caseStudyPages[study.slug];
  if (RealPage) {
    // The page component provides its own ContentCard + scroll container, so it
    // fills the panel directly (no extra wrapper — that would double-scroll).
    return <RealPage />;
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <CaseStudyArticle study={study} />
    </div>
  );
}
