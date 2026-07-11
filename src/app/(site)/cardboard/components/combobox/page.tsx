"use client";

import {
  Combobox,
  ComboboxInput,
  ComboboxContent,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
} from "@/components/cardboard/combobox";
import { ComponentPage, Demo } from "../_component-page";

const frameworks = [
  "Next.js",
  "SvelteKit",
  "Nuxt",
  "Remix",
  "Astro",
  "SolidStart",
];

export default function ComboboxDocs() {
  return (
    <ComponentPage
      title="Combobox"
      description="An autocomplete input with a filterable popup (built on @base-ui/react). The field, popup surface, highlighted item, and chips are wired to Cardboard tokens; icons are Heroicons."
    >
      <Demo title="Single select" caption="Type to filter, then pick one.">
        <div className="w-full max-w-xs">
          <Combobox items={frameworks}>
            <ComboboxInput placeholder="Pick a framework…" />
            <ComboboxContent>
              <ComboboxEmpty>No framework found.</ComboboxEmpty>
              <ComboboxList>
                {(item: string) => (
                  <ComboboxItem key={item} value={item}>
                    {item}
                  </ComboboxItem>
                )}
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
        </div>
      </Demo>
    </ComponentPage>
  );
}
