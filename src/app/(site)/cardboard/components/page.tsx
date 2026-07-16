"use client";

import { ContentCard } from "@/components/content-card";
import { components, ComponentCard } from "./component-registry";

/* The Components index. A living gallery — each card shows a real, live preview
   of the component (from the shared registry), then title + description. */

export default function Components() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1">Components</h1>
          <p className="text-body-lg text-muted-foreground">
            Reusable UI built on the Cardboard foundations — each rendered live,
            with its real variants and states.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {[...components]
            .filter((c) => !c.utility)
            .sort((a, b) => a.label.localeCompare(b.label))
            .map((c) => (
              <ComponentCard key={c.href} {...c} />
            ))}
        </div>
      </div>
    </ContentCard>
  );
}
