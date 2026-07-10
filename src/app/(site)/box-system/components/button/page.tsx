import { PlusIcon } from "@heroicons/react/24/outline";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

const VARIANTS = ["default", "outline", "secondary", "ghost", "destructive", "link"] as const;
const SIZES = ["xs", "sm", "default", "lg"] as const;

export default function ButtonDocs() {
  return (
    <ComponentPage
      title="Button"
      description="Triggers an action. The default is a solid fill; use quieter variants to de-emphasize."
    >
      <Demo title="Variants" caption="Pick by emphasis — default for the primary action, ghost / link for the quietest.">
        {VARIANTS.map((v) => (
          <Button key={v} variant={v}>
            {v}
          </Button>
        ))}
      </Demo>

      <Demo title="Sizes" caption="xs → lg. The default suits most UI.">
        {SIZES.map((s) => (
          <Button key={s} size={s}>
            Button
          </Button>
        ))}
      </Demo>

      <Demo title="With icon" caption="Icons inherit size and sit inline with the label.">
        <Button>
          <PlusIcon />
          New item
        </Button>
        <Button variant="outline">
          <PlusIcon />
          Add
        </Button>
        <Button size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
      </Demo>

      <Demo title="Disabled" caption="Non-interactive; dimmed and pointer-events off.">
        <Button disabled>Default</Button>
        <Button variant="outline" disabled>
          Outline
        </Button>
      </Demo>
    </ComponentPage>
  );
}
