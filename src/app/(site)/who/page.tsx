"use client";

import { useEffect, useRef, useState } from "react";
import { BoxAI } from "@/components/box-ai";
import { cn } from "@/lib/utils";

export default function Who() {
  // Whether we arrived via the landing "enter" flow — drives a one-time fade-in.
  // Capture the flag synchronously into a ref on first render (before
  // ContentWorkspace's effect can remove it), but only apply the animation class
  // via state set in an effect, so the server/client first render match (no
  // hydration mismatch).
  const enteredRef = useRef(
    typeof window !== "undefined" && sessionStorage.getItem("entered") === "1"
  );
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (enteredRef.current) setEntered(true);
  }, []);

  // Cap height to stop at the mobile nav's top edge so box-ai's pinned
  // input/disclaimer sit just above the nav, never under it.
  return (
    <div
      className={cn("who-shell h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]", entered && "animate-in fade-in duration-500")}
    >
      <BoxAI />
    </div>
  );
}
