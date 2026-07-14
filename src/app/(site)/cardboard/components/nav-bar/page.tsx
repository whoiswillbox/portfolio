"use client";

import * as React from "react";
import { CubeIcon, SwatchIcon } from "@heroicons/react/24/outline";
import { BoxLogo } from "@/components/box-logo";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
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
  Related,
  ApiNotes,
  WcagChecklist,
  Accessibility,
  Install,
  Changelog,
} from "../_component-page";

/* ── A self-contained mini Nav Bar for the docs ──────────────────────────── */

function NavBar({
  children,
  brand = true,
  product = "cardboard",
}: {
  children?: React.ReactNode;
  brand?: boolean;
  product?: string;
}) {
  return (
    <div className="w-full max-w-md overflow-hidden rounded-lg border border-border bg-background">
      <header className="flex h-14 items-center gap-0 border-b border-border/60 px-4">
        {/* Brand mark → home — the real BoxLogo, as in the app shell. */}
        {brand && (
          <a
            href="#"
            onClick={(e) => e.preventDefault()}
            aria-label="Home"
            className="flex items-center rounded-md text-foreground outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
          >
            <BoxLogo className="size-6" />
          </a>
        )}
        {/* Product switcher (ghost Select) */}
        <Switcher product={product} />
        {children}
      </header>
    </div>
  );
}

