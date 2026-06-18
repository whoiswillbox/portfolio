import { ContentCard } from "@/components/content-card";
import { CaseStudyEmptyState } from "@/components/case-study-empty-state";

export default function Deborah() {
  return (
    <ContentCard className="flex h-full items-center justify-center">
      <CaseStudyEmptyState />
    </ContentCard>
  );
}
