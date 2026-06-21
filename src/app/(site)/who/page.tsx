"use client";

import { useEffect, useState } from "react";
import { BoxAI } from "@/components/box-ai";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

export default function Who() {
  const [entered, setEntered] = useState(false);
  const { setOpen } = useSidebar();

  useEffect(() => {
    if (sessionStorage.getItem("entered") === "1") {
      setEntered(true);
      sessionStorage.removeItem("entered");
      setOpen(true);
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className={cn("h-full", entered && "animate-in fade-in duration-500")}>
      <BoxAI />
    </div>
  );
}
