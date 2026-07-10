import { BoldIcon, ItalicIcon, UnderlineIcon } from "@heroicons/react/24/outline";
import { ToggleGroup, ToggleGroupItem } from "@/components/cardboard/toggle-group";
import { ComponentPage, Demo } from "../_component-page";

export default function ToggleGroupDocs() {
  return (
    <ComponentPage
      title="Toggle Group"
      description="A set of toggles that share state — single or multiple selection. Styled from the Toggle component."
    >
      <Demo title="Multiple" caption="Any number can be pressed.">
        <ToggleGroup type="multiple" defaultValue={["bold"]}>
          <ToggleGroupItem value="bold" aria-label="Bold">
            <BoldIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="italic" aria-label="Italic">
            <ItalicIcon />
          </ToggleGroupItem>
          <ToggleGroupItem value="underline" aria-label="Underline">
            <UnderlineIcon />
          </ToggleGroupItem>
        </ToggleGroup>
      </Demo>

      <Demo title="Single, outline, joined" caption="One at a time; spacing=0 joins them into a segmented control.">
        <ToggleGroup type="single" variant="outline" spacing={0} defaultValue="left">
          <ToggleGroupItem value="left">Left</ToggleGroupItem>
          <ToggleGroupItem value="center">Center</ToggleGroupItem>
          <ToggleGroupItem value="right">Right</ToggleGroupItem>
        </ToggleGroup>
      </Demo>
    </ComponentPage>
  );
}
