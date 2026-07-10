import Link from "next/link";
import {
  CursorArrowRaysIcon,
  TagIcon,
  ExclamationTriangleIcon,
  ChatBubbleBottomCenterTextIcon,
  PencilSquareIcon,
  RectangleGroupIcon,
  Bars2Icon,
  MinusIcon,
  CheckIcon,
  DocumentTextIcon,
  Bars3BottomLeftIcon,
  ChartBarIcon,
  UserCircleIcon,
  PowerIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";

/* The Components index. A living gallery — start with the components we've
   actually customized / forked, and grow it as the shadcn base is adopted. */
const components = [
  { label: "Button", href: "/cardboard/components/button", icon: CursorArrowRaysIcon, description: "Actions, in every variant and size." },
  { label: "Badge", href: "/cardboard/components/badge", icon: TagIcon, description: "Compact status and category labels." },
  { label: "Alert", href: "/cardboard/components/alert", icon: ExclamationTriangleIcon, description: "Inline messages by intent." },
  { label: "Tooltip", href: "/cardboard/components/tooltip", icon: ChatBubbleBottomCenterTextIcon, description: "Hover hints and labels." },
  { label: "Input", href: "/cardboard/components/input", icon: PencilSquareIcon, description: "Single-line text fields." },
  { label: "Card", href: "/cardboard/components/card", icon: RectangleGroupIcon, description: "Grouped content surfaces." },
  { label: "Switch", href: "/cardboard/components/switch", icon: Bars2Icon, description: "On / off toggles." },
  { label: "Separator", href: "/cardboard/components/separator", icon: MinusIcon, description: "Dividing rules." },
  { label: "Checkbox", href: "/cardboard/components/checkbox", icon: CheckIcon, description: "Boolean selection controls." },
  { label: "Textarea", href: "/cardboard/components/textarea", icon: DocumentTextIcon, description: "Multi-line text fields." },
  { label: "Skeleton", href: "/cardboard/components/skeleton", icon: Bars3BottomLeftIcon, description: "Loading placeholders." },
  { label: "Progress", href: "/cardboard/components/progress", icon: ChartBarIcon, description: "Determinate progress bars." },
  { label: "Avatar", href: "/cardboard/components/avatar", icon: UserCircleIcon, description: "User images and initials." },
  { label: "Toggle", href: "/cardboard/components/toggle", icon: PowerIcon, description: "Two-state pressable buttons." },
  { label: "Spinner", href: "/cardboard/components/spinner", icon: ArrowPathIcon, description: "Indeterminate loading." },
];

export default function Components() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <div className="flex flex-col gap-3 mb-10">
          <h1 className="text-h1 font-semibold">Components</h1>
          <p className="text-body-lg text-muted-foreground">
            Reusable UI built on the Cardboard foundations — each rendered live,
            with its real variants and states.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {components.map(({ label, href, icon: Icon, description }) => (
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
