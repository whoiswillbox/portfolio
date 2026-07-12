import { InboxIcon } from "@heroicons/react/24/outline";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/cardboard/empty";
import { Button } from "@/components/cardboard/button";
import { CaseStudyEmptyState } from "@/components/case-study-empty-state";
import { ComponentPage, Demo, Specs } from "../_component-page";

export default function EmptyDocs() {
  return (
    <ComponentPage
      title="Empty"
      description="Empty-state layouts — an icon or illustration, a title, and a short message."
    >
      <Demo
        title="Case study empty state"
        caption="The real, in-use empty state — shown on case studies still in progress. Custom box illustration, Cardboard type tokens."
      >
        <div className="w-full">
          <CaseStudyEmptyState />
        </div>
      </Demo>

      {/* Specs — the anatomy, so this reads as a build-from template. */}
      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">Anatomy</h2>
          <p className="text-body-sm text-muted-foreground">
            The specs that make up the empty state — build other empty states to match.
          </p>
        </div>
        <Specs
          rows={[
            { part: "Illustration", spec: "size-24 · text-foreground (inherits currentColor)" },
            { part: "Title", spec: "text-h3 · font-heading · font-semibold · text-foreground" },
            { part: "Body", spec: "text-body-sm · text-muted-foreground · max-w-xs" },
            { part: "Container", spec: "flex-col · items-center · text-center · gap-5 · px-8 py-14" },
            { part: "Title ↔ body gap", spec: "gap-3" },
          ]}
        />
      </section>

      <Demo
        title="Empty primitive"
        caption="The composable base — icon / title / description / action slots — for building other empty states."
      >
        <Empty className="max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription>
              When you receive messages, they&apos;ll show up here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Compose</Button>
          </EmptyContent>
        </Empty>
      </Demo>
    </ComponentPage>
  );
}
