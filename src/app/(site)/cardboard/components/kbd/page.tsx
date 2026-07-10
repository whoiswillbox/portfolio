import { Kbd, KbdGroup } from "@/components/cardboard/kbd";
import { ComponentPage, Demo } from "../_component-page";

export default function KbdDocs() {
  return (
    <ComponentPage
      title="Kbd"
      description="Represents a keyboard key or shortcut. Group keys for combinations."
    >
      <Demo title="Single keys">
        <Kbd>⌘</Kbd>
        <Kbd>Esc</Kbd>
        <Kbd>↵</Kbd>
      </Demo>

      <Demo title="Shortcut" caption="Group keys into a combination.">
        <KbdGroup>
          <Kbd>⌘</Kbd>
          <Kbd>K</Kbd>
        </KbdGroup>
      </Demo>
    </ComponentPage>
  );
}
