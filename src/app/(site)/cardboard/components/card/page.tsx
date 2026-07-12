import { Button } from "@/components/cardboard/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "@/components/cardboard/card";
import { ComponentPage, Demo } from "../_component-page";

export default function CardDocs() {
  return (
    <ComponentPage
      title="Card"
      description="A surface that groups related content, with header, content, and footer slots."
    >
      <Demo title="Default">
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>Project Cardboard</CardTitle>
            <CardDescription>A living design system.</CardDescription>
            <CardAction>
              <Button variant="outline" size="sm">
                Open
              </Button>
            </CardAction>
          </CardHeader>
          <CardContent>
            <p className="text-tertiary">
              Cards use <span className="font-mono text-body-xs">bg-surface</span> with a
              subtle ring, and pad from a single <span className="font-mono text-body-xs">--card-spacing</span> var.
            </p>
          </CardContent>
          <CardFooter>
            <Button size="sm">Save</Button>
          </CardFooter>
        </Card>
      </Demo>

      <Demo title="Small" caption="size='sm' tightens the internal spacing.">
        <Card size="sm" className="w-full max-w-xs">
          <CardHeader>
            <CardTitle>Compact card</CardTitle>
            <CardDescription>Tighter padding for dense layouts.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-tertiary">Same anatomy, smaller rhythm.</p>
          </CardContent>
        </Card>
      </Demo>
    </ComponentPage>
  );
}
