import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import {
  FolderIcon,
  BuildingOffice2Icon,
  BoltIcon,
  DocumentTextIcon,
  ChevronRightIcon,
} from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";

const items = [
  { label: "BARBRI", href: "/projects/next-gen-bar", icon: FolderIcon, description: "Next-gen bar exam prep.", badge: "PACKAGING" },
  { label: "Jetdash", href: "/technergetics/jetdash", icon: BuildingOffice2Icon, description: "Ops dashboard for field technicians." },
  { label: "Upgrade", href: "/technergetics/upgrade", icon: BuildingOffice2Icon, description: "Self-service plan upgrade flow." },
  { label: "Reusable Table", href: "/technergetics/reusable-table", icon: BuildingOffice2Icon, description: "Design system data table component." },
  { label: "Design Standards", href: "/technergetics/design-standards", icon: BuildingOffice2Icon, description: "Company-wide design language." },
  { label: "Lightcert", href: "/technergetics/lightcert", icon: BoltIcon, description: "Certification management platform." },
  { label: "Resume", href: "/resume", icon: DocumentTextIcon, description: "Full work history." },
];

export default function Experience() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 pb-10">
        <div className="flex flex-col gap-3 mb-8">
          <h1 className="text-h1 font-semibold">Experience</h1>
          <p className="text-body-lg text-muted-foreground">Work and projects.</p>
        </div>
        <div className="flex flex-col divide-y divide-border border-y border-border">
          {items.map(({ label, href, icon: Icon, description, badge }) => (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-4 py-4 transition-colors hover:bg-muted active:bg-muted -mx-2 px-2 rounded-lg"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted">
                <Icon className="size-5 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 text-sm font-medium">
                  {label}
                  {badge && <Badge variant="warning">{badge}</Badge>}
                </div>
                <div className="text-xs text-muted-foreground">{description}</div>
              </div>
              <ChevronRightIcon className="size-4 text-muted-foreground shrink-0" />
            </Link>
          ))}
        </div>
      </div>
    </ContentCard>
  );
}
