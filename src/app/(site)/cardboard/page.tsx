import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import { BoxLogo } from "@/components/box-logo";
import {
  SwatchIcon,
  CubeTransparentIcon,
  WrenchScrewdriverIcon,
} from "@heroicons/react/24/outline";
import {
  FOUNDATIONS_HREF,
  COMPONENTS_HREF,
  UTILITIES_HREF,
} from "@/lib/cardboard-nav";

// The bare /cardboard is the design system's Getting Started landing — shown
// before you pick a section. Full-width card, no sidebar (see app-shell's
// isCardboardLanding). The three cards route into Foundations / Components /
// Utilities, the same three top-nav sections.
const sections = [
  {
    label: "Foundations",
    href: FOUNDATIONS_HREF,
    icon: SwatchIcon,
    description:
      "The primitives — color, typography, spacing, radius, elevation, and iconography — expressed as tokens.",
  },
  {
    label: "Components",
    href: COMPONENTS_HREF,
    icon: CubeTransparentIcon,
    description:
      "The vendored, customized UI library — buttons, inputs, dialogs, and more — each with a live doc page.",
  },
  {
    label: "Utilities",
    href: UTILITIES_HREF,
    icon: WrenchScrewdriverIcon,
    description:
      "Helpers, wrappers, and assets that aren't interactive UI — render wrappers, brand marks, and glyph primitives.",
  },
];

export default function CardboardGettingStarted() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        {/* Intro */}
        <div className="mb-12 flex flex-col gap-4">
          <span className="flex size-12 items-center justify-center rounded-xl bg-muted ring-1 ring-border">
            <BoxLogo className="size-7" />
          </span>
          <div className="flex flex-col gap-3">
            <h1 className="text-h1">Cardboard</h1>
            <p className="text-body-lg text-muted-foreground">
              The portfolio&apos;s design system — a token architecture, a
              customized component library, and this living doc site. Pick a
              section below to get started.
            </p>
          </div>
        </div>

        {/* Section cards */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          {sections.map(({ label, href, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-muted/40 p-5 transition-all duration-200 hover:bg-muted hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
            >
              <span className="flex size-9 items-center justify-center rounded-lg bg-surface text-foreground ring-1 ring-border">
                <Icon className="size-5" />
              </span>
              <div className="flex flex-col gap-1">
                <span className="text-body-md font-medium text-foreground">
                  {label}
                </span>
                <span className="text-body-sm text-muted-foreground">
                  {description}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ContentCard>
  );
}
