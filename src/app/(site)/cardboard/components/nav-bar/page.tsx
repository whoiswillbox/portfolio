"use client";

import * as React from "react";
import { CubeIcon, SwatchIcon } from "@heroicons/react/24/outline";
import { BoxLogo } from "@/components/box-logo";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  NavBar as NavBarRoot,
  NavBarLogo,
  NavBarNav,
  NavBarNavItem,
} from "@cardboard";
import {
  ComponentPage,
  AudienceTabs,
  Playground,
  Variants,
  Guidelines,
  DoDont,
  Anatomy,
  ContentGuidelines,
  ApiNotes,
  PropsTable,
  States,
  WcagChecklist,
  Accessibility,
  Install,
  Changelog,
} from "../_component-page";

/* ── A self-contained mini Nav Bar for the docs ──────────────────────────── */

// Renders the REAL NavBar component (framed for the docs) so the preview is
// truthful. `logo` toggles the logo slot; children are extra trailing content.
function NavBar({
  children,
  logo = true,
  product = "cardboard",
}: {
  children?: React.ReactNode;
  logo?: boolean;
  product?: string;
}) {
  return (
    <div className="w-full overflow-hidden">
      <NavBarRoot>
        {logo && (
          <NavBarLogo href="#">
            <BoxLogo className="size-6" />
          </NavBarLogo>
        )}
        <Switcher product={product} />
        {children}
      </NavBarRoot>
    </div>
  );
}

// A single nav item rendered for the States row. Rest/active are real props;
// hover/focus are pseudo-classes React can't force, so `force` layers the
// matching utilities onto the real NavBarNavItem (merged via its className).
function StateNavItem({ active = false, force = "" }: { active?: boolean; force?: string }) {
  return (
    <NavBarNav className="ml-0">
      <NavBarNavItem href="#" active={active} className={force}>
        Docs
      </NavBarNavItem>
    </NavBarNav>
  );
}

// Trailing nav items — the real NavBarNav / NavBarNavItem, right-aligned.
function NavItems() {
  return (
    <NavBarNav>
      <NavBarNavItem href="#" active>Docs</NavBarNavItem>
      <NavBarNavItem href="#">Components</NavBarNavItem>
      <NavBarNavItem href="#">Changelog</NavBarNavItem>
    </NavBarNav>
  );
}

const PRODUCTS = [
  { id: "box", name: "Box", Icon: CubeIcon },
  { id: "cardboard", name: "Cardboard", Icon: SwatchIcon },
];

