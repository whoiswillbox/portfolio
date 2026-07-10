"use client";

import { Checkbox } from "@/components/cardboard/checkbox";
import { Label } from "@/components/cardboard/label";
import { ComponentPage, Demo } from "../_component-page";

export default function CheckboxDocs() {
  return (
    <ComponentPage
      title="Checkbox"
      description="A boolean control. Fills with the solid action token when checked; the check is a Heroicon."
    >
      <Demo title="Default">
        <Checkbox defaultChecked />
        <Checkbox />
      </Demo>

      <Demo title="With label">
        <Label className="flex items-center gap-2">
          <Checkbox defaultChecked />
          Accept terms
        </Label>
      </Demo>

      <Demo title="Disabled">
        <Checkbox defaultChecked disabled />
        <Checkbox disabled />
      </Demo>

      <Demo title="Invalid" caption="aria-invalid shows the error border.">
        <Checkbox aria-invalid />
      </Demo>
    </ComponentPage>
  );
}
