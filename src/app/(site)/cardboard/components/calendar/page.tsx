"use client";

import * as React from "react";
import type { DateRange } from "react-day-picker";
import { Calendar } from "@/components/cardboard/calendar";
import { ComponentPage, Demo } from "../_component-page";

export default function CalendarDocs() {
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [range, setRange] = React.useState<DateRange | undefined>();

  return (
    <ComponentPage
      title="Calendar"
      description="A date field built on react-day-picker. The selected day, range, today marker, and nav chevrons are wired to Cardboard tokens; chevrons are Heroicons."
    >
      <Demo title="Single date" caption="Pick one day.">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-xl border border-border"
        />
      </Demo>

      <Demo title="Date range" caption="Drag across days to select a span.">
        <Calendar
          mode="range"
          selected={range}
          onSelect={setRange}
          numberOfMonths={2}
          className="rounded-xl border border-border"
        />
      </Demo>
    </ComponentPage>
  );
}
