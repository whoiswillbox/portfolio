import { TngsLogo } from "@/components/tngs-logo";
import { ComponentPage, Demo, Specs } from "../_component-page";

export default function LogoDocs() {
  return (
    <ComponentPage
      title="Logo"
      description="The Technergetics (TNGS) mark. Inherits color from currentColor; size with utility classes."
    >
      <Demo title="Sizes">
        <TngsLogo className="h-6 w-auto text-foreground" />
        <TngsLogo className="h-10 w-auto text-foreground" />
        <TngsLogo className="h-16 w-auto text-foreground" />
      </Demo>

      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3 font-semibold">Anatomy</h2>
        </div>
        <Specs
          rows={[
            { part: "Color", spec: "currentColor — set via text-* utility" },
            { part: "Size", spec: "h-* w-auto (scales to the type it sits beside)" },
            { part: "Props", spec: "className" },
          ]}
        />
      </section>
    </ComponentPage>
  );
}
