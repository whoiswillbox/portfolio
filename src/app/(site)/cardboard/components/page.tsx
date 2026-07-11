"use client";

import Link from "next/link";
import { StarIcon, MagnifyingGlassIcon, UserCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";

import { Button } from "@/components/cardboard/button";
import { Badge } from "@/components/cardboard/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/cardboard/alert";
import { Input } from "@/components/cardboard/input";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/cardboard/card";
import { Switch } from "@/components/cardboard/switch";
import { Separator } from "@/components/cardboard/separator";
import { Checkbox } from "@/components/cardboard/checkbox";
import { Textarea } from "@/components/cardboard/textarea";
import { Skeleton } from "@/components/cardboard/skeleton";
import { Progress } from "@/components/cardboard/progress";
import { Avatar, AvatarFallback } from "@/components/cardboard/avatar";
import { Toggle } from "@/components/cardboard/toggle";
import { Spinner } from "@/components/cardboard/spinner";
import { NativeSelect } from "@/components/cardboard/native-select";
import { Kbd } from "@/components/cardboard/kbd";
import { Label } from "@/components/cardboard/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/cardboard/tabs";
import { Slider } from "@/components/cardboard/slider";
import { RadioGroup, RadioGroupItem } from "@/components/cardboard/radio-group";
import { ToggleGroup, ToggleGroupItem } from "@/components/cardboard/toggle-group";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/cardboard/breadcrumb";
import {
  ButtonGroup,
  ButtonGroupText,
} from "@/components/cardboard/button-group";
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

/* The Components index. A living gallery — each card shows a real, live preview
   of the component rendered on a muted panel, then title + description below.
   Interactive previews are fine — the whole index is a client component. */

// A boxed static-window mock for components whose real thing is an overlay
// (dialog, popover, dropdown, tooltip, etc.) — shows a representative frame.
function Window({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full max-w-[13rem] rounded-lg border border-border bg-surface p-3 shadow-md">
      {children}
    </div>
  );
}

const components: {
  label: string;
  href: string;
  description: string;
  preview: React.ReactNode;
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
      <InputOTP maxLength={4} defaultValue="12">
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
    label: "Checkbox",
    href: "/cardboard/components/checkbox",
    description: "Boolean selection controls.",
    preview: (
      <div className="flex flex-col gap-2 text-body-sm">
        <Label className="flex items-center gap-2"><Checkbox /> Unchecked</Label>
        <Label className="flex items-center gap-2"><Checkbox defaultChecked /> Checked</Label>
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
    label: "Avatar",
    href: "/cardboard/components/avatar",
    description: "User images and initials.",
    preview: (
      <div className="flex items-center -space-x-2">
        <Avatar><AvatarFallback>WB</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>JS</AvatarFallback></Avatar>
        <Avatar><AvatarFallback>AK</AvatarFallback></Avatar>
      </div>
    ),
  },
  {
    label: "Toggle",
    href: "/cardboard/components/toggle",
    description: "Two-state pressable buttons.",
    preview: (
      <div className="flex items-center gap-2">
        <Toggle defaultPressed><StarIcon className="size-4" /></Toggle>
        <Toggle>Toggle</Toggle>
      </div>
    ),
  },
  {
    label: "Spinner",
    href: "/cardboard/components/spinner",
    description: "Indeterminate loading.",
    preview: <Spinner className="size-6" />,
  },
  {
    label: "Native Select",
    href: "/cardboard/components/native-select",
    description: "Styled native dropdowns.",
    preview: (
      <NativeSelect className="max-w-[13rem]" defaultValue="a">
        <option value="a">Lounge wear</option>
        <option value="b">Accessories</option>
      </NativeSelect>
    ),
  },
  {
    label: "Kbd",
    href: "/cardboard/components/kbd",
    description: "Keyboard keys and shortcuts.",
    preview: (
      <div className="flex items-center gap-1 text-body-sm">
        <Kbd>⌘</Kbd><Kbd>K</Kbd>
      </div>
    ),
  },
  {
    label: "Aspect Ratio",
    href: "/cardboard/components/aspect-ratio",
    description: "Fixed width-to-height boxes.",
    preview: (
      <div className="w-full max-w-[13rem]">
        <div className="flex aspect-video items-center justify-center rounded-lg bg-surface-secondary text-body-xs text-muted-foreground ring-1 ring-border">
          16 : 9
        </div>
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
    label: "Hover Card",
    href: "/cardboard/components/hover-card",
    description: "Hover-to-preview cards.",
    preview: (
      <Window>
        <div className="flex items-center gap-2">
          <Avatar className="size-8"><AvatarFallback>WB</AvatarFallback></Avatar>
          <div className="text-body-sm font-medium">@willbox</div>
        </div>
        <div className="mt-2 text-body-xs text-muted-foreground">Designer & engineer.</div>
      </Window>
    ),
  },
  {
    label: "Radio Group",
    href: "/cardboard/components/radio-group",
    description: "Pick one of several options.",
    preview: (
      <RadioGroup defaultValue="b" className="text-body-sm">
        <Label className="flex items-center gap-2"><RadioGroupItem value="a" /> Default</Label>
        <Label className="flex items-center gap-2"><RadioGroupItem value="b" /> Comfortable</Label>
      </RadioGroup>
    ),
  },
  {
    label: "Toggle Group",
    href: "/cardboard/components/toggle-group",
    description: "Grouped toggle buttons.",
    preview: (
      <ToggleGroup type="single" variant="outline" spacing={0} defaultValue="l">
        <ToggleGroupItem value="l">Left</ToggleGroupItem>
        <ToggleGroupItem value="c">Center</ToggleGroupItem>
        <ToggleGroupItem value="r">Right</ToggleGroupItem>
      </ToggleGroup>
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
    label: "Pagination",
    href: "/cardboard/components/pagination",
    description: "Navigate between pages of a list.",
    preview: (
      <div className="flex items-center gap-1">
        <Button size="icon" variant="ghost">1</Button>
        <Button size="icon" variant="outline">2</Button>
        <Button size="icon" variant="ghost">3</Button>
      </div>
    ),
  },
  {
    label: "Slider",
    href: "/cardboard/components/slider",
    description: "Pick a value or range on a track.",
    preview: <Slider defaultValue={[40]} className="max-w-[13rem]" />,
  },
  {
    label: "Collapsible",
    href: "/cardboard/components/collapsible",
    description: "Show and hide a region.",
    preview: (
      <div className="flex w-full max-w-[13rem] flex-col gap-2 text-body-sm">
        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-1.5 font-medium">
          Repositories <span className="text-muted-foreground">⌄</span>
        </div>
        <div className="rounded-lg border border-border px-3 py-1.5 text-muted-foreground">@radix-ui</div>
      </div>
    ),
  },
  {
    label: "Scroll Area",
    href: "/cardboard/components/scroll-area",
    description: "Custom-thumb scroll container.",
    preview: (
      <div className="relative h-24 w-full max-w-[13rem] overflow-hidden rounded-lg border border-border px-3 py-2 text-body-sm">
        <div className="flex flex-col gap-1 text-muted-foreground">
          <span>v1.2.0</span><span>v1.1.4</span><span>v1.1.0</span><span>v1.0.9</span><span>v1.0.2</span>
        </div>
        <div className="absolute top-1 right-1 h-14 w-1.5 rounded-full bg-border" />
      </div>
    ),
  },
  {
    label: "Button Group",
    href: "/cardboard/components/button-group",
    description: "Join buttons into a segmented control.",
    preview: (
      <ButtonGroup>
        <ButtonGroupText>https://</ButtonGroupText>
        <Button variant="outline" size="sm">willbox.com</Button>
      </ButtonGroup>
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
    label: "Sonner (Toast)",
    href: "/cardboard/components/sonner",
    description: "Transient notifications.",
    preview: (
      <div className="flex w-full max-w-[15rem] items-center gap-2 rounded-lg border border-border bg-surface px-3 py-2.5 shadow-md">
        <StarIcon className="size-4 shrink-0 text-foreground" />
        <div className="flex flex-col">
          <span className="text-body-sm font-medium">Event created</span>
          <span className="text-body-xs text-muted-foreground">Just now</span>
        </div>
      </div>
    ),
  },
  {
    label: "Direction",
    href: "/cardboard/components/direction",
    description: "LTR / RTL layout provider.",
    preview: (
      <div dir="rtl" className="w-full max-w-[13rem] rounded-lg border border-border p-3 text-body-sm">
        <p className="font-medium">مرحبا</p>
        <p className="text-body-xs text-muted-foreground">Right-to-left flow.</p>
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
    description: "The TNGS mark.",
    preview: <span className="font-heading text-h2 font-semibold">TNGS</span>,
  },
  {
    label: "Mobile Only",
    href: "/cardboard/components/mobile-only",
    description: "Mobile-only render wrapper.",
    preview: (
      <div className="flex h-24 w-14 flex-col rounded-[1rem] border-2 border-border bg-background p-1">
        <div className="mx-auto mt-0.5 h-1 w-6 rounded-full bg-border" />
        <div className="flex-1" />
      </div>
    ),
  },
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

        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2">
          {[...components]
            .sort((a, b) => a.label.localeCompare(b.label))
            .map(({ label, href, description, preview }) => (
              <Link key={href} href={href} className="group flex flex-col gap-4">
                <div className="flex h-44 items-center justify-center overflow-hidden rounded-xl border border-border bg-muted p-6 transition-all duration-200 group-hover:scale-[1.02] group-hover:shadow-lg">
                  {preview}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="text-body-md font-semibold text-foreground">{label}</div>
                  <div className="text-body-sm text-muted-foreground">{description}</div>
                </div>
              </Link>
            ))}
        </div>
      </div>
    </ContentCard>
  );
}
