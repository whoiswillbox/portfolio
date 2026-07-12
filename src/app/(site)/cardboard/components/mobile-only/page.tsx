import { ComponentPage, Demo, Specs } from "../_component-page";

export default function MobileOnlyDocs() {
  return (
    <ComponentPage
      title="Mobile Only"
      description="A wrapper that renders its children only on mobile; on larger screens it redirects to a fallback route."
    >
      <Demo title="Behavior" caption="Nothing renders here — this is a behavioral wrapper, not a visual component.">
        <p className="text-body-sm text-muted-foreground">
          On mobile, renders <span className="font-mono text-body-xs">children</span>. On desktop,
          redirects to the <span className="font-mono text-body-xs">fallback</span> route.
        </p>
      </Demo>

      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">Anatomy</h2>
        </div>
        <Specs
          rows={[
            { part: "children", spec: "ReactNode — shown only on mobile viewports" },
            { part: "fallback", spec: "string — desktop redirect target" },
            { part: "Use", spec: "mobile-only index pages (Experience, School, Extras)" },
          ]}
        />
      </section>
    </ComponentPage>
  );
}
