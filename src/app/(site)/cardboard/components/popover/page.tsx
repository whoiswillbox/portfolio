import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverTitle,
  PopoverDescription,
} from "@/components/cardboard/popover";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function PopoverDocs() {
  return (
    <ComponentPage
      title="Popover"
      description="Floating content anchored to a trigger — richer than a tooltip, dismissible on outside click."
    >
      <Demo title="Default">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline">Open popover</Button>
          </PopoverTrigger>
          <PopoverContent>
            <PopoverHeader>
              <PopoverTitle>Dimensions</PopoverTitle>
              <PopoverDescription>Set the width and height for the layer.</PopoverDescription>
            </PopoverHeader>
          </PopoverContent>
        </Popover>
      </Demo>
    </ComponentPage>
  );
}
