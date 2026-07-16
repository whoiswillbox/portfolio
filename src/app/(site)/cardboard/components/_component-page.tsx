"use client";

import * as React from "react";
import Link from "next/link";
import {
  SunIcon,
  MoonIcon,
  CheckIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import {
  Kbd,
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Switch,
  Input,
} from "@cardboard";
import { getComponent, ComponentCard } from "./component-registry";
import { cn } from "@/lib/utils";

/* Shared scaffold for the per-component reference pages — keeps the back link,
   header, and spacing identical across every component doc. The content sits in
   a scroll container next to a sticky "On this page" table of contents. */
export function ComponentPage({
  title,
  description,
  status,
  version,
  children,
}: {
  title: string;
  description: string;
  /** Maturity of the component; shows a colored badge next to the title. */
  status?: "stable" | "beta" | "experimental" | "deprecated";
  /** Version the component was added / last changed, e.g. "1.0". */
  version?: string;
  children: React.ReactNode;
}) {
  const contentRef = React.useRef<HTMLDivElement>(null);
  return (
    <ContentCard className="h-full overflow-auto">
      {/* Content is centered (flex-1 + max-w-3xl within a justify-center row);
          the ToC aside animates its own width/opacity, so as it collapses the
          centered content glides over smoothly with no snap. The aside carries
          its own left gap, which collapses with it. */}
      <div className="mx-auto flex w-full max-w-6xl justify-center px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <div ref={contentRef} className="w-full min-w-0 flex-1 lg:max-w-3xl">
          <div className="flex flex-col gap-3 mb-12">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-h1">{title}</h1>
              {(status || version) && <StatusBadge status={status} version={version} />}
            </div>
            <p className="text-body-lg text-muted-foreground">{description}</p>
          </div>
          {children}
        </div>
        <OnThisPage contentRef={contentRef} />
      </div>
    </ContentCard>
  );
}

// A small maturity badge (+ optional version) shown next to the component title.
function StatusBadge({
  status,
  version,
}: {
  status?: "stable" | "beta" | "experimental" | "deprecated";
  version?: string;
}) {
  const tone: Record<NonNullable<typeof status>, string> = {
    stable: "bg-surface-success text-icon-success",
    beta: "bg-surface-caution text-icon-caution",
    experimental: "bg-surface-caution text-icon-caution",
    deprecated: "bg-surface-critical text-icon-critical",
  };
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-border px-2.5 py-0.5 text-body-xs">
      {status && (
        <span className={cn("inline-flex items-center gap-1 rounded-full px-1.5 font-medium capitalize", tone[status])}>
          {status}
        </span>
      )}
      {version && (
        <span className="text-tertiary" style={{ fontFamily: MONO }}>
          v{version}
        </span>
      )}
    </span>
  );
}

