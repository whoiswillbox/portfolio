import { ComponentPage, Demo, Specs } from "../_component-page";

export default function ContentCardDocs() {
  return (
    <ComponentPage
      title="Content Card"
      description="The full-height page surface every content route sits inside — a rounded, ringed panel with an internal scroll area. Used by 35+ routes."
    >
      <Demo title="Preview" caption="A scaled-down stand-in — ContentCard fills its parent's full height in real use.">
        <div className="h-48 w-full max-w-md overflow-hidden rounded-xl bg-sidebar shadow-lg ring-1 ring-sidebar-border">
          <div className="h-full overflow-auto p-6 text-body-sm text-muted-foreground">
            <p className="mb-2 text-body-md font-medium text-foreground">Page content</p>
            <p>Scrolls inside the card. The outer panel clips; the inner div owns the scroll.</p>
          </div>
        </div>
      </Demo>

      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3 font-semibold">Anatomy</h2>
        </div>
        <Specs
          rows={[
            { part: "Panel (desktop)", spec: "sm:bg-sidebar · sm:rounded-xl · sm:shadow-lg · sm:ring-1 sm:ring-sidebar-border" },
            { part: "Height", spec: "h-full · min-h-0 · overflow-hidden (fills the route)" },
            { part: "Scroll area", spec: "inner div: h-full · overflow-auto · data-scroll-container" },
            { part: "Mobile", spec: "max-sm:pb-24 (clears the floating nav); no panel chrome" },
          ]}
        />
      </section>
    </ComponentPage>
  );
}
