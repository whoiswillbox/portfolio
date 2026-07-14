import dynamic from "next/dynamic";
import type { ComponentType } from "react";

/**
 * Slug → hand-authored case-study page component.
 *
 * The in-chat CaseStudyPanel renders the SAME page a visitor sees at the
 * standalone route (rich hero, platform toggles, image groups, contributions)
 * — one source of truth. Studies NOT listed here fall back to the condensed
 * registry article (CaseStudyArticle driven by caseStudies.ts).
 *
 * Lazy (next/dynamic) so these heavy pages don't inflate the Box AI bundle;
 * they load only when a study with a real page is opened. `ssr: false` is safe
 * — the panel is client-only (rendered inside the chat).
 */
export const caseStudyPages: Record<string, ComponentType> = {
  "design-standards": dynamic(() => import("@/app/(site)/technergetics/design-standards/page"), { ssr: false }),
  jetdash: dynamic(() => import("@/app/(site)/technergetics/jetdash/page"), { ssr: false }),
  lightcert: dynamic(() => import("@/app/(site)/technergetics/lightcert/page"), { ssr: false }),
  upgrade: dynamic(() => import("@/app/(site)/technergetics/upgrade/page"), { ssr: false }),
  "reusable-table": dynamic(() => import("@/app/(site)/technergetics/reusable-table/page"), { ssr: false }),
};

/** True when a study has a hand-authored standalone page (rendered in-chat). */
export function hasRealPage(slug: string): boolean {
  return slug in caseStudyPages;
}
