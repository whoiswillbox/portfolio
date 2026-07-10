import { BoldIcon } from "@heroicons/react/24/outline";
import { Toggle } from "@/components/cardboard/toggle";
import { ComponentPage, Demo } from "../_component-page";

export default function ToggleDocs() {
  return (
    <ComponentPage
      title="Toggle"
      description="A two-state button that stays pressed. Uses the secondary surface for its on state."
    >
      <Demo title="Variants">
        <Toggle>Default</Toggle>
        <Toggle variant="outline">Outline</Toggle>
      </Demo>

      <Demo title="Sizes">
        <Toggle size="sm">Small</Toggle>
        <Toggle size="default">Default</Toggle>
        <Toggle size="lg">Large</Toggle>
      </Demo>

      <Demo title="With icon" caption="Defaults to pressed here.">
        <Toggle defaultPressed aria-label="Bold">
          <BoldIcon />
          Bold
        </Toggle>
      </Demo>

      <Demo title="Disabled">
        <Toggle disabled>Default</Toggle>
        <Toggle variant="outline" disabled>
          Outline
        </Toggle>
      </Demo>
    </ComponentPage>
  );
}
