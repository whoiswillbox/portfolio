import { BoxLogo } from "@/components/box-logo";
import { ComponentPage, Demo, Specs } from "../_component-page";

export default function LogoDocs() {
  return (
    <ComponentPage
      title="Logo"
      description="The Box cube mark. An isometric 3-face cube that inherits color from currentColor; size with utility classes."
    >
      <Demo title="Sizes">
        <BoxLogo className="size-6 text-foreground" />
        <BoxLogo className="size-10 text-foreground" />
        <BoxLogo className="size-16 text-foreground" />
      </Demo>

      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3 font-semibold">Anatomy</h2>
        </div>
        <Specs
          rows={[
            { part: "Faces", spec: "3 paths (left, right, top) with graduated fill-opacity" },
            { part: "Color", spec: "currentColor — set via text-* utility" },
            { part: "Size", spec: "size-* (viewBox 0 0 24 28)" },
            { part: "Props", spec: "className" },
          ]}
        />
      </section>
    </ComponentPage>
  );
}
