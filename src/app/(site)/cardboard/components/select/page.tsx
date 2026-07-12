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
} from "@/components/cardboard/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/cardboard/tabs";
import { Switch } from "@/components/cardboard/switch";
import { Input } from "@/components/cardboard/input";
import { Label } from "@/components/cardboard/label";
import { ComponentPage, Demo, Specs } from "../_component-page";

/* ---- Overview tab ------------------------------------------------------- */

function Overview() {
  return (
    <div className="flex flex-col gap-2">
      <Demo title="Default">
        <Select defaultValue="apple">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="pear">Pear</SelectItem>
          </SelectContent>
        </Select>
      </Demo>

      <Demo title="Grouped" caption="Group options with a label and separator.">
        <Select>
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
      </Demo>

      <Demo title="Small & disabled">
        <Select disabled>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Unavailable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      </Demo>

      <section className="mt-4 flex flex-col gap-2">
        <h2 className="text-h3">Usage</h2>
        <p className="text-body-sm text-muted-foreground">
          Use a Select when a user picks a single value from a known,
          moderately-sized list. For a handful of options prefer a
          radio group; for many searchable options prefer a Combobox.
        </p>
      </section>
    </div>
  );
}

/* ---- Properties tab (live) ---------------------------------------------- */

type PropRow = {
  name: string;
  type: string;
  def?: string;
  desc: string;
};

const props: PropRow[] = [
  { name: "label", type: "string", desc: "Paired <Label> above the trigger (via htmlFor). Not a Select prop — compose it alongside." },
  { name: "value / defaultValue", type: "string", desc: "Controlled / uncontrolled selected value." },
  { name: "onValueChange", type: "(value: string) => void", desc: "Fires when the selection changes." },
  { name: "disabled", type: "boolean", def: "false", desc: "Disables the whole control." },
  { name: "size", type: '"default" | "sm"', def: '"default"', desc: "Trigger size (padding-driven height)." },
  { name: "placeholder", type: "string", desc: "Shown by SelectValue when nothing is selected." },
];

