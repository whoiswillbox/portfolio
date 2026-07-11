import {
  ButtonGroup,
  ButtonGroupText,
  ButtonGroupSeparator,
} from "@/components/cardboard/button-group";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function ButtonGroupDocs() {
  return (
    <ComponentPage
      title="Button Group"
      description="Joins buttons (and inputs, selects, text) into a single segmented control — shared borders, radii only on the ends."
    >
      <Demo title="Buttons">
        <ButtonGroup>
          <Button variant="outline">Left</Button>
          <Button variant="outline">Center</Button>
          <Button variant="outline">Right</Button>
        </ButtonGroup>
      </Demo>

      <Demo title="With text addon" caption="A muted label segment glued to a button.">
        <ButtonGroup>
          <ButtonGroupText>https://</ButtonGroupText>
          <Button variant="outline">whoiswillbox.com</Button>
        </ButtonGroup>
      </Demo>

      <Demo title="With separator" caption="A rule between segments in the same group.">
        <ButtonGroup>
          <Button variant="outline">Copy</Button>
          <ButtonGroupSeparator />
          <Button variant="outline">Paste</Button>
        </ButtonGroup>
      </Demo>

      <Demo title="Vertical">
        <ButtonGroup orientation="vertical">
          <Button variant="outline">Top</Button>
          <Button variant="outline">Middle</Button>
          <Button variant="outline">Bottom</Button>
        </ButtonGroup>
      </Demo>
    </ComponentPage>
  );
}
