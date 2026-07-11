"use client";

import { toast } from "sonner";
import { Toaster } from "@/components/cardboard/sonner";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function SonnerDocs() {
  return (
    <ComponentPage
      title="Sonner (Toast)"
      description="Transient notifications. The toast surface, text, and border are wired to Cardboard tokens; the status icons are Heroicons. Requires a <Toaster /> mounted once at the app root."
    >
      <Toaster />
      <Demo title="Variants" caption="Each fires a real toast (a Toaster is mounted on this page for the demo).">
        <div className="flex flex-wrap gap-2">
          <Button size="sm" variant="outline" onClick={() => toast("Event created")}>
            Default
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.success("Saved changes")}>
            Success
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.info("Heads up")}>
            Info
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.warning("Careful now")}>
            Warning
          </Button>
          <Button size="sm" variant="outline" onClick={() => toast.error("Something broke")}>
            Error
          </Button>
        </div>
      </Demo>

      <Demo title="With action">
        <Button
          size="sm"
          variant="outline"
          onClick={() =>
            toast("Archived conversation", {
              action: { label: "Undo", onClick: () => toast("Restored") },
            })
          }
        >
          Archive
        </Button>
      </Demo>
    </ComponentPage>
  );
}
