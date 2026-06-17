"use client";

import * as React from "react";
import type { CaseStudy } from "@/lib/case-studies";

/* Lets a page register a dynamic Box AI seed (opener + follow-up prompts) that
   ContentWorkspace can't derive from the pathname alone — e.g. a Spotify
   playlist page, whose name/id are only known at runtime. The page renders
   <RegisterBoxSeed seed={...} />; ContentWorkspace reads it via useBoxSeed and
   passes it to Box AI, taking precedence over the path-based case study. */

type Ctx = {
  seed: CaseStudy | null;
  setSeed: (seed: CaseStudy | null) => void;
};

const BoxSeedContext = React.createContext<Ctx | null>(null);

export function BoxSeedProvider({ children }: { children: React.ReactNode }) {
  const [seed, setSeed] = React.useState<CaseStudy | null>(null);
  const value = React.useMemo(() => ({ seed, setSeed }), [seed]);
  return <BoxSeedContext.Provider value={value}>{children}</BoxSeedContext.Provider>;
}

export function useBoxSeed(): CaseStudy | null {
  return React.useContext(BoxSeedContext)?.seed ?? null;
}

/** Registers `seed` while mounted (and clears it on unmount). Keyed off the
    seed slug so navigating between playlists swaps the context cleanly. */
export function RegisterBoxSeed({ seed }: { seed: CaseStudy }) {
  const ctx = React.useContext(BoxSeedContext);
  React.useEffect(() => {
    ctx?.setSeed(seed);
    return () => ctx?.setSeed(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seed.slug]);
  return null;
}
