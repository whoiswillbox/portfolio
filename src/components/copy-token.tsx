"use client";

import * as React from "react";
import { CheckIcon, ClipboardIcon } from "@heroicons/react/24/outline";
import { cn } from "@/lib/utils";

/* A monospace token name that copies itself on click — for the design-system
   reference pages (Storybook-style). Shows a check for a beat after copying. */
export function CopyToken({ value, className }: { value: string; className?: string }) {
  const [copied, setCopied] = React.useState(false);

  const copy = () => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    }).catch(() => {});
  };

  return (
    <button
      type="button"
      onClick={copy}
      title={`Copy "${value}"`}
      className={cn(
        "group/copy inline-flex items-center gap-1.5 rounded-md px-1.5 py-0.5 font-mono text-body-xs text-foreground transition-colors hover:bg-muted",
        className
      )}
    >
      <span>{value}</span>
      {copied ? (
        <CheckIcon className="size-3 text-success" />
      ) : (
        <ClipboardIcon className="size-3 text-muted-foreground opacity-0 transition-opacity group-hover/copy:opacity-100" />
      )}
    </button>
  );
}
