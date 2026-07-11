"use client";

import { CalendarIcon, UserIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandSeparator,
  CommandShortcut,
} from "@/components/cardboard/command";
import { ComponentPage, Demo } from "../_component-page";

export default function CommandDocs() {
  return (
    <ComponentPage
      title="Command"
      description="A fast, filterable command palette (built on cmdk). The surface, selected-item highlight, and search field are wired to Cardboard tokens; icons are Heroicons."
    >
      <Demo title="Inline palette" caption="Type to filter; arrow keys move the selection.">
        <div className="w-full max-w-sm rounded-xl border border-border shadow-md">
          <Command>
            <CommandInput placeholder="Type a command or search…" />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup heading="Suggestions">
                <CommandItem>
                  <CalendarIcon />
                  Calendar
                </CommandItem>
                <CommandItem>
                  <UserIcon />
                  Search people
                </CommandItem>
              </CommandGroup>
              <CommandSeparator />
              <CommandGroup heading="Settings">
                <CommandItem>
                  <Cog6ToothIcon />
                  Preferences
                  <CommandShortcut>⌘,</CommandShortcut>
                </CommandItem>
              </CommandGroup>
            </CommandList>
          </Command>
        </div>
      </Demo>
    </ComponentPage>
  );
}
