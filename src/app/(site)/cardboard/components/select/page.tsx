"use client";

import * as React from "react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@cardboard";
import { Label } from "@cardboard";
import {
  ComponentPage,
  AudienceTabs,
  Playground,
  Variants,
  States,
  PropsTable,
  Guidelines,
  DoDont,
  Install,
  Accessibility,
  WcagChecklist,
  Anatomy,
  ContentGuidelines,
  Changelog,
} from "../_component-page";
import { cn } from "@/lib/utils";

/* ── Live demos ──────────────────────────────────────────────────────────── */

function BasicSelect({ size, disabled }: { size?: "default" | "sm"; disabled?: boolean }) {
  const [v, setV] = React.useState<string | undefined>(undefined);
  return (
    <Select value={v} onValueChange={setV} disabled={disabled}>
      <SelectTrigger size={size} className="w-48">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="pear">Pear</SelectItem>
      </SelectContent>
    </Select>
  );
}

function GhostSelect() {
  const [v, setV] = React.useState<string | undefined>(undefined);
  return (
    <Select value={v} onValueChange={setV}>
      <SelectTrigger variant="ghost" className="w-44">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="pear">Pear</SelectItem>
      </SelectContent>
    </Select>
  );
}

function GroupedSelect() {
  const [v, setV] = React.useState<string | undefined>(undefined);
  return (
    <Select value={v} onValueChange={setV}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Pick one" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Fruit</SelectLabel>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
        </SelectGroup>
        <SelectSeparator />
        <SelectGroup>
          <SelectLabel>Vegetable</SelectLabel>
          <SelectItem value="carrot">Carrot</SelectItem>
          <SelectItem value="pea">Pea</SelectItem>
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

function LabeledSelect() {
  const [v, setV] = React.useState<string | undefined>(undefined);
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor="labeled-select">Fruit</Label>
      <Select value={v} onValueChange={setV}>
        <SelectTrigger id="labeled-select" className="w-48">
          <SelectValue placeholder="Pick a fruit" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

// A trigger rendered with its state classes FORCED (via `extra`) so each
// interaction state is visible statically. Mirrors the real trigger's base.
function StateTrigger({ extra = "", placeholder = "Select" }: { extra?: string; placeholder?: string }) {
  return (
    <div
      className={cn(
        "flex w-full items-center justify-between gap-1.5 rounded-lg border border-border bg-surface px-3 py-2 text-sm text-tertiary",
        extra
      )}
    >
      {placeholder}
      <svg viewBox="0 0 20 20" fill="none" className="size-4 text-tertiary" aria-hidden="true">
        <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

/* ── Variants ────────────────────────────────────────────────────────────── */

const VARIANTS = [
  {
    label: "Default",
    caption: "A single-select from a known list.",
    preview: <BasicSelect />,
    code: `"use client";

import { useState } from "react";
import {
  Select, SelectTrigger, SelectValue, SelectContent, SelectItem,
} from "@cardboard";

function Example() {
  const [value, setValue] = useState<string>();
  return (
    <Select value={value} onValueChange={setValue}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Pick a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem value="orange">Orange</SelectItem>
        <SelectItem value="pear">Pear</SelectItem>
      </SelectContent>
    </Select>
  );
}`,
    styles: `/* Trigger — a bordered surface control; height is padding-driven. */
.select-trigger {
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-150);              /* 6px */
  padding: var(--space-200) var(--space-300); /* 8px 12px */
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  font-size: var(--font-size-sm);
}

.select-trigger[data-placeholder] { color: var(--color-tertiary); }
.select-trigger:focus-visible {
  border-color: var(--color-border-focus);
  box-shadow: 0 0 0 3px var(--color-border-focus / 50%);
}`,
  },
  {
    label: "With label",
    caption: "Pair a Label with the trigger via htmlFor / id.",
    preview: <LabeledSelect />,
    code: `<div className="flex flex-col gap-1.5">
  <Label htmlFor="fruit">Fruit</Label>
  <Select value={value} onValueChange={setValue}>
    <SelectTrigger id="fruit" className="w-48">
      <SelectValue placeholder="Pick a fruit" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectContent>
  </Select>
</div>`,
  },
  {
    label: "Grouped",
    caption: "Group options with a label and separator.",
    preview: <GroupedSelect />,
    code: `<Select value={value} onValueChange={setValue}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Pick one" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>Fruit</SelectLabel>
      <SelectItem value="apple">Apple</SelectItem>
      <SelectItem value="orange">Orange</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>Vegetable</SelectLabel>
      <SelectItem value="carrot">Carrot</SelectItem>
      <SelectItem value="pea">Pea</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`,
  },
  {
    label: "No border",
    caption: "The ghost variant — borderless (text + chevron) for inline / toolbar triggers.",
    preview: <GhostSelect />,
    code: `// variant="ghost" drops the border/background for an inline trigger.
<Select value={value} onValueChange={setValue}>
  <SelectTrigger variant="ghost" className="w-44">
    <SelectValue placeholder="Pick a fruit" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
    <SelectItem value="orange">Orange</SelectItem>
  </SelectContent>
</Select>`,
  },
  {
    label: "Small",
    caption: "Compact size for dense toolbars and inline controls.",
    preview: <BasicSelect size="sm" />,
    code: `// Pass size="sm" on the trigger.
<SelectTrigger size="sm" className="w-48">
  <SelectValue placeholder="Pick a fruit" />
</SelectTrigger>`,
  },
  {
    label: "Disabled",
    caption: "Disable the whole control.",
    preview: <BasicSelect disabled />,
    code: `// Disable the whole select.
<Select disabled value={value} onValueChange={setValue}>
  <SelectTrigger className="w-48">
    <SelectValue placeholder="Unavailable" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="apple">Apple</SelectItem>
  </SelectContent>
</Select>`,
  },
];

/* ── Playground ──────────────────────────────────────────────────────────── */

function PlaygroundDemo({
  variant,
  size,
  disabled,
  placeholder,
  showLabel,
  label,
}: {
  variant: "default" | "ghost";
  size: "default" | "sm";
  disabled: boolean;
  placeholder: string;
  showLabel: boolean;
  label: string;
}) {
  const [v, setV] = React.useState<string | undefined>(undefined);
  return (
    <div className="flex flex-col gap-1.5">
      {showLabel && label && <Label htmlFor="pg-select">{label}</Label>}
      <Select value={v} onValueChange={setV} disabled={disabled}>
        <SelectTrigger id="pg-select" size={size} variant={variant} className="w-56">
          <SelectValue placeholder={placeholder || "Select…"} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="apple">Apple</SelectItem>
          <SelectItem value="orange">Orange</SelectItem>
          <SelectItem value="pear">Pear</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function SelectDocs() {
  return (
    <ComponentPage
      title="Select"
      status="stable"
      version="1.2"
      description="A single-select dropdown for picking one value from a known, moderately-sized list. For a few options prefer a Radio Group; for many searchable options prefer a Combobox."
    >
      <AudienceTabs
        playground={
          <Playground
            controls={[
              { prop: "variant", label: "variant", type: "select", options: ["default", "ghost"], default: "default" },
              { prop: "showLabel", label: "label", type: "boolean", default: true },
              { prop: "label", label: "label text", type: "text", default: "Fruit", visibleIf: (v) => Boolean(v.showLabel) },
              { prop: "placeholder", label: "placeholder", type: "text", default: "Pick a fruit" },
              { prop: "size", label: "size", type: "select", options: ["default", "sm"], default: "default" },
              { prop: "disabled", label: "disabled", type: "boolean", default: false },
            ]}
            render={(v) => (
              <PlaygroundDemo
                variant={v.variant as "default" | "ghost"}
                showLabel={Boolean(v.showLabel)}
                label={String(v.label)}
                placeholder={String(v.placeholder)}
                size={v.size as "default" | "sm"}
                disabled={Boolean(v.disabled)}
              />
            )}
          />
        }
        design={
          <>
            <Anatomy
              parts={[
                { n: 1, part: "Trigger — the bordered control that opens the list.", tokens: "bg-surface · border · --radius-lg · data-slot=select-trigger · data-size" },
                { n: 2, part: "Value / placeholder — the selection (or hint).", tokens: "text-foreground · placeholder: text-tertiary" },
                { n: 3, part: "Chevron — affordance that it opens a menu.", tokens: "text-tertiary · size-4" },
                { n: 4, part: "Content — the popover list of options.", tokens: "bg-surface · shadow-md · ring-foreground/10" },
              ]}
            >
              <BasicSelect />
            </Anatomy>
            <Guidelines
              use={[
                "Picking one value from a known, moderately-sized list (~5–15 options).",
                "The options are static labels, not actions.",
                "Space is limited and the options don't need to all be visible at once.",
              ]}
              avoid={[
                "2–4 options that benefit from being always visible — use a Radio Group or Segmented Control.",
                "Large or searchable lists — use a Combobox.",
                "Selecting multiple values — use checkboxes or a multi-select.",
              ]}
            />
            <ContentGuidelines
              rules={[
                "Write a clear placeholder that names the choice (e.g. “Pick a fruit”), not just “Select”.",
                "Pair the trigger with a visible Label for the field.",
                "Keep option labels short, parallel, and in sentence case.",
                "Order options logically (alphabetical, by frequency, or by magnitude).",
              ]}
            />
            <DoDont
              dos={[
                { caption: "Give the field a visible label and a descriptive placeholder." },
                { caption: "Group long lists with labels and a separator." },
              ]}
              donts={[
                { caption: "Don't use a Select for just 2–3 always-visible choices." },
              ]}
            />
            <States
              states={[
                { name: "Rest", node: <StateTrigger />, tokens: "bg-surface · border · text-tertiary (placeholder)" },
                { name: "Hover", node: <StateTrigger extra="border-border-hover text-secondary" />, tokens: "hover / open: border-border-hover · placeholder text-secondary" },
                { name: "Selected", node: <StateTrigger extra="text-foreground" placeholder="Select" />, tokens: "text-foreground (value set)" },
                { name: "Focus", node: <StateTrigger extra="border-border-focus ring-3 ring-border-focus/50" />, tokens: "focus-visible: border-border-focus · ring-3" },
                { name: "Disabled", node: <StateTrigger extra="opacity-50" />, tokens: "disabled: opacity-50 · cursor-not-allowed" },
              ]}
            />
            <WcagChecklist
              rows={[
                {
                  criterion: "Text contrast (1.4.3)",
                  status: "pass",
                  label: "AA",
                  detail: "Value foreground/surface ≈ 16:1; placeholder tertiary ≈ 4.6:1 (≥ 4.5).",
                },
                {
                  criterion: "Non-text contrast (1.4.11)",
                  status: "pass",
                  label: "AA",
                  detail: "Trigger border and focus ring meet ≥ 3:1 against adjacent colors.",
                },
                {
                  criterion: "Focus visible (2.4.7)",
                  status: "pass",
                  label: "AA",
                  detail: "Trigger shows a border-focus + 3px ring on keyboard focus.",
                },
                {
                  criterion: "Name, role, value (4.1.2)",
                  status: "pass",
                  label: "AA",
                  detail: "Radix exposes the trigger as a combobox with an associated listbox and the current value.",
                },
                {
                  criterion: "Labels / instructions (3.3.2)",
                  status: "note",
                  label: "AA · note",
                  detail: "The Select has no built-in label — you must pair a <Label htmlFor> (or aria-label) for the field.",
                },
                {
                  criterion: "Target size (2.5.8)",
                  status: "pass",
                  label: "AA",
                  detail: "Default trigger height ≈ 36px (≥ the 24px AA minimum).",
                },
              ]}
            />
          </>
        }
        dev={
          <>
            <Install
              code={`import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@cardboard";`}
            />
            <Variants variants={VARIANTS} />
            <PropsTable
              groups={[
                {
                  interfaceName: "Select",
                  rows: [
                    { name: "value?", type: "string", desc: "The selected value (controlled)." },
                    { name: "defaultValue?", type: "string", desc: "Initial value (uncontrolled)." },
                    { name: "onValueChange?", type: "(value: string) => void", desc: "Fires when the selection changes." },
                    { name: "disabled?", type: "boolean", default: "false", desc: "Disable the whole control." },
                  ],
                },
                {
                  interfaceName: "SelectTrigger",
                  rows: [
                    { name: "variant?", type: '"default" | "ghost"', default: '"default"', desc: "Bordered surface control, or borderless (text + chevron) for inline triggers." },
                    { name: "size?", type: '"default" | "sm"', default: '"default"', desc: "Trigger size (padding-driven height)." },
                    { name: "id?", type: "string", desc: "Select has no built-in label prop — to label the field, give the trigger an id and pair it with a sibling <Label htmlFor={id}>." },
                  ],
                },
                {
                  interfaceName: "SelectValue",
                  rows: [
                    { name: "placeholder?", type: "string", desc: "Shown when nothing is selected." },
                  ],
                },
                {
                  interfaceName: "SelectItem",
                  rows: [
                    { name: "value", type: "string", desc: "Unique value returned on select." },
                    { name: "disabled?", type: "boolean", default: "false", desc: "Disable an individual option." },
                  ],
                },
              ]}
            />
            <Accessibility
              keyboard={[
                { keys: ["Space", "↵"], does: "Opens the list / selects the focused option." },
                { keys: ["↑", "↓"], does: "Moves through options (opens the list if closed)." },
                { keys: ["Home", "End"], does: "Jumps to the first / last option." },
                { keys: ["A–Z"], does: "Typeahead — jumps to the option starting with the typed letters." },
                { keys: ["Esc"], does: "Closes the list without changing the selection." },
              ]}
              aria={[
                { attr: 'role="combobox"', on: "Trigger", purpose: "Identifies the control that opens a listbox." },
                { attr: "aria-expanded", on: "Trigger", purpose: "Reflects whether the list is open." },
                { attr: 'role="listbox"', on: "Content", purpose: "Identifies the popup list of options." },
                { attr: "aria-selected", on: "Each option", purpose: 'Set to "true" on the chosen option.' },
              ]}
              labeling={[
                "The Select has no built-in label — associate a <Label htmlFor> with the trigger's id, or pass aria-label.",
                "Give SelectValue a descriptive placeholder so an empty field still reads meaningfully.",
              ]}
              screenReader={[
                'The trigger announces as a combobox with its current value (or the placeholder) and expanded state.',
                "Options announce their label and selected state; typeahead moves the reading cursor.",
                "Disabled options are announced as dimmed and are not selectable.",
              ]}
              reducedMotion="The list's open/close is a short fade + zoom; it's subtle and respects the user's motion preferences."
              notes={[
                "Radix manages focus: focus returns to the trigger when the list closes.",
                "Typeahead and roving focus inside the list are handled for you.",
              ]}
            />
            <Changelog
              entries={[
                { version: "1.2", changes: ["Added a hover state to the default trigger — border darkens to border-hover and the placeholder lifts to text-secondary.", "The open menu (data-state=open) now holds the hover styling so the trigger stays active while the list is shown.", "Suppressed the trigger's focus ring after a pointer selection (kept for keyboard)."] },
                { version: "1.1", changes: ['Added the ghost trigger variant (borderless, for inline / toolbar triggers).'] },
                { version: "1.0", changes: ["Initial release — Radix-based single-select with grouped options, labels, and a padding-driven size."] },
              ]}
            />
          </>
        }
      />
    </ComponentPage>
  );
}
