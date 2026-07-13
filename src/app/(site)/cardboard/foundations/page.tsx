import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import {
  BoltIcon,
  StarIcon,
  HeartIcon,
  BellIcon,
  CubeIcon,
  SwatchIcon,
  SparklesIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
/* Each foundation card shows a skeleton "thumbnail": a soft window that FILLS
   the panel, holding muted wireframe blocks drawn to represent that foundation.
   The panel behind is neutral (bg-background) so the surface frame + blocks read
   with real contrast. Blocks use bg-muted-foreground/15–25 so they're visible on
   the frame's surface. */

// The window frame — fills the panel so the thumbnail has presence.
function Frame({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`h-full w-full rounded-lg border border-border bg-surface p-3 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
// A muted wireframe block with a subtle stroke for definition on the surface.
const block = "bg-muted ring-1 ring-border";

// Colors — a swatch strip over two label bars.
function ColorsPreview() {
  const tones = ["bg-foreground", "bg-fill-solid", "bg-surface-success", "bg-surface-caution", "bg-surface-critical"];
  return (
    <Frame className="flex flex-col justify-center gap-2.5">
      <div className="flex gap-1.5">
        {tones.map((t) => (
          <div key={t} className={`h-10 flex-1 rounded-md ring-1 ring-border/60 ${t}`} />
        ))}
      </div>
      <div className={`h-2.5 w-2/3 rounded-full ${block}`} />
      <div className={`h-2.5 w-1/2 rounded-full ${block}`} />
    </Frame>
  );
}

// Typography — a heading bar over descending body lines.
function TypographyPreview() {
  return (
    <Frame className="flex flex-col justify-center gap-2.5">
      <div className={`h-5 w-3/4 rounded ${block}`} />
      <div className={`h-2.5 w-full rounded-full ${block}`} />
      <div className={`h-2.5 w-full rounded-full ${block}`} />
      <div className={`h-2.5 w-2/3 rounded-full ${block}`} />
    </Frame>
  );
}

// Spacing — evenly gapped blocks showing rhythm.
function SpacingPreview() {
  return (
    <Frame className="flex flex-col justify-center gap-3">
      <div className="flex gap-3">
        <div className={`h-10 flex-1 rounded-md ${block}`} />
        <div className={`h-10 flex-1 rounded-md ${block}`} />
        <div className={`h-10 flex-1 rounded-md ${block}`} />
      </div>
      <div className="flex gap-3">
        <div className={`h-4 flex-1 rounded-md ${block}`} />
        <div className={`h-4 flex-1 rounded-md ${block}`} />
      </div>
    </Frame>
  );
}

// Radius — three tiles with increasing corner rounding.
function RadiusPreview() {
  return (
    <Frame className="flex items-center justify-around">
      <div className={`size-12 rounded-none ${block}`} />
      <div className={`size-12 rounded-lg ${block}`} />
      <div className={`size-12 rounded-[1.4rem] ${block}`} />
    </Frame>
  );
}

// Elevation — stacked, offset raised tiles at rising shadow levels.
function ElevationPreview() {
  return (
    <Frame className="flex items-center justify-center">
      <div className="relative size-20">
        <div className="absolute left-0 top-1 size-12 rounded-lg bg-muted ring-1 ring-border shadow-sm" />
        <div className="absolute left-4 top-3 size-12 rounded-lg bg-muted ring-1 ring-border shadow-md" />
        <div className="absolute left-8 top-5 size-12 rounded-lg bg-muted ring-1 ring-border shadow-xl" />
      </div>
    </Frame>
  );
}

// Iconography — a grid of actual icons in muted tiles.
function IconographyPreview() {
  const icons = [BoltIcon, StarIcon, HeartIcon, BellIcon, CubeIcon, SwatchIcon, SparklesIcon, FaceSmileIcon];
  return (
    <Frame className="flex items-center justify-center">
      <div className="grid grid-cols-4 gap-2.5">
        {icons.map((Icon, i) => (
          <div key={i} className={`flex size-7 items-center justify-center rounded-md ${block}`}>
            <Icon className="size-4 text-muted-foreground" strokeWidth={1.5} />
          </div>
        ))}
      </div>
    </Frame>
  );
}

const foundations = [
  { label: "Colors", href: "/cardboard/foundations/colors", preview: <ColorsPreview />, description: "Palette, semantic tokens, and themes." },
  { label: "Typography", href: "/cardboard/foundations/typography", preview: <TypographyPreview />, description: "Type scale, fonts, and text styles." },
  { label: "Spacing", href: "/cardboard/foundations/spacing", preview: <SpacingPreview />, description: "The spacing scale and layout rhythm." },
  { label: "Radius", href: "/cardboard/foundations/radius", preview: <RadiusPreview />, description: "Corner radii across components." },
  { label: "Elevation", href: "/cardboard/foundations/elevation", preview: <ElevationPreview />, description: "Shadows and layering depth." },
  { label: "Iconography", href: "/cardboard/foundations/iconography", preview: <IconographyPreview />, description: "Icon set, sizing, and usage." },
];

export default function Foundations() {
  return (
    <ContentCard flush className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-6xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1">Foundations</h1>
          <p className="text-body-lg text-muted-foreground">
            The primitives of Cardboard — color, type, spacing, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {foundations.map(({ label, href, preview, description }) => (
            <div key={href} className="group relative flex flex-col gap-3">
              <div className="h-36 overflow-hidden rounded-xl border border-border bg-muted p-4 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
                <div className="pointer-events-none h-full w-full">{preview}</div>
              </div>
              <div className="flex flex-col gap-1">
                <Link
                  href={href}
                  className="text-body-md font-medium text-foreground after:absolute after:inset-0 after:content-[''] focus-visible:outline-none"
                >
                  {label}
                </Link>
                <div className="text-body-sm text-muted-foreground">{description}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </ContentCard>
  );
}
