import { Spinner } from "@/components/cardboard/spinner";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function SpinnerDocs() {
  return (
    <ComponentPage
      title="Spinner"
      description="An indeterminate loading indicator. A spinning Heroicon that inherits color and size."
    >
      <Demo title="Sizes" caption="Control with size-* utilities.">
        <Spinner className="size-4" />
        <Spinner className="size-6" />
        <Spinner className="size-8" />
      </Demo>

      <Demo title="In a button" caption="Pair with a label for pending actions.">
        <Button disabled>
          <Spinner />
          Saving…
        </Button>
      </Demo>
    </ComponentPage>
  );
}
