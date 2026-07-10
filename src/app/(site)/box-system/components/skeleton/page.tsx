import { Skeleton } from "@/components/cardboard/skeleton";
import { ComponentPage, Demo } from "../_component-page";

export default function SkeletonDocs() {
  return (
    <ComponentPage
      title="Skeleton"
      description="A pulsing placeholder shown while content loads. Uses the secondary surface token."
    >
      <Demo title="Shapes" caption="Size and round it with utility classes.">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Skeleton className="h-8 w-8 rounded-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </Demo>

      <Demo title="Card placeholder">
        <div className="flex w-full max-w-sm items-center gap-3">
          <Skeleton className="size-12 rounded-full" />
          <div className="flex flex-1 flex-col gap-2">
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-3 w-3/4" />
          </div>
        </div>
      </Demo>
    </ComponentPage>
  );
}
