"use client";

import { Switch } from "@/components/cardboard/switch";
import { Label } from "@/components/ui/label";
import { ComponentPage, Demo } from "../_component-page";

export default function SwitchDocs() {
  return (
    <ComponentPage
      title="Switch"
      description="A toggle for a single on/off setting. Uses the solid action fill when checked."
    >
      <Demo title="Default">
        <Switch defaultChecked />
        <Switch />
      </Demo>

      <Demo title="Sizes" caption="sm and default.">
        <Switch size="sm" defaultChecked />
        <Switch size="default" defaultChecked />
      </Demo>

      <Demo title="With label">
        <Label className="flex items-center gap-2">
          <Switch defaultChecked />
          Notifications
        </Label>
      </Demo>

      <Demo title="Disabled">
        <Switch defaultChecked disabled />
        <Switch disabled />
      </Demo>
    </ComponentPage>
  );
}
