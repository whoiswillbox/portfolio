"use client";

import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from "@/components/cardboard/select";
import { ComponentPage, Demo } from "../_component-page";

export default function SelectDocs() {
  return (
    <ComponentPage
      title="Select"
      description="A dropdown for choosing one option from a list. Fully keyboard-accessible; check + chevrons are Heroicons."
    >
      <Demo title="Default">
        <Select defaultValue="apple">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pick a fruit" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="apple">Apple</SelectItem>
            <SelectItem value="orange">Orange</SelectItem>
            <SelectItem value="pear">Pear</SelectItem>
          </SelectContent>
        </Select>
      </Demo>

      <Demo title="Grouped" caption="Group options with a label and separator.">
        <Select>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Pick one" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Fruit</SelectLabel>
              <SelectItem value="apple">Apple</SelectItem>
              <SelectItem value="orange">Orange</SelectItem>
            </SelectGroup>
            <SelectSeparator />
            <SelectGroup>
              <SelectLabel>Vegetable</SelectLabel>
              <SelectItem value="carrot">Carrot</SelectItem>
              <SelectItem value="pea">Pea</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </Demo>

      <Demo title="Small & disabled">
        <Select disabled>
          <SelectTrigger size="sm" className="w-40">
            <SelectValue placeholder="Unavailable" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="a">A</SelectItem>
          </SelectContent>
        </Select>
      </Demo>
    </ComponentPage>
  );
}
