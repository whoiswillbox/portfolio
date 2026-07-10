"use client";

import { RadioGroup, RadioGroupItem } from "@/components/cardboard/radio-group";
import { Label } from "@/components/cardboard/label";
import { ComponentPage, Demo } from "../_component-page";

export default function RadioGroupDocs() {
  return (
    <ComponentPage
      title="Radio Group"
      description="A set of options where exactly one may be selected. Fills with the solid action token when checked."
    >
      <Demo title="Default">
        <RadioGroup defaultValue="comfortable" className="max-w-xs">
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="default" />
            Default
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="comfortable" />
            Comfortable
          </Label>
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="compact" />
            Compact
          </Label>
        </RadioGroup>
      </Demo>

      <Demo title="Disabled">
        <RadioGroup defaultValue="a" className="max-w-xs">
          <Label className="flex items-center gap-2">
            <RadioGroupItem value="a" disabled />
            Selected & disabled
          </Label>
          <Label className="flex items-center gap-2 opacity-50">
            <RadioGroupItem value="b" disabled />
            Disabled
          </Label>
        </RadioGroup>
      </Demo>
    </ComponentPage>
  );
}
