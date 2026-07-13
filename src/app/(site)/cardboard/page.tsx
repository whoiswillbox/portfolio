import { redirect } from "next/navigation";

// Bare /cardboard has no landing of its own — send it to the first section so
// the product switcher's entry route (and any direct hit) resolves.
export default function CardboardIndex() {
  redirect("/cardboard/foundations");
}
