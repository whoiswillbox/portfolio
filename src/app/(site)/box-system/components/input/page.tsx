import { Input } from "@/components/cardboard/input";
import { ComponentPage, Demo } from "../_component-page";

export default function InputDocs() {
  return (
    <ComponentPage
      title="Input"
      description="A single-line text field. Inherits the Cardboard border, focus, and disabled tokens."
    >
      <Demo title="Default">
        <div className="w-full max-w-sm">
          <Input placeholder="Enter your name…" />
        </div>
      </Demo>

      <Demo title="Types" caption="Standard HTML input types are supported.">
        <div className="flex w-full max-w-sm flex-col gap-3">
          <Input type="email" placeholder="you@example.com" />
          <Input type="password" placeholder="Password" />
          <Input type="number" placeholder="0" />
        </div>
      </Demo>

      <Demo title="Disabled">
        <div className="w-full max-w-sm">
          <Input placeholder="Unavailable" disabled />
        </div>
      </Demo>

      <Demo title="Invalid" caption="Set aria-invalid for the error state.">
        <div className="w-full max-w-sm">
          <Input placeholder="name@…" defaultValue="not-an-email" aria-invalid />
        </div>
      </Demo>
    </ComponentPage>
  );
}
