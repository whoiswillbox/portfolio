import { ContentCard } from "@/components/content-card";

export default function Components() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1 font-semibold">Components</h1>
          <p className="text-body-lg text-muted-foreground">
            Reusable UI components built on the Box foundations.
          </p>
        </div>
        <p className="text-body-md text-muted-foreground">Coming soon.</p>
      </div>
    </ContentCard>
  );
}
