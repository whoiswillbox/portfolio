import { Separator } from "@/components/cardboard/separator";
import { ComponentPage, Demo } from "../_component-page";

export default function SeparatorDocs() {
  return (
    <ComponentPage
      title="Separator"
      description="A thin rule that divides content. Uses the Cardboard border token."
    >
      <Demo title="Horizontal">
        <div className="w-full max-w-sm">
          <p className="text-body-sm text-subtle">Above</p>
          <Separator className="my-3" />
          <p className="text-body-sm text-subtle">Below</p>
        </div>
      </Demo>

      <Demo title="Vertical">
        <div className="flex h-8 items-center gap-3 text-body-sm text-subtle">
          <span>Home</span>
          <Separator orientation="vertical" />
          <span>Docs</span>
          <Separator orientation="vertical" />
          <span>Settings</span>
        </div>
      </Demo>
    </ComponentPage>
  );
}
