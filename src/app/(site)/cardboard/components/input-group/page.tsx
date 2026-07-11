import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupButton,
} from "@/components/cardboard/input-group";
import { ComponentPage, Demo } from "../_component-page";

export default function InputGroupDocs() {
  return (
    <ComponentPage
      title="Input Group"
      description="An input with attached addons — icons, text, or buttons — inside a single bordered field. The whole group shares one focus ring."
    >
      <Demo title="Icon addon">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <MagnifyingGlassIcon />
          </InputGroupAddon>
          <InputGroupInput placeholder="Search…" />
        </InputGroup>
      </Demo>

      <Demo title="Text prefix">
        <InputGroup className="max-w-xs">
          <InputGroupAddon>
            <InputGroupText>https://</InputGroupText>
          </InputGroupAddon>
          <InputGroupInput placeholder="whoiswillbox.com" />
        </InputGroup>
      </Demo>

      <Demo title="Trailing button">
        <InputGroup className="max-w-xs">
          <InputGroupInput placeholder="Enter a coupon" />
          <InputGroupAddon align="inline-end">
            <InputGroupButton variant="outline">Apply</InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </Demo>
    </ComponentPage>
  );
}
