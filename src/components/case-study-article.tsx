import type { CaseStudy } from "@/lib/case-studies";
import { CaseStudyLayout } from "@/components/case-study-layout";

/**
 * Registry-driven case study: maps a `caseStudies` entry onto the shared
 * CaseStudyLayout. Used by the standalone next-gen-bar page and the in-chat
 * CaseStudyPanel, so they match the hand-authored case-study pages exactly.
 */
export function CaseStudyArticle({ study }: { study: CaseStudy }) {
  // meta is "Role · Company · Timeline" — split into the sidebar fields.
  const [role, company, timeline] = study.meta.split("·").map((s) => s.trim());
  const meta = [
    { label: "Company", value: company },
    { label: "Timeline", value: timeline },
    { label: "Role", value: role },
  ].filter((m) => m.value);

  return (
    <CaseStudyLayout
      title={study.title}
      summary={study.summary}
      meta={meta}
      metrics={study.metrics}
      sections={study.sections.map((s) => ({ heading: s.heading, paragraphs: [s.body] }))}
    />
  );
}
