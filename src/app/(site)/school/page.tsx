import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { MobileOnly } from "@/components/mobile-only";
import { AcademicCapIcon, ChevronRightIcon } from "@heroicons/react/24/outline";

const items = [
  { label: "SwipeRight.ai", href: "/school/swiperight-ai", icon: AcademicCapIcon, description: "AI-powered dating app concept." },
];

export default function School() {
  return (
    <MobileOnly fallback="/school/swiperight-ai">
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:[@media(display-mode:standalone)]:pt-24 pb-10">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1 font-semibold">School</h1>
          <p className="text-body-lg text-muted-foreground">Projects from university.</p>
        </div>
        <div className="flex flex-col divide-y divide-border border-y border-border">
          {items.map(({ label, href, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted -mx-2 px-2 rounded-lg"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border">
                <Icon className="size-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium">{label}</div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
              <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </ContentCard>
    </MobileOnly>
  );
}
