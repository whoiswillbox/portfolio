import { Textarea } from "@/components/cardboard/textarea";
import { ComponentPage, Demo } from "../_component-page";

export default function TextareaDocs() {
  return (
    <ComponentPage
      title="Textarea"
      description="A multi-line text field. Auto-grows with content and mirrors the Input's tokens."
    >
      <Demo title="Default">
        <div className="w-full max-w-md">
          <Textarea placeholder="Write a message…" />
        </div>
      </Demo>

      <Demo title="Disabled">
        <div className="w-full max-w-md">
          <Textarea placeholder="Unavailable" disabled />
        </div>
      </Demo>

      <Demo title="Invalid" caption="aria-invalid shows the error state.">
        <div className="w-full max-w-md">
          <Textarea defaultValue="Too short" aria-invalid />
        </div>
      </Demo>
    </ComponentPage>
  );
}
