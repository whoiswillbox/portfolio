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
      description="Vertically stacked sections that expand and collapse. Three variants unify the collapsible styles used across the app."
    >
      <Demo
        title="Default"
        caption="Bordered sections with a down/up chevron — for FAQs and standalone section lists."
      >
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
        </Accordion>
      </Demo>

      <Demo
        title="Inline"
        caption="A compact, muted row disclosure with a rotating chevron — for revealing extra detail in dense reference tables (e.g. the Typography primitives)."
      >
        <Accordion variant="inline" type="single" collapsible className="w-full max-w-md">
          <AccordionItem value="a">
            <AccordionTrigger>Primitives</AccordionTrigger>
            <AccordionContent className="pl-5.5">
              The raw values a token resolves to — family, size, leading, weight.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Demo>
    </ComponentPage>
  );
}
