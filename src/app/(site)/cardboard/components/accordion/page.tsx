import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/cardboard/accordion";
import { ComponentPage, Demo } from "../_component-page";

export default function AccordionDocs() {
  return (
    <ComponentPage
      title="Accordion"
      description="Vertically stacked sections that expand and collapse. Chevrons are Heroicons."
    >
      <Demo title="Default">
        <Accordion type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>What is Cardboard?</AccordionTrigger>
            <AccordionContent>
              Cardboard is this portfolio&apos;s design system — tokens, foundations, and
              owned components.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="b">
            <AccordionTrigger>Is it built on shadcn?</AccordionTrigger>
            <AccordionContent>
              It started from shadcn/ui, then each component was forked and rewired to
              Cardboard tokens.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="c">
            <AccordionTrigger>Can multiple open at once?</AccordionTrigger>
            <AccordionContent>Set type=&quot;multiple&quot; to allow it.</AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>
    </ComponentPage>
  );
}
