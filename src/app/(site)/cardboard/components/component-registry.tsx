"use client";

/* Shared component registry — the gallery data (live preview + name +
   description + route) plus the ComponentCard used to render it. Consumed by
   the Components index AND the per-component "Related" sections. */

import Link from "next/link";
import { StarIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";

import { Button } from "@/components/cardboard/button";
import { Badge } from "@/components/cardboard/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/cardboard/alert";
import { Input } from "@/components/cardboard/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/cardboard/card";
import { Switch } from "@/components/cardboard/switch";
import { Separator } from "@/components/cardboard/separator";
import { Textarea } from "@/components/cardboard/textarea";
import { ThinkingSteps } from "@/components/cardboard/thinking-steps";
import { SparklesIcon } from "@heroicons/react/24/outline";
import { Skeleton } from "@/components/cardboard/skeleton";
import { Progress } from "@/components/cardboard/progress";
import { Avatar, AvatarFallback } from "@/components/cardboard/avatar";
import { Kbd } from "@/components/cardboard/kbd";
import { Label } from "@/components/cardboard/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/cardboard/tabs";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/cardboard/breadcrumb";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
} from "@/components/cardboard/item";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/cardboard/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/cardboard/input-otp";
import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from "@/components/cardboard/table";
import { CaseStudyEmptyState } from "@/components/case-study-empty-state";
import { BoxLogo } from "@/components/box-logo";

/* The Components index. A living gallery — each card shows a real, live preview
   of the component rendered on a muted panel, then title + description below.
   Interactive previews are fine — the whole index is a client component. */

// A boxed static-window mock for components whose real thing is an overlay
// (dialog, popover, dropdown, tooltip, etc.) — shows a representative frame.
export function Window({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[13rem] rounded-lg border border-border bg-surface p-3 shadow-md">
      {children}
    </div>
  );
}

