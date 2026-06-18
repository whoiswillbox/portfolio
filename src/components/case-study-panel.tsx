import type { CaseStudy } from "@/lib/case-studies";
import { CaseStudyArticle } from "@/components/case-study-article";
import { CaseStudyEmptyState } from "@/components/case-study-empty-state";

/**
 * Full case-study view for the right-hand content card. Renders alongside the
 * chat so a visitor can read the case study while continuing to ask about it.
 * Uses the shared CaseStudyArticle so it matches the standalone case-study
 * pages exactly. No close button here — it's reached from the chat, which owns
 * the Back control that collapses the whole side-by-side view.
 */
export function CaseStudyPanel({ study }: { study: CaseStudy }) {
  if (study.inProgress) {
    return (
      <div className="flex h-full min-h-0 items-center justify-center">
        <CaseStudyEmptyState />
      </div>
    );
  }

  return (
    <div className="h-full min-h-0 overflow-y-auto">
      <CaseStudyArticle study={study} />
    </div>
  );
}
