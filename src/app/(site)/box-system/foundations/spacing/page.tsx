import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";

export default function Spacing() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <Link
          href="/box-system/foundations"
          className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" />
          Foundations
        </Link>
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1 font-semibold">Spacing</h1>
          <p className="text-body-lg text-muted-foreground">
            The spacing scale and layout rhythm.
          </p>
        </div>
        <p className="text-body-md text-muted-foreground">Coming soon.</p>
      </div>
    </ContentCard>
  );
}