// Sticky right-rail "On this page" jump links. Scans the content column for
// section headings (h2/h3), slugifies + assigns ids on mount, then renders
// anchor links; an IntersectionObserver highlights the section in view. Hidden
// under lg (no room). Re-scans when the content changes (e.g. audience tab
// switch swaps the whole subtree).
function OnThisPage({
  contentRef,
}: {
  contentRef: React.RefObject<HTMLDivElement | null>;
}) {
  type Item = { id: string; text: string; level: 2 | 3 };
  const [items, setItems] = React.useState<Item[]>([]);
  const [activeId, setActiveId] = React.useState<string>("");
  // While a click-initiated smooth scroll is in flight, lock the active id so
  // the observer/scroll handlers don't fight it (the target section may sit at
  // the bottom and never reach the observer's top band).
  const lockRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    const content = contentRef.current;
    if (!content) return;
    // ContentCard's inner div is the scroll container (not the outer ref).
    const scroll = content.closest<HTMLElement>("[data-scroll-container]");

    const slug = (s: string) =>
      s
        .toLowerCase()
        .replace(/[^\w\s-]/g, "")
        .trim()
        .replace(/\s+/g, "-");

    // Ids of the current headings, kept fresh for the bottom-of-page override.
    let ids: string[] = [];

    const scan = () => {
      const heads = Array.from(
        content.querySelectorAll<HTMLHeadingElement>("h2, h3")
      );
      const seen = new Set<string>();
      const next: Item[] = heads.map((h) => {
        let id = h.id || slug(h.textContent || "section");
        while (seen.has(id)) id = `${id}-2`;
        seen.add(id);
        h.id = id;
        // Offset anchor scrolling for the sticky top padding.
        h.style.scrollMarginTop = "5rem";
        return { id, text: h.textContent || "", level: h.tagName === "H3" ? 3 : 2 };
      });
      ids = next.map((n) => n.id);
      setItems(next);

      // Highlight the heading nearest the top of the scroll viewport.
      const io = new IntersectionObserver(
        (entries) => {
          if (lockRef.current !== null) return; // click scroll in progress
          const visible = entries
            .filter((e) => e.isIntersecting)
            .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
          if (visible[0]) setActiveId(visible[0].target.id);
        },
        { root: scroll ?? null, rootMargin: "0px 0px -70% 0px", threshold: 0 }
      );
      heads.forEach((h) => io.observe(h));
      return io;
    };

    // Bottom-of-page override: the last sections can't reach the top band the
    // observer watches, so at (near) the bottom force-activate the last heading.
    const onScroll = () => {
      const el = scroll;
      if (!el || ids.length === 0 || lockRef.current !== null) return;
      const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 2;
      if (atBottom) setActiveId(ids[ids.length - 1]);
    };
    scroll?.addEventListener("scroll", onScroll, { passive: true });

    let io = scan();
    // The audience tabs swap the whole content subtree — re-scan on mutation.
    const mo = new MutationObserver(() => {
      io.disconnect();
      io = scan();
    });
    mo.observe(content, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      scroll?.removeEventListener("scroll", onScroll);
    };
  }, [contentRef]);

  const onClick = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    setActiveId(id);
    // Lock the highlight to the clicked link until the smooth scroll settles,
    // so the observer doesn't reset it (e.g. a bottom section that can't reach
    // the top band). Cleared on a debounce after scrolling stops.
    if (lockRef.current !== null) window.clearTimeout(lockRef.current);
    lockRef.current = window.setTimeout(() => {
      lockRef.current = null;
    }, 700);
    el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const has = items.length > 0;

  // Always rendered (not unmounted) so the layout can glide: the aside animates
  // its width + opacity between full (w-72, incl. the left gap via pl-16) and
  // collapsed (w-0). As it collapses, the centered content slides over smoothly
  // instead of snapping. overflow-hidden clips the content during the shrink.
  return (
    <aside
      aria-hidden={!has}
      className={cn(
        "sticky top-16 hidden h-fit shrink-0 self-start overflow-hidden transition-[width,opacity] duration-300 ease-out lg:block",
        has ? "w-72 pl-16 opacity-100" : "pointer-events-none w-0 pl-0 opacity-0"
      )}
    >
      <p className="mb-3 whitespace-nowrap text-body-xs font-medium uppercase tracking-wide text-tertiary">
        On this page
      </p>
      <nav className="flex flex-col gap-1 border-l border-border">
        {items.map((it) => (
          <a
            key={it.id}
            href={`#${it.id}`}
            onClick={(e) => onClick(e, it.id)}
            className={cn(
              "-ml-px whitespace-nowrap border-l py-1 text-body-xs transition-colors",
              it.level === 3 ? "pl-6" : "pl-3",
              activeId === it.id
                ? "border-foreground font-medium text-foreground"
                : "border-transparent text-tertiary hover:text-foreground"
            )}
          >
            {it.text}
          </a>
        ))}
      </nav>
    </aside>
  );
}

// Audience tabs — split component docs by reader: Design (states, tokens, usage
// guidance) vs Dev (code, props/API). Sits above the content; the shared preview
// typically lives inside each tab's slot. Renders the active tab's node.
export function AudienceTabs({
  playground,
  design,
  dev,
}: {
  /** Optional interactive playground — when present it's the first, default tab. */
  playground?: React.ReactNode;
  design: React.ReactNode;
  dev: React.ReactNode;
}) {
  const tabs = [
    ...(playground ? [{ id: "playground", label: "Playground" } as const] : []),
    { id: "design", label: "Design" } as const,
    { id: "dev", label: "Develop" } as const,
  ];
  const [tab, setTab] = React.useState<string>(tabs[0].id);
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-6 border-b border-border">
        {tabs.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            aria-selected={tab === t.id}
            className={cn(
              "-mb-px border-b-2 pb-3 text-body-sm font-medium transition-colors focus-visible:outline-none",
              tab === t.id
                ? "border-foreground text-foreground"
                : "border-transparent text-tertiary hover:text-foreground"
            )}
          >
            {t.label}
          </button>
        ))}
      </div>
      {tab === "playground" ? playground : tab === "dev" ? dev : design}
    </div>
  );
}

// The rendered preview surface with a per-card light/dark toggle (scoped `.dark`
// class) so you can check the component in both themes without flipping the
// whole site. Shared by Demo and Variants.
// A subtle checkerboard (transparency grid) behind the preview so component
// edges and any transparency read clearly. The tint is driven from the `dark`
// state directly (not the `dark:` variant — our variant is `.dark *`, which
// wouldn't match the element that carries .dark itself): faint black in light,
// brighter white in dark, since 2% white is invisible on the dark surface.
const checkerStyle = (dark: boolean): React.CSSProperties => {
  const tint = dark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)";
  return {
    backgroundImage: `conic-gradient(${tint} 25%, transparent 0 50%, ${tint} 0 75%, transparent 0)`,
    backgroundSize: "20px 20px",
  };
};

