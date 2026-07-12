import { CopyToken } from "@/components/copy-token";
import { ComponentPage, Demo, Specs } from "../_component-page";

export default function CopyTokenDocs() {
  return (
    <ComponentPage
      title="Copy Token"
      description="A monospace token name that copies itself on click — used throughout these reference pages."
    >
      <Demo title="Default" caption="Click to copy; shows a check for a beat.">
        <CopyToken value="bg-surface" />
        <CopyToken value="text-foreground" />
        <CopyToken value="--color-fill-solid" />
      </Demo>

      <Demo title="Copy a different value" caption="Show one label, copy another (copyValue).">
        <CopyToken value="icon-critical" copyValue="text-icon-critical" />
      </Demo>

      <section className="mb-12 flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="text-h3">Anatomy</h2>
        </div>
        <Specs
          rows={[
            { part: "Label", spec: "font-mono · text-body-xs · text-foreground" },
            { part: "Container", spec: "rounded-md · px-1.5 py-0.5 · hover:bg-muted" },
            { part: "Copy icon", spec: "size-3 · text-muted-foreground (fades in on hover)" },
            { part: "Copied icon", spec: "CheckIcon · size-3 · text-success" },
          ]}
        />
      </section>
    </ComponentPage>
  );
}
