import { AspectRatio } from "@/components/cardboard/aspect-ratio";
import { ComponentPage, Demo } from "../_component-page";

export default function AspectRatioDocs() {
  return (
    <ComponentPage
      title="Aspect Ratio"
      description="Constrains its content to a fixed width-to-height ratio."
    >
      <Demo title="16 / 9">
        <div className="w-full max-w-md">
          <AspectRatio ratio={16 / 9}>
            <div className="flex size-full items-center justify-center rounded-lg bg-surface-secondary text-body-sm text-tertiary">
              16 / 9
            </div>
          </AspectRatio>
        </div>
      </Demo>

      <Demo title="1 / 1">
        <div className="w-40">
          <AspectRatio ratio={1}>
            <div className="flex size-full items-center justify-center rounded-lg bg-surface-secondary text-body-sm text-tertiary">
              1 / 1
            </div>
          </AspectRatio>
        </div>
      </Demo>
    </ComponentPage>
  );
}
