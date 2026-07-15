"use client";

import * as React from "react";
import { BoxLogo } from "@/components/box-logo";
import { ProductSwitcher } from "@/components/product-switcher";
import {
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
  Slots,
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
// The product switcher is the REAL <ProductSwitcher /> — the same component the
// app shell mounts — so the demo can't drift from production (icons + taglines,
// active state, behavior all come from the real thing).
function NavBar({
  children,
  logo = true,
}: {
  children?: React.ReactNode;
  logo?: boolean;
}) {
  return (
    <div className="w-full overflow-hidden">
      <NavBarRoot>
        {logo && (
          <NavBarLogo href="#">
            <BoxLogo className="size-6" />
          </NavBarLogo>
        )}
        <ProductSwitcher demo />
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
      <NavBarNavItem
        disclosure
        items={[
          { label: "Overview", href: "#", active: true },
          { label: "Foundations", href: "#" },
          { label: "Components", href: "#", badge: { label: "NEW", variant: "warning" } },
        ]}
      >
        Components
      </NavBarNavItem>
      <NavBarNavItem href="#">Changelog</NavBarNavItem>
    </NavBarNav>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function NavBarDocs() {
  return (
    <ComponentPage
      title="Nav Bar"
      status="stable"
      version="1.2"
      description="The top application bar: a logo that links home, plus a product switcher for moving between products. A thin, fixed strip above the sidebar (desktop only — mobile uses the mobile nav)."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "logo", label: "logo", type: "boolean", default: true },
              { prop: "navItems", label: "nav items", type: "boolean", default: true },
            ]}
            render={(v) => (
              <NavBar logo={Boolean(v.logo)}>
                {v.navItems ? <NavItems /> : null}
              </NavBar>
            )}
          />
        }
        design={
          <>
            <Anatomy
              parts={[
                { n: 1, part: "Bar — the fixed strip; sits above the SidebarProvider so the provider's row layout / height is unchanged.", tokens: "NavBar · h-14 · border-b border-divider" },
                { n: 2, part: "Logo — the product mark; links home.", tokens: "NavBarLogo · size-6" },
                { n: 3, part: "Product switcher — the ProductSwitcher (a ghost Select); each item shows an icon + name + tagline.", tokens: "ProductSwitcher · SelectTrigger variant=ghost" },
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
                  code: `import { NavBar, NavBarLogo, NavBarNav, NavBarNavItem } from "@cardboard";
import { BoxLogo } from "@/components/box-logo";
import { ProductSwitcher } from "@/components/product-switcher";

function AppNavBar() {
  return (
    <NavBar className="max-sm:hidden">
      {/* Logo → home */}
      <NavBarLogo href="/" aria-label="Home">
        <BoxLogo className="size-6" />
      </NavBarLogo>

      {/* Product switcher — the ghost-variant Select, with icon + tagline
          per product. Self-contained (reads the route for the active one). */}
      <ProductSwitcher />

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
                    { name: "href", type: "string", desc: "The item's route (extends next/link). Not needed when disclosure is set." },
                    { name: "disclosure?", type: "boolean", default: "false", desc: "Render as a menu trigger (a <button> with a rotating chevron) that opens a dropdown of items instead of a link. Mirrors the Box sidebar's expandable items." },
                    { name: "items?", type: "NavBarNavMenuItem[]", desc: "The child links shown in the disclosure dropdown. Each is { label, href, active?, badge? } — badge is an optional trailing status tag { label, variant? } (e.g. a coming-soon 'PACKAGING' Badge)." },
                  ],
                },
              ]}
            />
            <Slots
              intro="The Nav Bar is a layout shell — compose its parts as children. It owns no fixed switcher; drop in a ProductSwitcher (a Select) as a child."
              slots={[
                {
                  name: "NavBarLogo",
                  type: "ReactNode",
                  desc: "The product mark, wrapped in a home link. Give it an accessible label since it's typically icon-only.",
                },
                {
                  name: "ProductSwitcher",
                  type: "ReactNode",
                  optional: true,
                  desc: "The product switcher — a ghost-variant Select with an icon, name, and tagline per product. Any inline control can go here; it's just a child, not a fixed slot.",
                },
                {
                  name: "NavBarNav",
                  type: "NavBarNavItem[]",
                  optional: true,
                  desc: "Optional top-level nav, right-aligned (ml-auto). Holds NavBarNavItem links; mark the current section with `active`.",
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
                { version: "1.2", changes: ["Disclosure items now accept an optional badge — a trailing status tag (e.g. a coming-soon 'PACKAGING' Badge) on a child row."] },
                { version: "1.1", changes: ["Added the disclosure prop to NavBarNavItem — a menu-trigger item that opens a dropdown of child items (via items), mirroring the Box sidebar's expandable items."] },
                { version: "1.0", changes: ["Initial release — NavBar with NavBarLogo, product switcher, and NavBarNav items."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
