import { ScrollArea } from "@/components/cardboard/scroll-area";
import { ComponentPage, Demo } from "../_component-page";

const tags = Array.from({ length: 24 }, (_, i) => `v1.2.0-beta.${i + 1}`);

export default function ScrollAreaDocs() {
  return (
    <ComponentPage
      title="Scroll Area"
      description="A scroll container with a custom thumb that only shows on interaction. The thumb uses the border token; the viewport ring uses the focus-ring token."
    >
      <Demo title="Vertical">
        <ScrollArea className="h-48 w-56 rounded-lg border border-border bg-background">
          <div className="flex flex-col gap-2 p-4">
            <p className="text-body-sm font-medium">Tags</p>
            {tags.map((t) => (
              <div key={t} className="text-body-sm text-muted-foreground">
                {t}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Demo>
    </ComponentPage>
  );
}
