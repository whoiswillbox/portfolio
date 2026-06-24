"use client";

import { useRef } from "react";
import { BoxAI } from "@/components/box-ai";
import { cn } from "@/lib/utils";

export default function Who() {
  // Read flag synchronously on first render — before any effects (including
  // content-workspace's pathname effect) can remove it from sessionStorage.
  const entered = useRef(
    typeof window !== "undefined" && sessionStorage.getItem("entered") === "1"
  );

  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  return (
    <div
      className={cn("h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]", entered.current && "animate-in fade-in duration-500")}
    >
      <BoxAI />
    </div>
  );
}
