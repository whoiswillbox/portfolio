"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowLeftIcon,
  SunIcon,
  MoonIcon,
  CheckIcon,
  ClipboardIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { Kbd } from "@cardboard";
import { cn } from "@/lib/utils";

/* Shared scaffold for the per-component reference pages — keeps the back link,
   header, and spacing identical across every component doc. */
export function ComponentPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <ContentCard flush className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <Link
          href="/cardboard/components"
          className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" />
          Components
        </Link>
        <div className="flex flex-col gap-3 mb-12">
          <h1 className="text-h1">{title}</h1>
          <p className="text-body-lg text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </ContentCard>
  );
}

// Audience tabs — split component docs by reader: Design (states, tokens, usage
// guidance) vs Dev (code, props/API). Sits above the content; the shared preview
// typically lives inside each tab's slot. Renders the active tab's node.
export function AudienceTabs({
  design,
  dev,
}: {
  design: React.ReactNode;
  dev: React.ReactNode;
}) {
  const [tab, setTab] = React.useState<"design" | "dev">("design");
  return (
    <div className="flex flex-col gap-8">
      <div className="flex gap-6 border-b border-border">
        {(["design", "dev"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            aria-selected={tab === t}
            className={cn(
              "-mb-px border-b-2 pb-3 text-body-sm font-medium capitalize transition-colors focus-visible:outline-none",
              tab === t
                ? "border-foreground text-foreground"
                : "border-transparent text-tertiary hover:text-foreground"
            )}
          >
            {t === "dev" ? "Develop" : "Design"}
          </button>
        ))}
      </div>
      {tab === "design" ? design : dev}
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
        "relative flex min-h-64 flex-wrap items-center justify-center gap-3 rounded-xl border border-border bg-background p-6",
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
    <div className={cn("overflow-hidden rounded-xl border border-border bg-surface", SYNTAX_VARS)}>
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
}: {
  variants: Variant[];
  /** Show the code block below the preview (Dev tab). Design tab passes false. */
  showCode?: boolean;
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
      <PreviewSurface>{current?.preview}</PreviewSurface>
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

// A props/API reference table for the Dev tab.
export type PropRow = { name: string; type: string; default?: string; desc: string };
export function PropsTable({ rows }: { rows: PropRow[] }) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Props</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[32rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-body-xs text-muted-foreground">
              <th className="px-4 py-2 font-normal">Prop</th>
              <th className="px-4 py-2 font-normal">Type</th>
              <th className="px-4 py-2 font-normal">Default</th>
              <th className="px-4 py-2 font-normal">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.name}>
                <td className="px-4 py-2 text-body-xs text-foreground" style={{ fontFamily: MONO }}>{r.name}</td>
                <td className="px-4 py-2 text-body-xs text-muted-foreground" style={{ fontFamily: MONO }}>{r.type}</td>
                <td className="px-4 py-2 text-body-xs text-muted-foreground" style={{ fontFamily: MONO }}>{r.default ?? "—"}</td>
                <td className="px-4 py-2 text-muted-foreground">{r.desc}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

// A specs table: the anatomy of a component — part → the token(s) that style it.
// For custom pattern components, this makes the doc a build-from template, not
// just a picture (icon size, title size, body size, spacing, colors…).
export function Specs({ rows }: { rows: { part: string; spec: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[24rem] text-left text-body-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 font-mono text-body-xs text-muted-foreground">
            <th className="px-4 py-2 font-normal">Part</th>
            <th className="px-4 py-2 font-normal">Spec</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.part}>
              <td className="px-4 py-2 text-foreground">{r.part}</td>
              <td className="px-4 py-2 font-mono text-body-xs text-muted-foreground">{r.spec}</td>
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

      {/* Visual row — each state forced, labeled */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {states.map((s) => (
          <div
            key={s.name}
            className="flex flex-col items-center gap-3 rounded-xl border border-border bg-background p-5"
          >
            <div className="flex flex-1 items-center justify-center">{s.node}</div>
            <span className="text-body-xs font-medium text-tertiary">{s.name}</span>
          </div>
        ))}
      </div>

      {/* Spec table — State → tokens */}
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[24rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-body-xs text-muted-foreground">
              <th className="px-4 py-2 font-normal">State</th>
              <th className="px-4 py-2 font-normal">Tokens</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {states.map((s) => (
              <tr key={s.name}>
                <td className="px-4 py-2 text-foreground">{s.name}</td>
                <td
                  className="px-4 py-2 text-body-xs text-muted-foreground"
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
        <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
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
        <div className="flex flex-col gap-2 rounded-xl border border-border p-4">
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
    <div className="flex flex-col overflow-hidden rounded-xl border border-border">
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

// Accessibility notes — keyboard interactions (rendered with Kbd) + ARIA notes.
export function Accessibility({
  keyboard,
  notes,
}: {
  // `keys` is a list of individual keys shown as separate <Kbd> chips; multiple
  // keys read as alternatives (e.g. ["←", "→"] → ← / →).
  keyboard: { keys: string[]; does: string }[];
  notes?: string[];
}) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <h2 className="text-h3">Accessibility</h2>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[24rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-body-xs text-muted-foreground">
              <th className="px-4 py-2 font-normal">Key</th>
              <th className="px-4 py-2 font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {keyboard.map((k) => (
              <tr key={k.keys.join("/")}>
                <td className="px-4 py-2">
                  <span className="inline-flex items-center gap-1.5">
                    {k.keys.map((key, i) => (
                      <React.Fragment key={key}>
                        {i > 0 && <span className="text-tertiary">/</span>}
                        <Kbd>{key}</Kbd>
                      </React.Fragment>
                    ))}
                  </span>
                </td>
                <td className="px-4 py-2 text-muted-foreground">{k.does}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {notes && notes.length > 0 && (
        <ul className="flex flex-col gap-1.5 text-body-sm text-muted-foreground">
          {notes.map((n) => (
            <li key={n} className="flex gap-2">
              <span className="text-tertiary">•</span> {n}
            </li>
          ))}
        </ul>
      )}
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
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full min-w-[32rem] text-left text-body-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50 text-body-xs text-muted-foreground">
              <th className="px-4 py-2 font-normal">Criterion</th>
              <th className="px-4 py-2 font-normal">Status</th>
              <th className="px-4 py-2 font-normal">Detail</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((r) => (
              <tr key={r.criterion}>
                <td className="px-4 py-2 text-foreground">{r.criterion}</td>
                <td className="px-4 py-2">
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
                <td className="px-4 py-2 text-muted-foreground">{r.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