function Properties() {
  const [size, setSize] = React.useState<"default" | "sm">("default");
  const [disabled, setDisabled] = React.useState(false);
  const [placeholder, setPlaceholder] = React.useState("Pick a fruit");
  const [label, setLabel] = React.useState("Date range");
  const [value, setValue] = React.useState<string | undefined>(undefined);

  return (
    <div className="flex flex-col gap-6">
      {/* Live preview driven by the controls below */}
      <div className="flex min-h-40 items-center justify-center rounded-xl border border-border bg-background p-6">
        <div className="flex flex-col gap-1.5">
          {label && <Label htmlFor="preview-select">{label}</Label>}
          <Select
            value={value}
            onValueChange={setValue}
            disabled={disabled}
          >
            <SelectTrigger id="preview-select" size={size} className="w-56">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
              <SelectItem value="pear">Pear</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Controls */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ctl-label">label</Label>
          <Input
            id="ctl-label"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ctl-size">size</Label>
          <Select value={size} onValueChange={(v) => setSize(v as "default" | "sm")}>
            <SelectTrigger id="ctl-size" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="default">default</SelectItem>
              <SelectItem value="sm">sm</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex flex-col gap-1.5">
          <Label htmlFor="ctl-placeholder">placeholder</Label>
          <Input
            id="ctl-placeholder"
            value={placeholder}
            onChange={(e) => setPlaceholder(e.target.value)}
          />
        </div>

        <div className="flex items-center justify-between rounded-lg border border-border px-3 py-2 sm:col-span-2">
          <Label htmlFor="ctl-disabled" className="cursor-pointer">
            disabled
          </Label>
          <Switch
            id="ctl-disabled"
            checked={disabled}
            onCheckedChange={setDisabled}
          />
        </div>
      </div>

      {/* Reference table */}
      <div className="flex flex-col gap-2">
        <h3 className="text-body-sm font-medium text-foreground">All props</h3>
        <div className="overflow-x-auto rounded-lg border border-border">
          <table className="w-full min-w-[32rem] text-left text-body-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50 font-mono text-body-xs text-muted-foreground">
                <th className="px-4 py-2 font-normal">Prop</th>
                <th className="px-4 py-2 font-normal">Type</th>
                <th className="px-4 py-2 font-normal">Default</th>
                <th className="px-4 py-2 font-normal">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {props.map((p) => (
                <tr key={p.name}>
                  <td className="px-4 py-2 font-mono text-body-xs text-foreground">{p.name}</td>
                  <td className="px-4 py-2 font-mono text-body-xs text-muted-foreground">{p.type}</td>
                  <td className="px-4 py-2 font-mono text-body-xs text-muted-foreground">{p.def ?? "—"}</td>
                  <td className="px-4 py-2 text-muted-foreground">{p.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ---- Specs tab ---------------------------------------------------------- */

/* Redline padding diagram (Polaris-style). AUTO-UPDATING: it measures a live,
   real SelectTrigger with getComputedStyle at runtime, so whatever padding/gap/
   height the component actually renders is what the diagram draws. Change the
   component's spacing and this reflects it with no edits here. Thin red guide
   lines run through the trigger at each boundary; brackets + px values float
   above; height caliper on the right. */
const RED = "oklch(0.58 0.22 22)";

type Measured = {
  padL: number;
  padR: number;
  padT: number;
  padB: number;
  gap: number;
  triH: number;
  contentH: number;
  radius: number;
  labelW: number;
  chevW: number;
};

function PaddingCallout() {
  const ref = React.useRef<HTMLDivElement>(null);
  const [m, setM] = React.useState<Measured | null>(null);

  React.useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;
    const trigger = root.querySelector<HTMLElement>("[data-slot=select-trigger]");
    const label = root.querySelector<HTMLElement>("[data-diagram=label]");
    const chev = trigger?.querySelector<HTMLElement>("svg");
    if (!trigger || !label || !chev) return;

    const cs = getComputedStyle(trigger);
    const padT = parseFloat(cs.paddingTop);
    const padB = parseFloat(cs.paddingBottom);
    const triH = trigger.getBoundingClientRect().height;
    setM({
      padL: parseFloat(cs.paddingLeft),
      padR: parseFloat(cs.paddingRight),
      padT,
      padB,
      gap: parseFloat(cs.columnGap || cs.gap || "0"),
      triH,
      contentH: triH - padT - padB,
      radius: parseFloat(cs.borderTopLeftRadius),
      labelW: label.getBoundingClientRect().width,
      chevW: chev.getBoundingClientRect().width,
    });
  }, []);

  const round = (n: number) => Math.round(n);
  const mono = { fontSize: 9, fontWeight: 600, fontFamily: "var(--font-family-mono)" as const };

  return (
    <div>
      {/* Hidden real trigger — the source of truth we measure. */}
      <div ref={ref} className="pointer-events-none absolute h-0 w-0 overflow-hidden opacity-0" aria-hidden>
        <Select defaultValue="apple">
          <SelectTrigger>
            <span data-diagram="label">Apple</span>
          </SelectTrigger>
        </Select>
      </div>

      <div className="flex justify-center rounded-xl border border-border bg-background p-6">
        {m && <Diagram m={m} round={round} mono={mono} />}
      </div>
    </div>
  );
}

function Diagram({
  m,
  round,
  mono,
}: {
  m: Measured;
  round: (n: number) => number;
  mono: React.CSSProperties;
}) {
  const { padL, padR, padT, gap, triH, radius, labelW, chevW } = m;

  // Vertical layout (all in real px — the SVG renders 1:1, no scaling).
  const brY = 22; // top bracket line
  const triY = 52; // trigger top
  const triB = triY + triH;
  const cyT = triY + padT; // content top boundary
  const cyB = triB - m.padB; // content bottom boundary

  // Horizontal boundaries left→right, from measured values.
  const x0 = 60; // trigger left edge (room for py caliper + radius leader)
  const bx1 = x0 + padL; // content start
  const bx2 = bx1 + labelW; // gap start
  const bx3 = bx2 + gap; // chevron start
  const bx4 = bx3 + chevW; // right pad start
  const x1 = bx4 + padR; // trigger right edge

  const W = x1 + 52;
  const H = triB + 34; // room below for the radius annotation

  const GUIDE = { stroke: RED, strokeWidth: 0.5, strokeOpacity: 0.4 };
  const MARK = { stroke: RED, strokeWidth: 0.75, fill: "none" as const };

  // Horizontal measure — mirrors vMeasure (rotated): a ⊓ bracket (short caps +
  // bar) with the value centered above. Cap depth matches vMeasure (6).
  const hMeasure = (xa: number, xb: number, value: string, key: string) => (
    <g key={key}>
      <path d={`M${xa},${brY + 6} L${xa},${brY} L${xb},${brY} L${xb},${brY + 6}`} {...MARK} />
      <text x={(xa + xb) / 2} y={brY - 4} textAnchor="middle" fill={RED} style={mono}>{value}</text>
    </g>
  );

  // Vertical measure — a ⊏ bracket: bar on the OUTER (left) side, caps pointing
  // RIGHT toward the trigger. Mirrors hMeasure, whose caps point down toward the
  // trigger. Value connected on the outer (left) side.
  const vMeasure = (ya: number, yb: number, x: number, value: string, key: string) => (
    <g key={key}>
      <path d={`M${x + 6},${ya} L${x},${ya} L${x},${yb} L${x + 6},${yb}`} {...MARK} />
      <text x={x - 3} y={(ya + yb) / 2} dominantBaseline="central" textAnchor="end" fill={RED} style={mono}>{value}</text>
    </g>
  );

  // Radius: fill the actual BOTTOM-left rounded corner (a solid wedge that hugs
  // the curve). The value sits directly below the corner, centered under it —
  // no diagonal leader (that read as broken). Matches the clean bracket system.
  const r = radius;
  // Solid quarter-disk hugging the rounded corner: centered at the arc center
  // (x0+r, triB-r). The fill arc radius is nudged +1 so it meets the trigger's
  // stroke with no whitespace sliver between them.
  const rcx = x0 + r;
  const rcy = triB - r;
  // Fill radius = the true corner radius, so the wedge sits INSIDE the rounded
  // border (not overhanging it). Half a px in keeps it under the stroke.
  const rFill = r - 0.5;
  const radiusFill = `M${rcx},${rcy} L${rcx - rFill},${rcy} A${rFill},${rFill} 0 0 0 ${rcx},${rcy + rFill} Z`;

  // Uniform display scale: geometry stays 1:1-accurate (measured px); the whole
  // SVG is enlarged proportionally so annotations are legible.
  const SCALE = 2.4;

  return (
    <svg
      viewBox={`0 0 ${W} ${H}`}
      width={W * SCALE}
      height={H * SCALE}
      className="h-auto max-w-full"
      role="img"
      aria-label="Select trigger spec diagram"
    >
      {/* faint through-lines: each vertical boundary dropped down across the
          trigger, plus the horizontal padding-band edges — the "redlines going
          through the component". Drawn first so the trigger rect sits on top. */}
      {[x0, bx1, bx2, bx3, bx4, x1].map((gx) => (
        <line key={`vg${gx}`} x1={gx} y1={brY + 6} x2={gx} y2={triB} {...GUIDE} />
      ))}
      {[cyT, cyB].map((gy) => (
        <line key={`hg${gy}`} x1={x0 - 10} y1={gy} x2={x1} y2={gy} {...GUIDE} />
      ))}

      {/* top brackets: px(padL) · gap · px(padR) */}
      {hMeasure(x0, bx1, String(round(padL)), "pl")}
      {hMeasure(bx2, bx3, String(round(gap)), "gap")}
      {hMeasure(bx4, x1, String(round(padR)), "pr")}

      {/* radius: solid corner wedge + short connector down to the value,
          same connected style as the px/py bracket values */}
      <path d={radiusFill} fill={RED} fillOpacity={0.9} />
      <line x1={rcx} y1={triB} x2={rcx} y2={triB + 12} {...MARK} />
      <text x={rcx} y={triB + 24} textAnchor="middle" fill={RED} style={mono}>{round(radius)}</text>

      {/* trigger outline (drawn over the guides) */}
      <rect x={x0} y={triY} width={x1 - x0} height={triH} rx={radius} className="fill-none stroke-border" strokeWidth={1} />
      <text x={bx1} y={triY + triH / 2} dominantBaseline="central" className="fill-foreground" style={{ fontSize: 13, fontWeight: 500 }}>Apple</text>
      <text x={bx3 + chevW / 2} y={triY + triH / 2} dominantBaseline="central" textAnchor="middle" className="fill-subtle" style={{ fontSize: 11 }}>▾</text>

      {/* left py calipers — top + bottom padding bands, value connected */}
      {vMeasure(triY, cyT, x0 - 10, String(round(padT)), "pyT")}
      {vMeasure(cyB, triB, x0 - 10, String(round(m.padB)), "pyB")}

      {/* right height caliper */}
      <path
        d={`M${x1 + 12},${triY} L${x1 + 12},${triB} M${x1 + 9},${triY} L${x1 + 15},${triY} M${x1 + 9},${triB} L${x1 + 15},${triB}`}
        {...MARK}
      />
      <text x={x1 + 19} y={triY + triH / 2} dominantBaseline="central" fill={RED} style={mono}>{round(triH)}</text>
    </svg>
  );
}

function SpecsTab() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h3 className="text-body-sm font-medium text-foreground">Trigger</h3>
        <PaddingCallout />
        <Specs
          rows={[
            { part: "Radius", spec: "rounded-lg (--radius-lg); sm → min(--radius-md, 10px)" },
            { part: "Border", spec: "border-border · focus: border-border-focus" },
            { part: "Background", spec: "bg-transparent" },
            { part: "Text", spec: "text-sm · placeholder text-tertiary" },
            { part: "Padding (px)", spec: "--space-200 (8px) · gap --space-150 (6px)" },
            { part: "Padding (py)", spec: "default --space-150 (6px) · sm --space-100 (4px) — drives height" },
            { part: "Height", spec: "not fixed — derived from py + text line-height (change py → resizes)" },
            { part: "Focus ring", spec: "ring-3 ring-border-focus/50" },
            { part: "Invalid", spec: "border-critical · ring-critical/20" },
            { part: "Disabled", spec: "opacity-50 · cursor-not-allowed" },
            { part: "Chevron", spec: "ChevronDownIcon size-4 text-tertiary" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-body-sm font-medium text-foreground">Content (menu)</h3>
        <Specs
          rows={[
            { part: "Radius", spec: "rounded-lg (--radius-lg)" },
            { part: "Background", spec: "bg-surface · text-foreground" },
            { part: "Elevation", spec: "shadow-md · ring-1 ring-foreground/10" },
            { part: "Min width", spec: "min-w-36 (popper: matches trigger width)" },
            { part: "Position", spec: "popper · align start · sideOffset 4" },
            { part: "Group padding", spec: "--space-100 (4px) (SelectGroup)" },
          ]}
        />
      </div>

      <div className="flex flex-col gap-2">
        <h3 className="text-body-sm font-medium text-foreground">Item / Label / Separator</h3>
        <Specs
          rows={[
            { part: "Item radius", spec: "rounded-md (--radius-md)" },
            { part: "Item padding", spec: "py --space-100 (4px) · pl --space-150 (6px) · pr --space-800 (32px) · gap --space-150" },
            { part: "Item text", spec: "text-sm" },
            { part: "Item highlight", spec: "focus:bg-surface-secondary focus:text-foreground" },
            { part: "Item disabled", spec: "opacity-50 · pointer-events-none" },
            { part: "Check", spec: "CheckIcon size-4, absolute right-2" },
            { part: "Label", spec: "px --space-150 (6px) · py --space-100 (4px) · text-xs text-tertiary" },
            { part: "Separator", spec: "h-px bg-border · my --space-100 (4px)" },
          ]}
        />
      </div>
    </div>
  );
}

export default function SelectDocs() {
  return (
    <ComponentPage
      title="Select"
      description="A dropdown for choosing one option from a list. Fully keyboard-accessible; check + chevrons are Heroicons."
    >
      <Tabs defaultValue="overview">
        <TabsList className="mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="properties">Properties</TabsTrigger>
          <TabsTrigger value="specs">Specs</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Overview />
        </TabsContent>
        <TabsContent value="properties">
          <Properties />
        </TabsContent>
        <TabsContent value="specs">
          <SpecsTab />
        </TabsContent>
      </Tabs>
    </ComponentPage>
  );
}
