import Link from "next/link";
import { ContentCard } from "@/components/content-card";
import {
  SwatchIcon,
  LanguageIcon,
  Squares2X2Icon,
  Square2StackIcon,
  SparklesIcon,
  CubeTransparentIcon,
} from "@heroicons/react/24/outline";

const foundations = [
  { label: "Colors", href: "/cardboard/foundations/colors", icon: SwatchIcon, description: "Palette, semantic tokens, and themes." },
  { label: "Typography", href: "/cardboard/foundations/typography", icon: LanguageIcon, description: "Type scale, fonts, and text styles." },
  { label: "Spacing", href: "/cardboard/foundations/spacing", icon: Squares2X2Icon, description: "The spacing scale and layout rhythm." },
  { label: "Radius", href: "/cardboard/foundations/radius", icon: Square2StackIcon, description: "Corner radii across components." },
  { label: "Elevation", href: "/cardboard/foundations/elevation", icon: SparklesIcon, description: "Shadows and layering depth." },
  { label: "Iconography", href: "/cardboard/foundations/iconography", icon: CubeTransparentIcon, description: "Icon set, sizing, and usage." },
];

export default function Foundations() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1 font-semibold">Foundations</h1>
          <p className="text-body-lg text-muted-foreground">
            The primitives of Cardboard — color, type, spacing, and more.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {foundations.map(({ label, href, icon: Icon, description }) => (
            <Link
              key={href}
              href={href}
              className="group flex flex-col gap-3 rounded-xl border border-border bg-background p-5 transition-colors hover:bg-muted"
            >
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted ring-1 ring-border transition-colors group-hover:bg-background">
                <Icon className="size-5 text-foreground" />
              </div>
              <div className="flex flex-col gap-1">
                <div className="text-body-md font-medium">{label}</div>
                <div className="text-body-sm text-muted-foreground">{description}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </ContentCard>
  );
}
