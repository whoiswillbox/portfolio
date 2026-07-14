"use client";

/* The Box AI empty-state hero: cube + heading + composer (input w/ docked
   disclaimer) + prompt chips. Extracted so the REAL Box AI and the landing-page
   scroll-in replica render the exact SAME markup — no drift, no commit-seam
   mismatch. Purely presentational: callers pass the composer node, chips, and
   handlers. On the landing it's rendered static (disabled composer, inert chips);
   in Box AI it's live. */

import * as React from "react";

export type BoxChip = { label: string; prompt: string };

export function BoxEmptyState({
  heading,
  searchForm,
  chips,
  onChip,
  onCubeTap,
  disabled = false,
  hideCube = false,
}: {
  heading: string;
  /** The composer node (a <ChatInput/>) — includes the docked disclaimer. */
  searchForm: React.ReactNode;
  chips: BoxChip[];
  onChip?: (prompt: string) => void;
  onCubeTap?: () => void;
  disabled?: boolean;
  /** Landing replica hides the built-in cube (the animated hero box stands in),
      but keeps its layout height (invisible placeholder) so the heading/input
      still sit where the real Box AI puts them. */
  hideCube?: boolean;
}) {
  return (
    <div className="box-empty-hero mx-auto flex w-full max-w-2xl flex-col gap-3 p-6 text-center">
      <button
        type="button"
        onClick={onCubeTap}
        aria-hidden="true"
        tabIndex={-1}
        className={`box-cube mb-4 self-center cursor-default${hideCube ? " invisible" : ""}`}
      >
        <svg viewBox="0 0 24 28" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-12 text-foreground">
          <path d="M2 9 L12 15 L12 25 L2 19 Z" fill="currentColor" fillOpacity="0.1" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
          <path d="M22 9 L12 15 L12 25 L22 19 Z" fill="currentColor" fillOpacity="0.05" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
          <path d="M2 9 L12 3 L22 9 L12 15 Z" fill="currentColor" fillOpacity="0.08" stroke="currentColor" strokeWidth={1} strokeLinejoin="round" />
        </svg>
      </button>
      <h1 className="box-heading text-h1">{heading}</h1>
      {/* On desktop: input + chips inline. On mobile: hidden here, shown pinned below */}
      <div className="mt-3 sm:block hidden">{searchForm}</div>
      <div className="sm:flex hidden flex-wrap justify-center gap-2">
        {chips.map((chip) => (
          <button
            key={chip.prompt}
            onClick={() => onChip?.(chip.prompt)}
            disabled={disabled}
            className="rounded-lg border bg-muted/40 px-3 py-1.5 text-body-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
}
