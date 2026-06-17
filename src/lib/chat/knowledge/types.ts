/* Shared type for a Box AI knowledge entry. An entry feeds two things: the
   local keyword matcher (dev fallback) via `keywords`, and the curated
   KNOWLEDGE BASE compiled into the Claude system prompt. */
export type QAEntry = {
  id: string;
  question: string;
  /** Terms/phrases (lowercase) that should trigger this answer in the matcher. */
  keywords: string[];
  /** A single reply, or several variants picked from at random. */
  answer: string | string[];
};