export const components: {
  label: string;
  href: string;
  description: string;
  preview: React.ReactNode;
  /** Utilities (helpers/wrappers/assets) — kept in the registry for Related
      lookups + doc pages, but filtered out of the Components gallery grid. */
  utility?: boolean;
}[] = [
  {
    label: "Button",
    href: "/cardboard/components/button",
    description: "Actions, in every variant and size.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Button size="sm">Primary</Button>
        <Button size="sm" variant="outline">Outline</Button>
        <Button size="sm" variant="ghost">Ghost</Button>
      </div>
    ),
  },
  {
    label: "Badge",
    href: "/cardboard/components/badge",
    description: "Compact status and category labels.",
    preview: (
      <div className="flex flex-wrap items-center justify-center gap-2">
        <Badge>Default</Badge>
        <Badge variant="secondary">Secondary</Badge>
        <Badge variant="outline">Outline</Badge>
      </div>
    ),
  },
  {
    label: "Alert",
    href: "/cardboard/components/alert",
    description: "Inline messages by intent.",
    preview: (
      <Alert className="max-w-[15rem]">
        <AlertTitle>Heads up</AlertTitle>
        <AlertDescription>A short inline message.</AlertDescription>
      </Alert>
    ),
  },
  {
    label: "Tooltip",
    href: "/cardboard/components/tooltip",
    description: "Hover hints and labels.",
    preview: (
      <div className="flex flex-col items-center gap-1.5">
        <span className="rounded-md bg-inverse px-2 py-1 text-body-xs text-on-inverse">
          Copy link
        </span>
        <span className="size-2 rotate-45 bg-inverse" />
      </div>
    ),
  },
  {
    label: "Input",
    href: "/cardboard/components/input",
    description: "Single-line text fields.",
    preview: <Input placeholder="Search…" className="max-w-[13rem]" />,
  },
  {
    label: "Input Group",
    href: "/cardboard/components/input-group",
    description: "An input with attached addons.",
    preview: (
      <InputGroup className="max-w-[13rem]">
        <InputGroupAddon>
          <MagnifyingGlassIcon />
        </InputGroupAddon>
        <InputGroupInput placeholder="Search…" />
      </InputGroup>
    ),
  },
  {
    label: "Input OTP",
    href: "/cardboard/components/input-otp",
    description: "One-time passcode field.",
    preview: (
      <InputOTP maxLength={4} value="12" readOnly onChange={() => {}}>
        <InputOTPGroup>
          <InputOTPSlot index={0} />
          <InputOTPSlot index={1} />
          <InputOTPSlot index={2} />
          <InputOTPSlot index={3} />
        </InputOTPGroup>
      </InputOTP>
    ),
  },
  {
    label: "Item",
    href: "/cardboard/components/item",
    description: "A flexible list row.",
    preview: (
      <Item variant="outline" className="max-w-[14rem]">
        <ItemMedia variant="icon">
          <UserCircleIcon />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Will Box</ItemTitle>
          <ItemDescription>Designer & engineer</ItemDescription>
        </ItemContent>
        <ChevronRightIcon className="size-4 text-muted-foreground" />
      </Item>
    ),
  },
  {
    label: "Card",
    href: "/cardboard/components/card",
    description: "Grouped content surfaces.",
    preview: (
      <Card className="w-full max-w-[13rem] py-4">
        <CardHeader className="px-4">
          <CardTitle className="text-body-md">Title</CardTitle>
        </CardHeader>
        <CardContent className="px-4 text-body-sm text-muted-foreground">
          Grouped content.
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Switch",
    href: "/cardboard/components/switch",
    description: "On / off toggles.",
    preview: (
      <div className="flex items-center gap-4">
        <Switch defaultChecked />
        <Switch />
      </div>
    ),
  },
  {
    label: "Separator",
    href: "/cardboard/components/separator",
    description: "Dividing rules.",
    preview: (
      <div className="flex w-full max-w-[13rem] flex-col gap-2 text-body-sm">
        <span>Above</span>
        <Separator />
        <span className="text-muted-foreground">Below</span>
      </div>
    ),
  },
  {
    label: "Textarea",
    href: "/cardboard/components/textarea",
    description: "Multi-line text fields.",
    preview: <Textarea placeholder="Write a note…" className="max-w-[13rem]" rows={3} />,
  },
  {
    label: "Thinking Steps",
    href: "/cardboard/components/thinking-steps",
    description: "Sequential reasoning trace.",
    preview: (
      <ThinkingSteps
        className="max-w-[15rem]"
        steps={[
          { label: "Searching…", icon: MagnifyingGlassIcon, status: "done" },
          { label: "Drafting…", icon: SparklesIcon, status: "active" },
        ]}
      />
    ),
  },
  {
    label: "Skeleton",
    href: "/cardboard/components/skeleton",
    description: "Loading placeholders.",
    preview: (
      <div className="flex w-full max-w-[13rem] items-center gap-3">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex flex-1 flex-col gap-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-2/3" />
        </div>
      </div>
    ),
  },
  {
    label: "Progress",
    href: "/cardboard/components/progress",
    description: "Determinate progress bars.",
    preview: <Progress value={62} className="max-w-[13rem]" />,
  },
  {
    label: "Kbd",
    href: "/cardboard/components/kbd",
    utility: true,
    description: "Keyboard keys and shortcuts.",
    preview: (
      <div className="flex items-center gap-1 text-body-sm">
        <Kbd>⌘</Kbd><Kbd>K</Kbd>
      </div>
    ),
  },
  {
    label: "Tabs",
    href: "/cardboard/components/tabs",
    description: "Switch between panels.",
    preview: (
      <Tabs defaultValue="a">
        <TabsList>
          <TabsTrigger value="a">Account</TabsTrigger>
          <TabsTrigger value="b">Password</TabsTrigger>
        </TabsList>
      </Tabs>
    ),
  },
  {
    label: "Accordion",
    href: "/cardboard/components/accordion",
    description: "Expandable sections.",
    preview: (
      <div className="w-full max-w-[13rem] text-body-sm">
        <div className="flex items-center justify-between border-b border-border pb-2 font-medium">
          Is it accessible? <span className="text-muted-foreground">⌄</span>
        </div>
        <p className="pt-2 text-muted-foreground">Yes. It follows WAI-ARIA.</p>
      </div>
    ),
  },
  {
    label: "Dialog",
    href: "/cardboard/components/dialog",
    description: "Modal overlays.",
    preview: (
      <Window>
        <div className="text-body-sm font-medium">Delete project?</div>
        <div className="mt-1 text-body-xs text-muted-foreground">This can’t be undone.</div>
        <div className="mt-3 flex justify-end gap-2">
          <Button size="sm" variant="ghost">Cancel</Button>
          <Button size="sm">Delete</Button>
        </div>
      </Window>
    ),
  },
  {
    label: "Popover",
    href: "/cardboard/components/popover",
    description: "Anchored floating content.",
    preview: (
      <Window>
        <div className="text-body-sm font-medium">Dimensions</div>
        <div className="mt-1 text-body-xs text-muted-foreground">Set the layout size.</div>
      </Window>
    ),
  },
  {
    label: "Select",
    href: "/cardboard/components/select",
    description: "Choose one from a dropdown.",
    preview: (
      <Window>
        <div className="rounded-md bg-surface-secondary px-2 py-1 text-body-sm text-foreground">Apple</div>
        <div className="px-2 py-1 text-body-sm text-muted-foreground">Banana</div>
        <div className="px-2 py-1 text-body-sm text-muted-foreground">Cherry</div>
      </Window>
    ),
  },
  {
    label: "Segmented Control",
    href: "/cardboard/components/segmented-control",
    description: "Single-select pill-on-track switch.",
    preview: (
      <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
        <div className="rounded-md px-3 py-1.5 text-body-sm text-tertiary">Item</div>
        <div className="rounded-md bg-background px-3 py-1.5 text-body-sm font-medium text-foreground shadow-sm">Item</div>
      </div>
    ),
  },
  {
    label: "Dropdown Menu",
    href: "/cardboard/components/dropdown-menu",
    description: "A menu of actions.",
    preview: (
      <Window>
        <div className="rounded-md bg-surface-secondary px-2 py-1 text-body-sm">Edit</div>
        <div className="px-2 py-1 text-body-sm">Duplicate</div>
        <div className="px-2 py-1 text-body-sm text-critical">Delete</div>
      </Window>
    ),
  },
  {
    label: "Context Menu",
    href: "/cardboard/components/context-menu",
    description: "Right-click menus.",
    preview: (
      <Window>
        <div className="px-2 py-1 text-body-sm">Back</div>
        <div className="rounded-md bg-surface-secondary px-2 py-1 text-body-sm">Reload</div>
        <div className="px-2 py-1 text-body-sm text-muted-foreground">Save as…</div>
      </Window>
    ),
  },
  {
    label: "Alert Dialog",
    href: "/cardboard/components/alert-dialog",
    description: "Confirm consequential actions.",
    preview: (
      <Window>
        <div className="text-body-sm font-medium">Are you sure?</div>
        <div className="mt-1 text-body-xs text-muted-foreground">This will permanently delete.</div>
        <div className="mt-3 flex justify-end gap-2">
          <Button size="sm" variant="outline">Cancel</Button>
          <Button size="sm">Continue</Button>
        </div>
      </Window>
    ),
  },
  {
    label: "Breadcrumb",
    href: "/cardboard/components/breadcrumb",
    description: "Path to the current page.",
    preview: (
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem><BreadcrumbLink href="#">Home</BreadcrumbLink></BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem><BreadcrumbPage>Components</BreadcrumbPage></BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
    ),
  },
  {
    label: "Nav Bar",
    href: "/cardboard/components/nav-bar",
    description: "Top app bar — brand mark and product switcher.",
    preview: (
      <div className="w-full max-w-[13rem] overflow-hidden rounded-md border border-border bg-background">
        <div className="flex h-9 items-center gap-2 border-b border-border/60 px-2.5">
          <div className="size-4 rounded bg-foreground" />
          <span className="text-body-xs font-medium text-foreground">Cardboard</span>
          <ChevronDownIcon className="size-3 text-tertiary" />
        </div>
        <div className="h-6" />
      </div>
    ),
  },
  {
    label: "Field",
    href: "/cardboard/components/field",
    description: "The form-row primitive.",
    preview: (
      <div className="flex w-full max-w-[13rem] flex-col gap-1.5">
        <Label className="text-body-sm">Email</Label>
        <Input placeholder="you@example.com" />
        <span className="text-body-xs text-muted-foreground">We’ll never share it.</span>
      </div>
    ),
  },
  {
    label: "Table",
    href: "/cardboard/components/table",
    description: "Simple data tables.",
    preview: (
      <div className="w-full max-w-[15rem]">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Invoice</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow>
              <TableCell className="font-medium">INV001</TableCell>
              <TableCell className="text-right">$250</TableCell>
            </TableRow>
            <TableRow>
              <TableCell className="font-medium">INV002</TableCell>
              <TableCell className="text-right">$150</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    ),
  },
  {
    label: "Resizable",
    href: "/cardboard/components/resizable",
    description: "Draggable split panels.",
    preview: (
      <div className="flex h-24 w-full max-w-[15rem] items-stretch overflow-hidden rounded-lg border border-border text-body-xs text-muted-foreground">
        <div className="flex flex-1 items-center justify-center">One</div>
        <div className="relative flex w-px items-center justify-center bg-border">
          <div className="z-10 h-6 w-1 rounded-lg bg-border" />
        </div>
        <div className="flex flex-1 items-center justify-center">Two</div>
      </div>
    ),
  },
  {
    label: "Menubar",
    href: "/cardboard/components/menubar",
    description: "Desktop-style menu bar.",
    preview: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex h-8 items-center gap-0.5 rounded-lg border border-border p-[3px] text-body-sm font-medium">
          <span className="rounded-sm bg-surface-secondary px-1.5 py-[2px]">File</span>
          <span className="px-1.5 py-[2px]">Edit</span>
          <span className="px-1.5 py-[2px]">View</span>
        </div>
        <div className="w-32 rounded-lg border border-border bg-surface p-1 shadow-md">
          <div className="rounded-md bg-surface-secondary px-1.5 py-1 text-body-sm">New Tab</div>
          <div className="px-1.5 py-1 text-body-sm text-muted-foreground">New Window</div>
        </div>
      </div>
    ),
  },
  {
    label: "Navigation Menu",
    href: "/cardboard/components/navigation-menu",
    description: "Site nav with flyout panels.",
    preview: (
      <div className="flex flex-col items-center gap-2">
        <div className="flex items-center gap-1 text-body-sm font-medium">
          <span className="rounded-lg bg-surface-secondary px-2.5 py-1.5">Products ⌄</span>
          <span className="px-2.5 py-1.5">Docs</span>
        </div>
        <div className="w-40 rounded-lg border border-border bg-surface p-2 shadow-md">
          <div className="rounded-md bg-surface-secondary p-2 text-body-sm">Introduction</div>
          <div className="p-2 text-body-sm text-muted-foreground">Installation</div>
        </div>
      </div>
    ),
  },
  {
    label: "Drawer",
    href: "/cardboard/components/drawer",
    description: "Edge-anchored sliding panel.",
    preview: (
      <div className="flex h-28 w-full max-w-[14rem] flex-col justify-end overflow-hidden rounded-lg bg-surface-secondary/40 ring-1 ring-border">
        <div className="rounded-t-xl border-t border-border bg-surface px-4 pb-4 pt-2 shadow-lg">
          <div className="mx-auto mb-3 h-1 w-10 rounded-full bg-surface-secondary" />
          <div className="text-body-sm font-medium">Are you sure?</div>
          <div className="text-body-xs text-muted-foreground">This archives the chat.</div>
        </div>
      </div>
    ),
  },
  {
    label: "Command",
    href: "/cardboard/components/command",
    description: "Filterable command palette.",
    preview: (
      <div className="w-full max-w-[15rem] rounded-xl border border-border bg-surface p-1 shadow-md">
        <div className="mb-1 flex items-center gap-2 rounded-lg bg-surface-secondary px-2 py-1.5 text-body-sm text-muted-foreground">
          <MagnifyingGlassIcon className="size-4" />
          Search…
        </div>
        <div className="rounded-md bg-surface-secondary px-2 py-1 text-body-sm">Calendar</div>
        <div className="px-2 py-1 text-body-sm text-muted-foreground">Search people</div>
      </div>
    ),
  },
  {
    label: "Combobox",
    href: "/cardboard/components/combobox",
    description: "Autocomplete input.",
    preview: (
      <div className="w-full max-w-[13rem]">
        <div className="flex items-center justify-between rounded-lg border border-border-focus px-3 py-1.5 text-body-sm ring-3 ring-border-focus/50">
          <span className="text-muted-foreground">Search</span>
          <ChevronDownIcon className="size-4 text-muted-foreground" />
        </div>
        <div className="mt-1 rounded-lg border border-border bg-surface p-1 shadow-md">
          <div className="rounded-md bg-surface-secondary px-2 py-1 text-body-sm">Lounge wear</div>
          <div className="px-2 py-1 text-body-sm text-muted-foreground">Accessories</div>
          <div className="px-2 py-1 text-body-sm text-muted-foreground">Cosmetics</div>
        </div>
      </div>
    ),
  },
  // Custom, in-use components built on the foundations.
  {
    label: "Empty",
    href: "/cardboard/components/empty",
    description: "Empty-state layouts.",
    preview: (
      <div className="scale-90">
        <CaseStudyEmptyState />
      </div>
    ),
  },
  {
    label: "Content Card",
    href: "/cardboard/components/content-card",
    description: "The full-height page surface.",
    preview: (
      <div className="flex h-24 w-full max-w-[13rem] flex-col rounded-xl border border-border bg-background shadow-sm">
        <div className="flex-1 p-3 text-body-xs text-muted-foreground">Page content…</div>
      </div>
    ),
  },
  {
    label: "Image Lightbox",
    href: "/cardboard/components/image-lightbox",
    description: "Click-to-zoom images.",
    preview: (
      <div className="grid grid-cols-3 gap-1.5">
        {[0, 1, 2].map((i) => (
          <div key={i} className="size-12 rounded-md bg-surface-secondary ring-1 ring-border" />
        ))}
      </div>
    ),
  },
  {
    label: "Contact Card",
    href: "/cardboard/components/contact-card",
    description: "Contact links card.",
    preview: (
      <Card className="w-full max-w-[13rem] gap-2 py-3">
        <CardContent className="flex items-center gap-2 px-3 text-body-sm">
          <Avatar className="size-8"><AvatarFallback>WB</AvatarFallback></Avatar>
          <span className="font-medium">Get in touch</span>
        </CardContent>
      </Card>
    ),
  },
  {
    label: "Copy Token",
    href: "/cardboard/components/copy-token",
    utility: true,
    description: "Click-to-copy token name.",
    preview: (
      <code className="rounded-md bg-surface-secondary px-2 py-1 font-mono text-body-xs text-foreground ring-1 ring-border">
        --color-fill-solid
      </code>
    ),
  },
  {
    label: "Logo",
    href: "/cardboard/components/logo",
    utility: true,
    description: "The Box cube mark.",
    preview: <BoxLogo className="size-10 text-foreground" />,
  },
  {
    label: "Mobile Only",
    href: "/cardboard/components/mobile-only",
    utility: true,
    description: "Mobile-only render wrapper.",
    preview: (
      <div className="flex h-24 w-14 flex-col rounded-[1rem] border-2 border-border bg-background p-1">
        <div className="mx-auto mt-0.5 h-1 w-6 rounded-full bg-border" />
        <div className="flex-1" />
      </div>
    ),
  },
  {
    label: "Sheet",
    href: "/cardboard/components/sheet",
    description: "Panel that slides in from an edge.",
    preview: (
      <div className="relative h-24 w-40 overflow-hidden rounded-lg border border-border bg-muted">
        <div className="absolute inset-0 bg-black/20" />
        <div className="absolute inset-y-0 right-0 w-24 border-l border-border bg-surface p-2 shadow-lg">
          <div className="h-2 w-12 rounded-full bg-border" />
          <div className="mt-2 h-1.5 w-16 rounded-full bg-surface-secondary" />
          <div className="mt-1 h-1.5 w-14 rounded-full bg-surface-secondary" />
        </div>
      </div>
    ),
  },
  {
    label: "Sidebar",
    href: "/cardboard/components/sidebar",
    description: "Collapsible app navigation.",
    preview: (
      <div className="flex h-24 w-40 overflow-hidden rounded-lg border border-border">
        <div className="flex w-14 flex-col gap-1.5 bg-sidebar p-2">
          <div className="h-2 w-full rounded-sm bg-sidebar-accent" />
          <div className="h-2 w-8 rounded-sm bg-sidebar-accent" />
          <div className="h-2 w-9 rounded-sm bg-sidebar-accent" />
        </div>
        <div className="flex-1 bg-surface p-2">
          <div className="h-1.5 w-10 rounded-full bg-surface-secondary" />
          <div className="mt-1.5 h-1.5 w-14 rounded-full bg-surface-secondary" />
        </div>
      </div>
    ),
  },
];

export type ComponentEntry = (typeof components)[number];

/** Look up a registry entry by its route (for Related sections). */
export function getComponent(href: string): ComponentEntry | undefined {
  return components.find((c) => c.href === href);
}

/** The gallery card: a live preview on a muted panel + name + description, with
    a stretched link. Shared by the Components index and Related sections. */
export function ComponentCard({ label, href, description, preview }: ComponentEntry) {
  return (
    <div className="group relative flex flex-col gap-3">
      <div className="flex h-32 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted p-4 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
        <div className="pointer-events-none scale-[0.85]">{preview}</div>
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
  );
}
