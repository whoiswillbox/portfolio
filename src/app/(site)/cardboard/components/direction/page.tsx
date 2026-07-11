import { ComponentPage, Demo, Specs } from "../_component-page";

export default function DirectionDocs() {
  return (
    <ComponentPage
      title="Direction"
      description="A provider that tells Radix components whether the layout is left-to-right or right-to-left. Wrap the app (or a subtree) once; components read it via context. No visual output of its own."
    >
      <Demo title="RTL subtree" caption="Everything inside inherits dir='rtl' — note the mirrored alignment.">
        <div dir="rtl" className="w-full rounded-lg border border-border p-4 text-body-sm">
          <p className="font-medium">مرحبا بك</p>
          <p className="text-muted-foreground">Text and Radix components flow right-to-left.</p>
        </div>
      </Demo>

      <div className="mt-2">
        <Specs
          rows={[
            { part: "DirectionProvider", spec: "wraps a subtree; accepts dir or direction ('ltr' | 'rtl')" },
            { part: "useDirection()", spec: "hook returning the current direction from context" },
            { part: "Styling", spec: "none — behavioral primitive only" },
          ]}
        />
      </div>
    </ComponentPage>
  );
}