// Trailing nav items — a small set of top-level links aligned to the right.
function NavItems() {
  const items = ["Docs", "Components", "Changelog"];
  return (
    <nav className="ml-auto flex items-center gap-1">
      {items.map((label, i) => (
        <a
          key={label}
          href="#"
          onClick={(e) => e.preventDefault()}
          className={`rounded-md px-2.5 py-1.5 text-body-sm transition-colors hover:bg-surface-secondary ${
            i === 0 ? "font-medium text-foreground" : "text-tertiary hover:text-foreground"
          }`}
        >
          {label}
        </a>
      ))}
    </nav>
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
      description="The top application bar: a brand mark that links home, plus a product switcher for moving between products. A thin, fixed strip above the sidebar (desktop only — mobile uses the mobile nav)."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "product", label: "product", type: "select", options: ["box", "cardboard"], default: "cardboard" },
              { prop: "brand", label: "brand mark", type: "boolean", default: true },
              { prop: "navItems", label: "nav items", type: "boolean", default: false },
            ]}
            render={(v) => (
              <NavBar brand={Boolean(v.brand)} product={String(v.product)}>
                {v.navItems ? <NavItems /> : null}
              </NavBar>
            )}
          />
        }
        design={
          <>
            <Anatomy
              parts={[
                { n: 1, part: "Bar — the fixed strip; sits above the sidebar.", tokens: "h-14 · bg-background · border-b border-border/60" },
                { n: 2, part: "Brand mark — links home; the product's logo.", tokens: "size-6 · rounded-md" },
                { n: 3, part: "Product switcher — a ghost Select to change product.", tokens: "SelectTrigger variant=ghost · size-sm" },
              ]}
            >
              <NavBar />
            </Anatomy>
            <Guidelines
              use={[
                "Giving an app a persistent brand + a way to move between top-level products.",
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
                "Lead with the brand mark + switcher; add only a few top-level nav items after.",
                "The brand mark always links to the product home.",
                "Nav item and product names are short (one or two words); mark the current one.",
              ]}
            />
            <DoDont
              dos={[
                {
                  caption: "Brand mark, switcher, and a few top-level nav items.",
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
            <WcagChecklist
              rows={[
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
                  detail: "Brand link and switcher show a visible focus ring on keyboard focus.",
                },
                {
                  criterion: "Name, role, value (4.1.2)",
                  status: "pass",
                  label: "AA",
                  detail: "Brand link has an aria-label; the switcher is a labeled combobox.",
                },
                {
                  criterion: "Non-text contrast (1.4.11)",
                  status: "pass",
                  label: "AA",
                  detail: "The bottom divider and mark meet ≥ 3:1 against the background.",
                },
              ]}
            />
            <Related
              items={[
                { href: "/cardboard/components/select", when: "The ghost Select that powers the switcher." },
                { href: "/cardboard/components/sidebar", when: "The primary navigation below the bar." },
                { href: "/cardboard/components/mobile-only", when: "The mobile nav that replaces the bar under sm." },
              ]}
            />
          </>
        }
        dev={
          <>
            <Install code={`import { BoxLogo } from "@/components/box-logo";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@cardboard";`} />
            <div className="mb-12 flex flex-col gap-4">
              <h2 className="text-h3">Composition</h2>
              <p className="text-body-sm text-muted-foreground">
                The Nav Bar is a composition, not a single exported component: a{" "}
                <span className="font-mono text-body-xs">&lt;header&gt;</span> holding the
                brand mark (a home link) and the product switcher. It lives in the app
                shell, above the sidebar.
              </p>
            </div>
            <Variants
              variants={[
                {
                  label: "Default",
                  caption: "The assembled bar — brand mark, product switcher, and top-level nav items.",
                  preview: <NavBar><NavItems /></NavBar>,
                  code: `import Link from "next/link";
import { useState } from "react";
import { BoxLogo } from "@/components/box-logo";
import { Select, SelectTrigger, SelectContent, SelectItem } from "@cardboard";

function NavBar() {
  const [product, setProduct] = useState("cardboard");
  return (
    <header className="flex h-14 shrink-0 items-center gap-0 border-b border-border/60 bg-background px-4 max-sm:hidden">
      {/* Brand mark → home */}
      <Link href="/" aria-label="Home" className="flex items-center rounded-md focus-visible:ring-2 focus-visible:ring-border-focus">
        <BoxLogo className="size-6" />
      </Link>

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

      {/* Optional top-level nav items */}
      <nav className="ml-auto flex items-center gap-1">
        <Link href="/docs" className="rounded-md px-2.5 py-1.5 text-body-sm font-medium">Docs</Link>
        <Link href="/components" className="rounded-md px-2.5 py-1.5 text-body-sm text-tertiary hover:text-foreground">Components</Link>
      </nav>
    </header>
  );
}`,
                  styles: `/* The bar — a thin, fixed strip above the sidebar. */
.nav-bar {
  display: flex;
  height: var(--space-1600);          /* h-14 (56px) */
  align-items: center;
  gap: 0;                             /* spacing comes from the switcher's padding */
  padding-inline: var(--space-400);   /* 16px */
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
}`,
                },
              ]}
            />
            <ApiNotes
              notes={[
                "It's a layout composition — assemble it from a <header>, a brand link, and a ghost-variant Select as the switcher.",
                "Bar styles: h-14, bg-background, border-b border-border/60, px-4, gap-3, items-center.",
                "Desktop only — hide under sm (max-sm:hidden); the mobile nav takes over there.",
                "Sits ABOVE the SidebarProvider so the provider's row layout / height is unchanged.",
                "Hidden on the landing splash.",
                "The product switcher is a ghost-variant Select (see Select → No border).",
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["Tab"], does: "Moves through the brand link and the switcher." },
                { keys: ["↵"], does: "Activates the brand link / opens the switcher." },
              ]}
              aria={[
                { attr: "banner", on: "header", purpose: "The <header> is the page's banner landmark." },
                { attr: "aria-label", on: "Brand link", purpose: "Names the otherwise icon-only home link." },
              ]}
              labeling={[
                "Give the brand link an aria-label (e.g. the product name) since it's icon-only.",
                "The switcher carries its own aria-label (\"Switch product\").",
              ]}
              notes={[
                "Rendered as a single <header> banner landmark per page.",
              ]}
            />
            <Changelog
              entries={[
                { version: "1.0", changes: ["Initial release — brand mark + product switcher strip above the sidebar."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