function Switcher({ product = "cardboard" }: { product?: string }) {
  const [v, setV] = React.useState(product);
  React.useEffect(() => setV(product), [product]);
  const active = PRODUCTS.find((p) => p.id === v) ?? PRODUCTS[1];
  return (
    <Select value={v} onValueChange={setV}>
      <SelectTrigger variant="ghost" size="sm" aria-label="Switch product">
        {/* Show just the name in the trigger — not the item's icon. */}
        <span>{active.name}</span>
      </SelectTrigger>
      <SelectContent className="w-48">
        {PRODUCTS.map(({ id, name, Icon }) => (
          <SelectItem key={id} value={id}>
            <Icon className="size-4" />
            {name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function NavBarDocs() {
  return (
    <ComponentPage
      title="Nav Bar"
      status="stable"
      version="1.0"
      description="The top application bar: a logo that links home, plus a product switcher for moving between products. A thin, fixed strip above the sidebar (desktop only — mobile uses the mobile nav)."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "product", label: "product", type: "select", options: ["box", "cardboard"], default: "cardboard" },
              { prop: "logo", label: "logo", type: "boolean", default: true },
              { prop: "navItems", label: "nav items", type: "boolean", default: true },
            ]}
            render={(v) => (
              <NavBar logo={Boolean(v.logo)} product={String(v.product)}>
                {v.navItems ? <NavItems /> : null}
              </NavBar>
            )}
          />
        }
        design={
          <>
            <Anatomy
              parts={[
                { n: 1, part: "Bar — the fixed strip; sits above the sidebar.", tokens: "NavBar · h-14 · border-b border-divider" },
                { n: 2, part: "Logo — the product mark; links home.", tokens: "NavBarLogo · size-6" },
                { n: 3, part: "Product switcher — a ghost Select to change product.", tokens: "SelectTrigger variant=ghost · size-sm" },
                { n: 4, part: "Nav items — optional top-level links, right-aligned; the current one is active.", tokens: "NavBarNav · NavBarNavItem[active]" },
              ]}
            >
              <NavBar><NavItems /></NavBar>
            </Anatomy>
            <Guidelines
              use={[
                "Giving an app a persistent logo + a way to move between top-level products.",
                "A single row of global navigation / identity that stays put while content scrolls.",
                "Desktop / wide layouts — pair with the mobile nav on small screens.",
              ]}
              avoid={[
                "Page-level tabs or section navigation — use Tabs or a Navigation Menu.",
                "Cramming in dense toolbars of actions, search, and menus — keep it to identity, product switch, and a few top-level links.",
                "Mobile — it's hidden under sm; use the Mobile Nav there.",
              ]}
            />
            <ContentGuidelines
              rules={[
                "Lead with the logo + switcher; add only a few top-level nav items after.",
                "The logo always links to the product home.",
                "Nav item and product names are short (one or two words); mark the current one.",
              ]}
            />
            <DoDont
              dos={[
                {
                  caption: "Logo, switcher, and a few top-level nav items.",
                  example: <NavBar><NavItems /></NavBar>,
                },
              ]}
              donts={[
                {
                  caption: "Don't cram the bar with a dense toolbar of controls.",
                  example: (
                    <NavBar>
                      <div className="ml-auto flex items-center gap-2">
                        <div className="h-7 w-16 rounded-md bg-muted" />
                        <div className="h-7 w-16 rounded-md bg-muted" />
                        <div className="h-7 w-20 rounded-md bg-muted" />
                        <div className="size-7 rounded-full bg-muted" />
                      </div>
                    </NavBar>
                  ),
                },
              ]}
            />
            <States
              title="Nav item states"
              states={[
                { name: "Rest", node: <StateNavItem />, tokens: "text-tertiary" },
                { name: "Hover", node: <StateNavItem force="text-secondary" />, tokens: "hover: text-secondary" },
                { name: "Active", node: <StateNavItem active />, tokens: "data-active: text-foreground · font-medium" },
                { name: "Focus", node: <StateNavItem force="ring-2 ring-border-focus" />, tokens: "focus-visible: ring-2 ring-border-focus" },
              ]}
            />
            <WcagChecklist
              rows={[
                {
                  criterion: "Text contrast (1.4.3)",
                  status: "pass",
                  label: "AA",
                  detail: "Rest nav item (text-tertiary) ≈ 4.6:1 on the bar background (≥ 4.5); hover (text-secondary) ≈ 7.5:1; active (text-foreground) ≈ 16:1.",
                },
                {
                  criterion: "Landmark (1.3.1)",
                  status: "pass",
                  label: "AA",
                  detail: "Rendered as a <header> banner landmark so AT can jump to it.",
                },
                {
                  criterion: "Focus visible (2.4.7)",
                  status: "pass",
                  label: "AA",
                  detail: "Logo link and switcher show a visible focus ring on keyboard focus.",
                },
                {
                  criterion: "Name, role, value (4.1.2)",
                  status: "pass",
                  label: "AA",
                  detail: "Logo link has an aria-label; the switcher is a labeled combobox.",
                },
                {
                  criterion: "Non-text contrast (1.4.11)",
                  status: "pass",
                  label: "AA",
                  detail: "The bottom divider and mark meet ≥ 3:1 against the background.",
                },
              ]}
            />
          </>
        }
        dev={
          <>
            <Install code={`import { NavBar, NavBarLogo, NavBarNav, NavBarNavItem } from "@cardboard";
import { BoxLogo } from "@/components/box-logo";`} />
            <Variants
              variants={[
                {
                  label: "Default",
                  caption: "The assembled bar — logo, product switcher, and top-level nav items.",
                  preview: <NavBar><NavItems /></NavBar>,
                  code: `import { NavBar, NavBarLogo, NavBarNav, NavBarNavItem,
  Select, SelectTrigger, SelectContent, SelectItem } from "@cardboard";
import { BoxLogo } from "@/components/box-logo";

function AppNavBar() {
  const [product, setProduct] = useState("cardboard");
  return (
    <NavBar className="max-sm:hidden">
      {/* Logo → home */}
      <NavBarLogo href="/" aria-label="Home">
        <BoxLogo className="size-6" />
      </NavBarLogo>

      {/* Product switcher — the Select ghost variant (see Select → No border) */}
      <Select value={product} onValueChange={setProduct}>
        <SelectTrigger variant="ghost" size="sm" aria-label="Switch product">
          <span>{product === "box" ? "Box" : "Cardboard"}</span>
        </SelectTrigger>
        <SelectContent className="w-48">
          <SelectItem value="box">Box</SelectItem>
          <SelectItem value="cardboard">Cardboard</SelectItem>
        </SelectContent>
      </Select>

      {/* Optional top-level nav items (right-aligned) */}
      <NavBarNav>
        <NavBarNavItem href="/docs" active>Docs</NavBarNavItem>
        <NavBarNavItem href="/components">Components</NavBarNavItem>
      </NavBarNav>
    </NavBar>
  );
}`,
                  styles: `/* NavBar — a thin, fixed strip above the sidebar. */
[data-slot="nav-bar"] {
  display: flex;
  height: var(--space-1600);          /* h-14 (56px) */
  align-items: center;
  gap: 0;                             /* spacing comes from the switcher's padding */
  padding-inline: var(--space-400);   /* 16px */
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border-divider);
}

/* Active nav item. */
[data-slot="nav-bar-nav-item"][data-active] {
  color: var(--color-foreground);
  font-weight: var(--font-weight-medium);
}`,
                },
              ]}
            />
            <ApiNotes
              notes={[
                "NavBar is the <header> strip; compose NavBarLogo (home link), a switcher, and an optional NavBarNav of NavBarNavItems inside it.",
                "NavBarLogo defaults href to \"/\" and aria-label to \"Home\"; pass your own for other products.",
                "NavBarNav is right-aligned (ml-auto); NavBarNavItem takes an `active` prop for the current section.",
                "Desktop only — add max-sm:hidden; the mobile nav takes over there.",
                "Sits ABOVE the SidebarProvider so the provider's row layout / height is unchanged.",
                "The product switcher is a ghost-variant Select (see Select → No border).",
              ]}
            />
            <PropsTable
              groups={[
                {
                  interfaceName: "NavBar",
                  rows: [
                    { name: "children", type: "ReactNode", desc: "The bar's contents — logo, switcher, and optional nav." },
                    { name: "…header", type: "HTMLHeaderProps", desc: "Extends <header> (className, etc.). Add max-sm:hidden for desktop-only." },
                  ],
                },
                {
                  interfaceName: "NavBarNavItem",
                  rows: [
                    { name: "active?", type: "boolean", default: "false", desc: "Marks the current section (foreground + medium weight)." },
                    { name: "href", type: "string", desc: "The item's route (extends next/link)." },
                  ],
                },
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["Tab"], does: "Moves through the logo link and the switcher." },
                { keys: ["↵"], does: "Activates the logo link / opens the switcher." },
              ]}
              aria={[
                { attr: "banner", on: "header", purpose: "The <header> is the page's banner landmark." },
                { attr: "aria-label", on: "Logo link", purpose: "Names the otherwise icon-only home link." },
              ]}
              labeling={[
                "Give the logo link an aria-label (e.g. the product name) since it's icon-only.",
                "The switcher carries its own aria-label (\"Switch product\").",
              ]}
              notes={[
                "Rendered as a single <header> banner landmark per page.",
              ]}
            />
            <Changelog
              entries={[
                { version: "1.0", changes: ["Initial release — NavBar with NavBarLogo, product switcher, and NavBarNav items."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