function PreviewSurface({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = React.useState(false);
  return (
    <div
      style={checkerStyle(dark)}
      className={cn(
        "relative flex min-h-64 flex-wrap items-center justify-center gap-3 border border-border bg-background p-6",
        dark && "dark"
      )}
    >
      <button
        type="button"
        onClick={() => setDark((d) => !d)}
        aria-label={dark ? "Preview in light mode" : "Preview in dark mode"}
        title={dark ? "Light" : "Dark"}
        className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-md text-tertiary transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
      >
        {dark ? <SunIcon className="size-4" /> : <MoonIcon className="size-4" />}
      </button>
      {children}
    </div>
  );
}

/* ─── Playground ─────────────────────────────────────────────────────────── */

// A single configurable control. `select` renders a Select over `options`;
// `boolean` renders a Switch; `text` renders an Input. `default` seeds the state.
export type ControlValues = Record<string, string | number | boolean>;

// `visibleIf` hides a control unless the predicate passes against the current
// values — for dependent controls (e.g. only show "label text" when a "label"
// toggle is on). Hidden controls keep their value; they just aren't rendered.
type ControlBase = { prop: string; label?: string; visibleIf?: (values: ControlValues) => boolean };

export type Control =
  | (ControlBase & { type: "select"; options: (string | number)[]; default: string | number })
  | (ControlBase & { type: "boolean"; default: boolean })
  | (ControlBase & { type: "text"; default: string });

// Interactive playground — a live preview on top, then a controls panel that
// live-updates it. `render(values)` receives the current control values keyed by
// prop. Reusable across components: declare `controls`, read them in `render`.
export function Playground({
  controls,
  render,
}: {
  controls: Control[];
  render: (values: ControlValues) => React.ReactNode;
}) {
  const [values, setValues] = React.useState<ControlValues>(() =>
    Object.fromEntries(controls.map((c) => [c.prop, c.default]))
  );
  const set = (prop: string, v: string | number | boolean) =>
    setValues((s) => ({ ...s, [prop]: v }));

  return (
    <section className="mb-12 flex flex-col gap-4">
      <PreviewSurface>{render(values)}</PreviewSurface>
      <div className="flex flex-col divide-y divide-border border border-border">
        {controls
          .filter((c) => !c.visibleIf || c.visibleIf(values))
          .map((c) => (
          <div key={c.prop} className="flex items-center justify-between gap-4 px-4 py-3">
            <div className="flex flex-col">
              <span className="text-body-sm font-medium text-foreground" style={{ fontFamily: MONO }}>
                {c.label ?? c.prop}
              </span>
            </div>
            {c.type === "select" && (
              <Select
                value={String(values[c.prop])}
                onValueChange={(raw) => {
                  // Preserve number-typed options.
                  const asNum = c.options.find((o) => String(o) === raw);
                  set(c.prop, typeof asNum === "number" ? asNum : raw);
                }}
              >
                <SelectTrigger size="sm" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {c.options.map((o) => (
                    <SelectItem key={String(o)} value={String(o)}>
                      {String(o)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
            {c.type === "boolean" && (
              <Switch
                checked={Boolean(values[c.prop])}
                onCheckedChange={(v) => set(c.prop, v)}
                aria-label={c.label ?? c.prop}
              />
            )}
            {c.type === "text" && (
              <Input
                className="h-8 w-48"
                value={String(values[c.prop])}
                onChange={(e) => set(c.prop, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
}

// A titled demo block: a heading + optional caption, then a rendered preview
// surface holding the live component(s).
export function Demo({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3">{title}</h2>
        {caption && <p className="text-body-sm text-muted-foreground">{caption}</p>}
      </div>
      <PreviewSurface>{children}</PreviewSurface>
    </section>
  );
}

export type Variant = {
  /** Chip label. */
  label: string;
  /** Optional note shown under the preview for this variant. */
  caption?: string;
  /** The live component for this variant. */
  preview: React.ReactNode;
  /** Optional usage snippet (tsx) shown below the preview. */
  code?: string;
  /** Optional "Styles" tab: the component's source className strings, showing
      how Cardboard tokens (--space-*, bg-surface, --radius-*, …) style it. */
  styles?: string;
};

// Lightweight JSX/TS syntax highlighter → colored spans. Not a full parser: it
// tokenizes in priority order (strings, comments, JSX tags/attrs, keywords,
// numbers) so the doc snippets read like code without a highlighting library
// (which the artifact CSP / self-contained build can't load anyway).
const CODE_KEYWORDS =
  /\b(const|let|var|function|return|import|from|export|if|else|for|while|new|await|async|true|false|null|undefined|typeof)\b/;

function highlightCode(code: string, lang = "tsx"): React.ReactNode[] {
  // Ordered token patterns; first match wins at each position. CSS gets its own
  // set (selectors, `prop:`, var(), /* */ comments); everything else uses JSX.
  const cssPatterns: { type: string; re: RegExp }[] = [
    { type: "comment", re: /^\/\*[\s\S]*?\*\//},
    { type: "keyword", re: /^var\b/ },                    // var()
    { type: "attr", re: /^--[\w-]+/ },                    // custom props (tokens)
    { type: "tag", re: /^\.[-\w]+/ },                     // .selector
    { type: "attr", re: /^[-a-z]+(?=\s*:)/ },             // property name
    { type: "number", re: /^-?\d+(\.\d+)?(px|rem|em|%|s|ms|deg|fr)?\b/ },
    { type: "string", re: /^"[^"]*"|^'[^']*'/ },
    { type: "punct", re: /^[{}():;,]+/ },
    { type: "ws", re: /^\s+/ },
    { type: "text", re: /^[^\s{}():;,"']+/ },
  ];
  const jsxPatterns: { type: string; re: RegExp }[] = [
    { type: "comment", re: /^\/\/[^\n]*/ },
    { type: "string", re: /^"[^"]*"|^'[^']*'|^`[^`]*`/ },
    { type: "tag", re: /^<\/?[A-Za-z][\w.]*|^\/?>/ },
    { type: "keyword", re: new RegExp(`^${CODE_KEYWORDS.source}`) },
    { type: "attr", re: /^[A-Za-z_][\w-]*(?==)/ },
    { type: "number", re: /^\b\d+\b/ },
    { type: "punct", re: /^[{}()[\];,=>]+/ },
    { type: "ws", re: /^\s+/ },
    { type: "text", re: /^[^\s<>"'`{}()[\];,=]+/ },
  ];
  const patterns = lang === "css" ? cssPatterns : jsxPatterns;
  // GitHub-light palette (works on a white surface). In dark mode the block's
  // .dark scope swaps these to the light-on-dark set via CSS vars below.
  const color: Record<string, string> = {
    comment: "italic text-[var(--sx-comment)]",
    string: "text-[var(--sx-string)]",
    tag: "text-[var(--sx-tag)]",
    keyword: "text-[var(--sx-keyword)]",
    attr: "text-[var(--sx-attr)]",
    number: "text-[var(--sx-number)]",
    punct: "text-[var(--sx-text)]",
    text: "text-[var(--sx-text)]",
    ws: "",
  };
  const out: React.ReactNode[] = [];
  let rest = code;
  let key = 0;
  while (rest.length) {
    let matched = false;
    for (const { type, re } of patterns) {
      const m = re.exec(rest);
      if (m && m[0].length) {
        const text = m[0];
        out.push(
          type === "ws" ? (
            text
          ) : (
            <span key={key++} className={color[type]}>
              {text}
            </span>
          )
        );
        rest = rest.slice(text.length);
        matched = true;
        break;
      }
    }
    if (!matched) {
      out.push(rest[0]);
      rest = rest.slice(1);
    }
  }
  return out;
}

const MONO = "ui-monospace, SFMono-Regular, Menlo, Consolas, 'Liberation Mono', monospace";

// GitHub-light syntax palette (works on a white surface), with light-on-dark
// overrides scoped under .dark so the block matches the page theme.
const SYNTAX_VARS =
  "[--sx-comment:#6e7781] [--sx-string:#0a3069] [--sx-tag:#116329] [--sx-keyword:#cf222e] [--sx-attr:#0550ae] [--sx-number:#0550ae] [--sx-text:#1f2328] " +
  "dark:[--sx-comment:#8b949e] dark:[--sx-string:#a5d6ff] dark:[--sx-tag:#7ee787] dark:[--sx-keyword:#ff7b72] dark:[--sx-attr:#79c0ff] dark:[--sx-number:#79c0ff] dark:[--sx-text:#c9d1d9]";

export type CodeTab = { lang: string; code: string };

// A read-only code snippet: theme-aware surface (white in light, dark in dark),
// a header bar with a tab per language + copy button, and syntax highlighting.
// Pass multiple tabs to switch between e.g. usage ("tsx") and the component's
// source styles ("styles").
function CodeBlock({ tabs }: { tabs: CodeTab[] }) {
  const [active, setActive] = React.useState(0);
  const [copied, setCopied] = React.useState(false);
  // Clamp: switching variant chips can shrink `tabs` while this block persists
  // (React reuses it), so a stale `active` could index past the array.
  const idx = Math.min(active, tabs.length - 1);
  const current = tabs[idx];
  if (!current) return null;
  const copy = () => {
    navigator.clipboard?.writeText(current.code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <div className={cn("overflow-hidden border border-border bg-surface", SYNTAX_VARS)}>
      {/* Header bar: language tabs + copy */}
      <div className="flex items-center justify-between border-b border-border pr-2">
        <div className="flex">
          {tabs.map((t, i) => (
            <button
              key={t.lang}
              type="button"
              onClick={() => { setActive(i); setCopied(false); }}
              style={{ fontFamily: MONO }}
              className={cn(
                "border-b-2 px-3 py-1.5 text-body-xs font-medium transition-colors -mb-px",
                i === idx
                  ? "border-foreground text-foreground"
                  : "border-transparent text-tertiary hover:text-foreground"
              )}
            >
              {t.lang}
            </button>
          ))}
        </div>
        <button
          type="button"
          onClick={copy}
          aria-label="Copy code"
          className="flex size-6 items-center justify-center rounded-md text-tertiary transition-colors hover:bg-surface-secondary hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus"
        >
          {copied ? (
            <CheckIcon className="size-4 text-success" />
          ) : (
            <ClipboardIcon className="size-4" />
          )}
        </button>
      </div>
      {/* Native mono stack on <code> — font-mono now maps to Signifier
          (proportional) since Geist Mono was removed; and it must live on the
          <code> because Tailwind preflight resets code/pre font-family. */}
      <pre className="overflow-x-auto p-4 text-body-xs leading-relaxed">
        <code style={{ fontFamily: MONO }}>
          {highlightCode(current.code, /css|styles/.test(current.lang) ? "css" : "tsx")}
        </code>
      </pre>
    </div>
  );
}

// A filterable chip row (Polaris-style) that switches the shown variant: one
// chip active at a time, and the preview surface below renders only that
// variant's demo + caption.
export function Variants({
  variants,
  showCode = true,
  preview = true,
}: {
  variants: Variant[];
  /** Show the code block below the preview (Dev tab). Design tab passes false. */
  showCode?: boolean;
  /** Show the rendered preview surface. Dev tab passes false so the variant is
      shown as code only — the live preview lives once, on the Design tab. */
  preview?: boolean;
}) {
  const [active, setActive] = React.useState(0);
  const current = variants[active];
  return (
    <section className="mb-12 flex flex-col gap-4">
      {/* Chip row */}
      <div className="flex flex-wrap gap-2">
        {variants.map((v, i) => (
          <button
            key={v.label}
            type="button"
            onClick={() => setActive(i)}
            aria-pressed={i === active}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-body-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-border-focus",
              i === active
                ? "border-foreground bg-surface text-foreground"
                : "border-border text-tertiary hover:border-border-hover hover:text-foreground"
            )}
          >
            {v.label}
          </button>
        ))}
      </div>
      {current?.caption && (
        <p className="text-body-sm text-muted-foreground">{current.caption}</p>
      )}
      {preview && <PreviewSurface>{current?.preview}</PreviewSurface>}
      {showCode && current?.code && (
        <CodeBlock
          tabs={[
            { lang: "tsx", code: current.code },
            ...(current.styles ? [{ lang: "css", code: current.styles }] : []),
          ]}
        />
      )}
    </section>
  );
}

// A props/API reference for the Dev tab — Polaris-style: an `interface` header,
// then one stacked row per prop with a syntax-colored name + type, description,
// and optional default / deprecated hints. A trailing `?` on the name marks the
// prop optional (rendered in the accent color, like TS).
export type PropRow = {
  /** Prop name; a trailing "?" marks it optional (e.g. "size?"). */
  name: string;
  type: string;
  default?: string;
  desc: string;
  /** If set, shows a "Deprecated" pill with this reason. */
  deprecated?: string;
};
export type PropGroup = { interfaceName?: string; rows: PropRow[] };

// A group of props (Shopify dev-docs style): an optional plain subcomponent
// name, then flat prop rows — each is `name • type  Default: x` inline, with the
// description below. No `interface` keyword, no boxed card.
function PropInterface({ interfaceName, rows }: PropGroup) {
  return (
    <div className={cn("flex flex-col", SYNTAX_VARS)}>
      {interfaceName && (
        <h3
          className="mb-1 text-body-sm font-medium text-foreground"
          style={{ fontFamily: MONO }}
        >
          {interfaceName}
        </h3>
      )}
      <div className="divide-y divide-border border-t border-border">
        {rows.map((r) => {
          const optional = r.name.endsWith("?");
          const base = optional ? r.name.slice(0, -1) : r.name;
          return (
            <div key={r.name} className="flex flex-col gap-1 py-3">
              {/* name • type  Default: x */}
              <div
                className="flex flex-wrap items-baseline gap-x-2 text-body-xs"
                style={{ fontFamily: MONO }}
              >
                <span className="text-body-sm font-medium text-[var(--sx-attr)]">
                  {base}
                  {optional && <span className="text-tertiary">?</span>}
                </span>
                <span className="text-tertiary">•</span>
                <span>{highlightCode(r.type, "tsx")}</span>
                {r.default !== undefined && (
                  <span className="text-tertiary">
                    Default:{" "}
                    <span className="text-[var(--sx-string)]">{r.default}</span>
                  </span>
                )}
              </div>
              <p className="text-body-sm text-muted-foreground">{r.desc}</p>
              {r.deprecated && (
                <p className="mt-0.5 flex items-center gap-1.5 text-body-xs text-muted-foreground">
                  <span className="rounded-md bg-surface-caution px-1.5 py-0.5 font-medium text-icon-caution">
                    Deprecated
                  </span>
                  {r.deprecated}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// The Props section. Pass `rows` (+ optional `interfaceName` = a plain
// subcomponent name) for a single group, or `groups` to stack several under one
// "Props" heading (e.g. a component and its item subcomponent).
export function PropsTable({
  rows,
  interfaceName,
  groups,
}: {
  rows?: PropRow[];
  /** Plain subcomponent name shown above its props (e.g. "NavBarNavItem"). */
  interfaceName?: string;
  /** Multiple prop groups under one heading. Takes precedence over `rows`. */
  groups?: PropGroup[];
}) {
  const list: PropGroup[] = groups ?? (rows ? [{ interfaceName, rows }] : []);
  return (
    <section className="mb-12 flex flex-col gap-6">
      <h2 className="text-h3">Props</h2>
      {list.map((g, i) => (
        <PropInterface key={g.interfaceName ?? i} {...g} />
      ))}
    </section>
  );
}

export type SlotRow = {
  /** The slot name — a subcomponent (NavBarLogo) or `children`. */
  name: string;
  /** The accepted content's type, e.g. "ReactNode", "NavBarNavItem[]". */
  type: string;
  desc: string;
  /** Optional — mark a slot as not required. */
  optional?: boolean;
};

// The Slots section (Shopify dev-docs style). For compositional components — the
// insertion points you compose *inside* the component (subcomponents, children).
// Distinct from Anatomy (a visual, numbered part diagram on Design): Slots is the
// code-facing contract on Develop, next to Props. Same flat row markup as
// PropInterface: `name • type`, description below.
export function Slots({ intro, slots }: { intro?: string; slots: SlotRow[] }) {
  return (
    <section className={cn("mb-12 flex flex-col gap-4", SYNTAX_VARS)}>
      <h2 className="text-h3">Slots</h2>
      {intro && <p className="text-body-sm text-muted-foreground">{intro}</p>}
      <div className="divide-y divide-border border-t border-border">
        {slots.map((s) => (
          <div key={s.name} className="flex flex-col gap-1 py-3">
            <div
              className="flex flex-wrap items-baseline gap-x-2 text-body-xs"
              style={{ fontFamily: MONO }}
            >
              <span className="text-body-sm font-medium text-[var(--sx-attr)]">
                {s.name}
                {s.optional && <span className="text-tertiary">?</span>}
              </span>
              <span className="text-tertiary">•</span>
              <span>{highlightCode(s.type, "tsx")}</span>
            </div>
            <p className="text-body-sm text-muted-foreground">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

// A specs table: the anatomy of a component — part → the token(s) that style it.
// For custom pattern components, this makes the doc a build-from template, not
// just a picture (icon size, title size, body size, spacing, colors…).
export function Specs({ rows }: { rows: { part: string; spec: string }[] }) {
  return (
    <div className="overflow-hidden border border-border bg-surface">
      <table className="w-full min-w-[24rem] text-left text-body-sm">
        <thead>
          <tr className="border-b border-border font-mono text-body-xs text-muted-foreground">
            <th className="px-4 py-2.5 font-normal">Part</th>
            <th className="px-4 py-2.5 font-normal">Spec</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.part}>
              <td className="px-4 py-3 text-foreground">{r.part}</td>
              <td className="px-4 py-3 font-mono text-body-xs text-muted-foreground">{r.spec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export type StateSpec = {
  /** State name — Rest, Hover, Selected, Focus, Disabled … */
  name: string;
  /** The element rendered FORCED into this state (so it's visible statically). */
  node: React.ReactNode;
  /** The token(s)/classes that define this state. */
  tokens: string;
};

// Documents a component's interaction states: a visual row showing each state
// forced (so you SEE rest/hover/selected/focus/disabled without interacting),
// plus a State → tokens spec table beneath it.
export function States({ title = "States", states }: { title?: string; states: StateSpec[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">{title}</h2>

      {/* Visual row — each state forced, labeled. The large-screen column count
          matches the number of states (capped at 5) so the cards fill the row
          instead of leaving an empty column when a component has < 5 states. */}
      <div
        className={cn(
          "grid grid-cols-2 gap-3 sm:grid-cols-3",
          { 2: "lg:grid-cols-2", 3: "lg:grid-cols-3", 4: "lg:grid-cols-4", 5: "lg:grid-cols-5" }[
            Math.min(states.length, 5)
          ] ?? "lg:grid-cols-5"
        )}
      >
        {states.map((s) => (
          <div
            key={s.name}
            className="flex flex-col items-center gap-3 border border-border bg-background p-5"
          >
            <div className="flex flex-1 items-center justify-center">{s.node}</div>
            <span className="text-body-xs font-medium text-tertiary">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Spec table — State → tokens */}
      <div className="overflow-hidden border border-border bg-surface">
        <table className="w-full min-w-[24rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-body-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-normal">State</th>
              <th className="px-4 py-2.5 font-normal">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {states.map((s) => (
              <tr key={s.name}>
                <td className="px-4 py-3 text-foreground">{s.name}</td>
                <td
                  className="px-4 py-3 text-body-xs text-muted-foreground"
                  style={{ fontFamily: MONO }}
                >
                  {s.tokens}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ─── Design-tab building blocks ─────────────────────────────────────────── */

// When-to-use / when-to-avoid guidance — two bulleted columns.
export function Guidelines({ use, avoid }: { use: string[]; avoid: string[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Usage</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-2 border border-border p-4">
          <div className="flex items-center gap-1.5 text-body-sm font-medium text-success">
            <CheckCircleIcon className="size-4" /> Use when
          </div>
          <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
            {use.map((u) => (
              <li key={u} className="flex gap-2">
                <span className="text-tertiary">•</span> {u}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col gap-2 border border-border p-4">
          <div className="flex items-center gap-1.5 text-body-sm font-medium text-critical">
            <XCircleIcon className="size-4" /> Avoid when
          </div>
          <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
            {avoid.map((a) => (
              <li key={a} className="flex gap-2">
                <span className="text-tertiary">•</span> {a}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

export type DoDontItem = { caption: string; example: React.ReactNode };

// Side-by-side Do / Don't examples with a live sample in each.
export function DoDont({ dos, donts }: { dos: DoDontItem[]; donts: DoDontItem[] }) {
  const Card = ({ ok, item }: { ok: boolean; item: DoDontItem }) => (
    <div className="flex flex-col overflow-hidden border border-border">
      <div className="flex min-h-32 items-center justify-center bg-background p-6">
        {item.example}
      </div>
      <div
        className={cn(
          "flex items-start gap-1.5 border-t px-4 py-3 text-body-sm",
          ok ? "border-success/30 text-foreground" : "border-critical/30 text-foreground"
        )}
      >
        {ok ? (
          <CheckCircleIcon className="mt-0.5 size-4 shrink-0 text-success" />
        ) : (
          <XCircleIcon className="mt-0.5 size-4 shrink-0 text-critical" />
        )}
        <span>{item.caption}</span>
      </div>
    </div>
  );
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Best practices</h2>
      <div className="grid gap-4 sm:grid-cols-2">
        {dos.map((d, i) => <Card key={`do${i}`} ok item={d} />)}
        {donts.map((d, i) => <Card key={`dont${i}`} ok={false} item={d} />)}
      </div>
    </section>
  );
}

/* ─── Develop-tab building blocks ────────────────────────────────────────── */

// An install / import snippet block.
export function Install({ code }: { code: string }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Import</h2>
      <CodeBlock tabs={[{ lang: "tsx", code }]} />
    </section>
  );
}

// Accessibility notes — a keyboard-interaction table (rendered with Kbd), an
// optional ARIA roles/attributes table, plus free-form behavioral notes.
export function Accessibility({
  keyboard,
  aria,
  labeling,
  screenReader,
  reducedMotion,
  notes,
}: {
  // `keys` is a list of individual keys shown as separate <Kbd> chips; multiple
  // keys read as alternatives (e.g. ["←", "→"] → ← / →).
  keyboard: { keys: string[]; does: string }[];
  // ARIA roles/attributes the component sets: what, on which part, and why.
  aria?: { attr: string; on: string; purpose: string }[];
  // How the component is named + what the author must supply for it to be labeled.
  labeling?: string[];
  // What a screen reader announces / how the component behaves for AT users.
  screenReader?: string[];
  // How the component honors prefers-reduced-motion (one line or a few).
  reducedMotion?: string;
  notes?: string[];
}) {
  // A titled bullet list — shared shape for the prose subsections below.
  const Subsection = ({ title, items }: { title: string; items: string[] }) => (
    <>
      <h3 className="mt-2 text-body-sm font-medium text-foreground">{title}</h3>
      <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
        {items.map((n) => (
          <li key={n} className="flex gap-2">
            <span className="text-tertiary">•</span> {n}
          </li>
        ))}
      </ul>
    </>
  );
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Accessibility</h2>
      <h3 className="text-body-sm font-medium text-foreground">Keyboard</h3>
      <div className="overflow-hidden border border-border bg-surface">
        <table className="w-full min-w-[24rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-body-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-normal">Key</th>
              <th className="px-4 py-2.5 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {keyboard.map((k) => (
              <tr key={k.keys.join("/")}>
                <td className="px-4 py-3">
                  <span className="inline-flex items-center gap-1.5">
                    {k.keys.map((key, i) => (
                      <React.Fragment key={key}>
                        {i > 0 && <span className="text-tertiary">/</span>}
                        <Kbd>{key}</Kbd>
                      </React.Fragment>
                    ))}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{k.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {aria && aria.length > 0 && (
        <>
          <h3 className="mt-2 text-body-sm font-medium text-foreground">ARIA</h3>
          <div className={cn("overflow-hidden border border-border bg-surface", SYNTAX_VARS)}>
            <table className="w-full min-w-[28rem] text-left text-body-sm">
              <thead>
                <tr className="border-b border-border text-body-xs text-muted-foreground">
                  <th className="px-4 py-2.5 font-normal">Attribute</th>
                  <th className="px-4 py-2.5 font-normal">Applied to</th>
                  <th className="px-4 py-2.5 font-normal">Purpose</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {aria.map((a) => (
                  <tr key={a.attr}>
                    <td className="px-4 py-3 text-body-xs" style={{ fontFamily: MONO }}>
                      {highlightCode(a.attr, "tsx")}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{a.on}</td>
                    <td className="px-4 py-3 text-muted-foreground">{a.purpose}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
      {labeling && labeling.length > 0 && (
        <Subsection title="Labeling" items={labeling} />
      )}
      {screenReader && screenReader.length > 0 && (
        <Subsection title="Screen reader" items={screenReader} />
      )}
      {reducedMotion && (
        <Subsection title="Reduced motion" items={[reducedMotion]} />
      )}
      {notes && notes.length > 0 && <Subsection title="Notes" items={notes} />}
    </section>
  );
}

// Design-facing accessibility: a WCAG/ADA criteria checklist (contrast, touch
// target, focus, text sizing, color independence, motion) — each row a
// criterion, a pass/status badge, and the measured detail. Complements the
// Develop-tab Accessibility (keyboard + ARIA).
export type WcagRow = {
  criterion: string;
  /** pass = meets AA; note = meets with a caveat; fail = does not meet. */
  status: "pass" | "note" | "fail";
  /** Short status label shown in the badge, e.g. "AA", "AA·caveat", "Fail". */
  label: string;
  detail: string;
};
export function WcagChecklist({ rows }: { rows: WcagRow[] }) {
  const badge: Record<WcagRow["status"], string> = {
    pass: "bg-surface-success text-icon-success",
    note: "bg-surface-caution text-icon-caution",
    fail: "bg-surface-critical text-icon-critical",
  };
  return (
    <section className="mb-12 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3">Accessibility</h2>
        <p className="text-body-sm text-muted-foreground">
          How the component meets WCAG 2.2 AA / ADA design criteria.
        </p>
      </div>
      <div className="overflow-hidden border border-border bg-surface">
        <table className="w-full min-w-[32rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border text-body-xs text-muted-foreground">
              <th className="px-4 py-2.5 font-normal">Criterion</th>
              <th className="px-4 py-2.5 font-normal">Status</th>
              <th className="px-4 py-2.5 font-normal">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.criterion}>
                <td className="px-4 py-3 text-foreground">{r.criterion}</td>
                <td className="px-4 py-3">
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-body-xs font-medium",
                      badge[r.status]
                    )}
                  >
                    {r.status === "fail" ? (
                      <XCircleIcon className="size-3.5" />
                    ) : (
                      <CheckCircleIcon className="size-3.5" />
                    )}
                    {r.label}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/* ─── More Design-tab blocks ─────────────────────────────────────────────── */

export type AnatomyPart = { n: number; part: string; tokens: string };
// Anatomy: a live component with numbered callouts, plus a legend mapping each
// number → the part and the Cardboard tokens that style it.
export function Anatomy({
  children,
  parts,
}: {
  /** The component to display (annotate it with data-anatomy numbers if desired). */
  children: React.ReactNode;
  parts: AnatomyPart[];
}) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Anatomy</h2>
      <div className="flex min-h-40 items-center justify-center border border-border bg-background p-8">
        {children}
      </div>
      <ol className="flex flex-col gap-2">
        {parts.map((p) => (
          <li key={p.n} className="flex items-start gap-3 text-body-sm">
            <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full bg-surface-secondary text-body-xs font-medium text-foreground">
              {p.n}
            </span>
            <span className="text-foreground">{p.part}</span>
            <span className="ml-auto text-body-xs text-muted-foreground" style={{ fontFamily: MONO }}>
              {p.tokens}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}

// Content guidelines — rules for the words inside the component.
export function ContentGuidelines({ rules }: { rules: string[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Content</h2>
      <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
        {rules.map((r) => (
          <li key={r} className="flex gap-2">
            <span className="text-tertiary">•</span> {r}
          </li>
        ))}
      </ul>
    </section>
  );
}

// Responsive / overflow behavior — how the component adapts to width. A prose
// list of rules, plus an optional live demo (e.g. shown in a constrained box).
export function Responsive({
  rules,
  children,
}: {
  rules: string[];
  /** Optional live demo of the behavior (rendered in a bordered surface). */
  children?: React.ReactNode;
}) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Responsive</h2>
      <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
        {rules.map((r) => (
          <li key={r} className="flex gap-2">
            <span className="text-tertiary">•</span> {r}
          </li>
        ))}
      </ul>
      {children && (
        <div className="border border-border bg-background p-6">{children}</div>
      )}
    </section>
  );
}

export type RelatedItem = { href: string; when: string };
// Related components — real gallery cards (live preview + name + description)
// pulled from the shared registry by href, each with a "reach for this when"
// note. Falls back to a plain link if the href isn't in the registry.
export function Related({ items }: { items: RelatedItem[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Related</h2>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((it) => {
          const entry = getComponent(it.href);
          if (!entry) {
            return (
              <Link key={it.href} href={it.href} className="text-body-sm text-link hover:underline">
                {it.href}
              </Link>
            );
          }
          // Override the gallery description with the contextual "when" note.
          return <ComponentCard key={it.href} {...entry} description={it.when} />;
        })}
      </div>
    </section>
  );
}

/* ─── More Develop-tab blocks ────────────────────────────────────────────── */

// API / composition notes — a titled bullet list of behavioral contract notes.
export function ApiNotes({ notes }: { notes: string[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">API notes</h2>
      <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
        {notes.map((n) => (
          <li key={n} className="flex gap-2">
            <span className="text-tertiary">•</span> {n}
          </li>
        ))}
      </ul>
    </section>
  );
}

export type ChangelogEntry = { version: string; date?: string; changes: string[] };
// A per-component changelog — newest first. Each release lists its version, an
// optional date, and the changes.
export function Changelog({ entries }: { entries: ChangelogEntry[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Changelog</h2>
      <ol className="flex flex-col gap-4">
        {entries.map((e) => (
          <li key={e.version} className="flex flex-col gap-1.5">
            <div className="flex items-baseline gap-2">
              <span className="text-body-sm font-medium text-foreground" style={{ fontFamily: MONO }}>
                v{e.version}
              </span>
              {e.date && <span className="text-body-xs text-tertiary">{e.date}</span>}
            </div>
            <ul className="flex flex-col gap-1 text-body-sm text-muted-foreground">
              {e.changes.map((c) => (
                <li key={c} className="flex gap-2">
                  <span className="text-tertiary">•</span> {c}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ol>
    </section>
  );
}
