import { ContentCard } from "@/components/content-card";
import { CaseStudyArticle } from "@/components/case-study-article";
import { caseStudies } from "@/lib/case-studies";

export default function NextGenBar() {
  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyArticle study={caseStudies["next-gen-bar"]} />
    </ContentCard>
  );
}
