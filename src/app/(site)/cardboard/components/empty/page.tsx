import { InboxIcon } from "@heroicons/react/24/outline";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/cardboard/empty";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function EmptyDocs() {
  return (
    <ComponentPage
      title="Empty"
      description="An empty-state layout — icon, title, description, and an optional action."
    >
      <Demo title="Default">
        <Empty className="max-w-md border">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <InboxIcon />
            </EmptyMedia>
            <EmptyTitle>No messages yet</EmptyTitle>
            <EmptyDescription>
              When you receive messages, they&apos;ll show up here.
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button size="sm">Compose</Button>
          </EmptyContent>
        </Empty>
      </Demo>
    </ComponentPage>
  );
}
