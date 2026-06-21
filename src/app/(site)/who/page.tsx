"use client";

import { useEffect, useState } from "react";
import { BoxAI } from "@/components/box-ai";
import { cn } from "@/lib/utils";

export default function Who() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    if (sessionStorage.getItem("entered") === "1") {
      setEntered(true);
    }
  }, []);

  return (
    <div className={cn("h-full", entered && "animate-in fade-in duration-500")}>
      <BoxAI />
    </div>
  );
}
