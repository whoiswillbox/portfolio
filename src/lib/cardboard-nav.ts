/* Single source of truth for Cardboard's navigation: the three sections
   (Foundations · Components · Utilities), their items, and the resolver that
   maps a pathname to its section. Shared by CardboardNavItems (top bar) and
   CardboardSidebar (filtered left list) so they can't drift.

   Routing: Foundations → /cardboard/foundations[/slug]; Components AND Utilities
   → /cardboard/components/<slug> (same base). The two are told apart by which
   list a slug appears in, so the top-nav active state + the sidebar filter agree. */

// "landing" = the bare /cardboard Getting Started page: no section is active.
export type Section = "landing" | "foundations" | "components" | "utilities"

export type Status = "stable" | "beta" | "experimental" | "deprecated"
export type Leaf = { title: string; slug: string; status?: Status }
export type Group = { title: string; children: Leaf[] }
export type Entry = Leaf | Group

export const isGroup = (e: Entry): e is Group => "children" in e
const leaf = (title: string, slug: string, status?: Status): Leaf => ({ title, slug, status })

export const FOUNDATIONS_BASE = "/cardboard/foundations"
export const COMPONENTS_BASE = "/cardboard/components"

export const foundations: Leaf[] = [
  { title: "Overview", slug: "" },
  { title: "Colors", slug: "colors" },
  { title: "Typography", slug: "typography" },
  { title: "Spacing", slug: "spacing" },
  { title: "Radius", slug: "radius" },
  { title: "Elevation", slug: "elevation" },
  { title: "Iconography", slug: "iconography" },
]

// Flat, alphabetical component list. A leaf is a single doc page; a group is a
// collapsible parent whose children are related variants. Sorted by title.
export const components: Entry[] = [
  leaf("Accordion", "accordion"),
  leaf("Alert", "alert"),
  leaf("Badge", "badge"),
  leaf("Breadcrumb", "breadcrumb"),
  leaf("Button", "button"),
  {
    title: "Card",
    children: [
      leaf("Card", "card"),
      leaf("Contact Card", "contact-card"),
      leaf("Content Card", "content-card"),
    ],
  },
  {
    title: "Dialog",
    children: [
      leaf("Dialog", "dialog"),
      leaf("Alert Dialog", "alert-dialog"),
      leaf("Drawer", "drawer"),
      leaf("Sheet", "sheet"),
    ],
  },
  leaf("Empty", "empty"),
  leaf("Field", "field"),
  leaf("Image Lightbox", "image-lightbox"),
  {
    title: "Input",
    children: [
      leaf("Input", "input"),
      leaf("Input Group", "input-group"),
      leaf("Input OTP", "input-otp"),
    ],
  },
  leaf("Item", "item"),
  {
    title: "Menu",
    children: [
      leaf("Command", "command"),
      leaf("Context Menu", "context-menu"),
      leaf("Dropdown Menu", "dropdown-menu"),
      leaf("Menubar", "menubar"),
      leaf("Navigation Menu", "navigation-menu"),
    ],
  },
  leaf("Nav Bar", "nav-bar", "stable"),
  leaf("Popover", "popover"),
  leaf("Progress", "progress"),
  leaf("Resizable", "resizable"),
  leaf("Segmented Control", "segmented-control", "stable"),
  {
    title: "Select",
    children: [
      leaf("Select", "select", "stable"),
      leaf("Combobox", "combobox"),
    ],
  },
  leaf("Separator", "separator"),
  leaf("Sidebar", "sidebar"),
  leaf("Skeleton", "skeleton"),
  leaf("Switch", "switch"),
  leaf("Table", "table"),
  leaf("Tabs", "tabs"),
  leaf("Textarea", "textarea"),
  leaf("Tooltip", "tooltip"),
  // Box AI chat surfaces. Starts with Thinking Steps; the other chat components
  // (bubbles, input, suggestions, …) will land here as they're extracted.
  {
    title: "Chat",
    children: [
      leaf("Thinking Steps", "thinking-steps", "experimental"),
    ],
  },
].sort((a, b) => a.title.localeCompare(b.title))

// Utilities — helpers, wrappers, and assets that aren't interactive UI.
export const utilities: Leaf[] = [
  leaf("Copy Token", "copy-token"),
  leaf("Kbd", "kbd"),
  leaf("Logo", "logo"),
  leaf("Mobile Only", "mobile-only"),
].sort((a, b) => a.title.localeCompare(b.title))

// Flatten a component entry list to the set of slugs it owns (groups included).
const componentSlugs = new Set(
  components.flatMap((e) => (isGroup(e) ? e.children.map((c) => c.slug) : [e.slug]))
)
const utilitySlugs = new Set(utilities.map((u) => u.slug))

// Landing href for each section's top-nav item.
export const FOUNDATIONS_HREF = FOUNDATIONS_BASE
export const COMPONENTS_HREF = COMPONENTS_BASE // the gallery overview
export const UTILITIES_HREF = `${COMPONENTS_BASE}/${utilities[0].slug}`

/** Resolve which section a pathname belongs to. Foundations is a clean prefix;
    Components vs Utilities share /cardboard/components/<slug>, so the trailing
    slug is matched against the utilities set first (else it's a component). */
export function cardboardSection(pathname: string): Section {
  // Bare /cardboard is the Getting Started landing — no section is active.
  if (pathname === "/cardboard") return "landing"
  if (pathname.startsWith(FOUNDATIONS_BASE)) return "foundations"
  if (pathname.startsWith(COMPONENTS_BASE)) {
    const slug = pathname.slice(COMPONENTS_BASE.length + 1)
    if (utilitySlugs.has(slug)) return "utilities"
    return "components"
  }
  return "landing"
}

export { componentSlugs, utilitySlugs }
