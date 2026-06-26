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

  // While the keyboard is open, pin the shell to the EXACT visible height from
  // VisualViewport (the area above the keyboard). This guarantees nothing
  // overflows — so there's no page scroll in typing mode — and the cube centers
  // in the real visible area. `100dvh` alone isn't reliable (iOS doesn't always
  // contract it for the keyboard). Off-keyboard, height is left to CSS.
  const shellRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const vv = window.visualViewport;
    if (!vv) return;
    const apply = () => {
      const el = shellRef.current;
      if (!el) return;
      const keyboardOpen = window.innerHeight - vv.height - vv.offsetTop > 80;
      if (keyboardOpen && window.innerWidth < 640) {
        el.style.height = `${vv.height}px`;
      } else {
        el.style.height = "";
      }
    };
    vv.addEventListener("resize", apply);
    vv.addEventListener("scroll", apply);
    apply();
    return () => { vv.removeEventListener("resize", apply); vv.removeEventListener("scroll", apply); };
  }, []);

  return (
    <div
      ref={shellRef}
      className={cn("who-shell h-full max-sm:h-[calc(100svh-5rem-env(safe-area-inset-bottom))]", entered && "animate-in fade-in duration-500")}
    >
      <BoxAI />
    </div>
  );
}
