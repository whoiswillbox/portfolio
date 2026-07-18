"use client";

import * as React from "react";
import { BoxLogo } from "@/components/box-logo";
import { ProductSwitcher } from "@/components/product-switcher";
import {
  NavBar as NavBarRoot,
  NavBarLogo,
  NavBarNav,
  NavBarNavItem,
  NavBarPanel,
  NavBarMenuProvider,
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
// app shell mounts — so the demo can't drift from production (disclosure
// behavior, active state all come from the real thing). In `demo` mode it
// renders an inert trigger-shaped label (no NavBarMenuProvider navigation).
function NavBar({
  children,
  logo = true,
  defaultOpenKey = null,
}: {
  children?: React.ReactNode;
  logo?: boolean;
  /** Show a disclosure panel already expanded (e.g. for a static Variant
      preview) — see NavBarMenuProvider. */
  defaultOpenKey?: string | null;
}) {
  return (
    <div className="w-full overflow-hidden">
      {/* isolated: this whole NavBar is always a doc-page PREVIEW instance —
          without it, a defaultOpenKey-seeded demo (or any click here) would
          scroll-lock the ENTIRE real page via NavBarMenuProvider's
          window-level listeners. */}
      <NavBarMenuProvider defaultOpenKey={defaultOpenKey} isolated>
        {/* border-b-0: matches the real app shell, which strips NavBar's
            default bottom border (see app-shell.tsx) — kept truthful here. */}
        <NavBarRoot className="border-b-0">
          {logo && (
            <NavBarLogo href="#">
              <BoxLogo className="size-6" />
            </NavBarLogo>
          )}
          <ProductSwitcher demo demoLabel="Product" />
          {children}
        </NavBarRoot>
        {/* Disclosure items expand this full-width panel below the bar.
            isolated: this is a doc-page PREVIEW instance, not the real
            page-level nav — without it, opening a disclosure here would also
            slide the real Cardboard sidebar (--navpanel-h is inherited from
            the shared page root). */}
        <NavBarPanel isolated />
      </NavBarMenuProvider>
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

// Trailing nav items — the real NavBarNav / NavBarNavItem, right-aligned. 3
// top-level items — 2 plain links + 1 disclosure — with generic labels
// ("Item", "2nd level item", "3rd level item") so this reads as a
// shape/structure demo rather than real-looking copy someone might mistake
// for actual product content. Opening the disclosure always shows just its
// level-2 tabs — level-3 items only appear after an explicit tab click (no
// auto-select).
function NavItems({ position }: { position?: "left" | "right" }) {
  return (
    <NavBarNav position={position}>
      <NavBarNavItem href="#item-1" active>Item</NavBarNavItem>
      <NavBarNavItem href="#item-2">Item</NavBarNavItem>
      <NavBarNavItem
        disclosure
        menuKey="item-3"
        items={[
          { label: "2nd level item", items: [
            { label: "3rd level item", href: "#3rd-level-item-1" },
            { label: "3rd level item", href: "#3rd-level-item-2" },
          ]},
          { label: "2nd level item", items: [
            { label: "3rd level item", href: "#3rd-level-item-3" },
          ]},
        ]}
      >
        Item
      </NavBarNavItem>
    </NavBarNav>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function NavBarDocs() {
  return (
    <ComponentPage
      title="Nav Bar"
      status="stable"
      version="1.1"
      description="The top application bar: a logo that links home, plus a product switcher for moving between products. A thin, fixed strip above the sidebar (desktop only — mobile uses the mobile nav)."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "logo", label: "logo", type: "boolean", default: true },
              { prop: "navItems", label: "nav items", type: "boolean", default: true },
              { prop: "position", label: "nav items position", type: "select", options: ["right", "left"], default: "right" },
            ]}
            render={(v) => (
              <NavBar logo={Boolean(v.logo)}>
                {v.navItems ? <NavItems position={v.position as "left" | "right"} /> : null}
              </NavBar>
            )}
          />
        }
        design={
          <>
            <Anatomy
              parts={[
                { n: 1, part: "Bar — the fixed strip; sits above the SidebarProvider so the provider's row layout / height is unchanged. Bordered by default; the app shell strips it (border-b-0), as shown below.", tokens: "NavBar · h-14 · border-b border-divider" },
                { n: 2, part: "Logo — the product mark; links home.", tokens: "NavBarLogo · size-6" },
                { n: 3, part: "Product switcher — the ProductSwitcher, a disclosure nav item: clicking the current product name opens the full-width panel with the product(s) you can switch to.", tokens: "ProductSwitcher · NavBarNavItem[disclosure]" },
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
                { caption: "Logo, switcher, and a few top-level nav items." },
              ]}
              donts={[
                { caption: "Don't cram the bar with a dense toolbar of controls." },
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
            <Install code={`import { NavBar, NavBarLogo, NavBarNav, NavBarNavItem } from "@cardboard";`} />
            <Variants
              variants={[
                {
                  label: "Default",
                  caption: "The assembled bar — logo, product switcher, and top-level nav items.",
                  preview: <NavBar><NavItems /></NavBar>,
                  code: `import { NavBar, NavBarLogo, NavBarNav, NavBarNavItem } from "@cardboard";
import { ProductSwitcher } from "@/components/product-switcher";

function AppNavBar() {
  return (
    <NavBar className="max-sm:hidden">
      {/* Logo → home */}
      <NavBarLogo href="/" aria-label="Home">
        <YourLogo className="size-6" />
      </NavBarLogo>

      {/* Product switcher — a disclosure nav item; opening it reveals the
          product(s) to switch to. Self-contained (reads the route for the
          active one). */}
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
                  interfaceName: "NavBarNav",
                  rows: [
                    { name: "position?", type: "\"left\" | \"right\"", default: "\"right\"", desc: "\"right\" sits after the logo/switcher and centers in the bar on wider viewports (falls back to left-aligned-after-content if centering would overlap the leading content). \"left\" sits immediately after the logo/switcher, left-aligned, never centers." },
                    { name: "children", type: "ReactNode", desc: "NavBarNavItem links." },
                    { name: "…nav", type: "HTMLElementProps", desc: "Extends <nav> (className, etc.)." },
                  ],
                },
                {
                  interfaceName: "NavBarNavItem",
                  rows: [
                    { name: "active?", type: "boolean", default: "false", desc: "Marks the current section (foreground + medium weight)." },
                    { name: "href", type: "string", desc: "The item's route (extends next/link). Not needed when disclosure is set." },
                    { name: "disclosure?", type: "boolean", default: "false", desc: "Render as a trigger (a <button> with a rotating chevron) that expands NavBarPanel — a full-width strip below the bar that pushes page content down. Requires a NavBarMenuProvider ancestor. At most one disclosure is open at a time." },
                    { name: "menuKey?", type: "string", desc: "Stable identifier for this disclosure's panel (defaults to the children text). Set it explicitly when children aren't a plain string." },
                    { name: "items?", type: "NavBarNavMenuItem[] | NavBarNavMenuGroup[]", desc: "The child links shown in the panel — a flat list, or grouped categories ({ label?, items }). Each item is { label, href, active? }." },
                  ],
                },
                {
                  interfaceName: "NavBarMenuProvider",
                  rows: [
                    { name: "children", type: "ReactNode", desc: "Wrap the NavBar AND the NavBarPanel. Coordinates which disclosure menu is open (at most one) and closes on Escape." },
                    { name: "defaultOpenKey?", type: "string | null", default: "null", desc: "Seed a disclosure open on mount — e.g. for a static preview that wants to show the panel already expanded. Not a controlled `open` prop, just an initial value; the usual click/Escape/outside-click behavior still applies after mount." },
                    { name: "isolated?", type: "boolean", default: "false", desc: "Skip the global window-level scroll-lock (wheel/touchmove preventDefault) while a menu is open. Set this on any provider that ISN'T the real page-level nav — the listener is on window, not scoped to the provider's own box, so an unisolated preview (especially one seeded open via defaultOpenKey) would lock scroll on the entire real page." },
                  ],
                },
                {
                  interfaceName: "NavBarPanel",
                  rows: [
                    { name: "isolated?", type: "boolean", default: "false", desc: "Skip publishing --navpanel-h to document.documentElement. Set this on any instance that ISN'T the real page-level nav (e.g. a doc-page preview) — otherwise its open/close state would reach past its own sandboxed preview box and move real fixed/floating page elements (like the Cardboard sidebar) that read the var." },
                    { name: "…div", type: "HTMLDivProps", desc: "The full-width disclosure panel; render as a sibling right after <NavBar>, inside the same provider, so it pushes page content down. Extends <div> (className, etc.)." },
                  ],
                },
              ]}
            />
            <Slots
              intro="The Nav Bar is a layout shell — compose its parts as children. It owns no fixed switcher; drop in a ProductSwitcher (a disclosure nav item) as a child."
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
                  desc: "The product switcher — a disclosure nav item showing the current product name; opening it reveals the product(s) you can switch to in the full-width panel. Any inline control can go here; it's just a child, not a fixed slot.",
                },
                {
                  name: "NavBarNav",
                  type: "NavBarNavItem[]",
                  optional: true,
                  desc: "Optional top-level nav. Holds NavBarNavItem links; mark the current section with `active`. position=\"right\" (default) sits after the logo/switcher and centers in the bar; position=\"left\" sits left-aligned right after the logo/switcher.",
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
                { version: "1.1", changes: [
                  "Disclosure nav items: NavBarNavItem accepts disclosure + menuKey + items, opening a full-width NavBarPanel BELOW the bar that pushes page content down (not a floating dropdown). Requires wrapping the bar + panel in NavBarMenuProvider; at most one menu is open at a time (Esc / outside click closes). items accepts a flat list or grouped categories (NavBarNavMenuGroup[]) with labelled tabs.",
                  "Opening a disclosure always shows just its level-2 category tabs, even when the current route lives under one of them — level-3 items only appear after an explicit tab click (no auto-select jump).",
                  "Added isolated to both NavBarMenuProvider and NavBarPanel — set on any instance that isn't the real page-level nav (e.g. a doc preview) so its scroll-lock and --navpanel-h writes stay scoped to itself instead of leaking onto the real page.",
                  "Added NavBarMenuProvider's defaultOpenKey — seeds a disclosure open on mount, for static previews that want to show the panel already expanded.",
                  "Added NavBarNav's position prop (\"left\" | \"right\", default \"right\") — \"right\" centers the nav in the bar (falling back to left-aligned-after-content when centering would overlap the logo/switcher in a narrow bar); \"left\" sits immediately after the logo/switcher, left-aligned, never centering.",
                  "Product switcher moved from a Select dropdown to a disclosure nav item (ProductSwitcher), composed as a plain child rather than a fixed NavBar slot.",
                ] },
                { version: "1.0", changes: ["Initial release — NavBar with NavBarLogo, product switcher, and NavBarNav items."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
