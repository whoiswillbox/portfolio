/* ============================================================================
   Box AI knowledge — single entry point.

   Knowledge is split by category (bio, projects, personal, music, smalltalk)
   plus the persona. This module aggregates them into:
     - qaEntries        the matcher's data + the curated KNOWLEDGE BASE
     - buildSystemPrompt the full Claude system prompt (persona + notes + KB +
                         optional live Spotify data)

   To grow Box AI's knowledge, edit the relevant category file (e.g. add
   playlist stories to music.ts) — nothing else needs to change.
   ========================================================================== */
import { PERSONA } from "./persona";
import { MUSIC_NOTES, musicEntries } from "./music";
import { bioEntries } from "./bio";
import { projectEntries, PROJECT_NOTES } from "./projects";
import { personalEntries } from "./personal";
import { smalltalkEntries } from "./smalltalk";
import type { QAEntry } from "./types";

export type { QAEntry } from "./types";
export { fallbackAnswer } from "./smalltalk";
export { MUSIC_NOTES } from "./music";

/** All curated Q&A entries, across categories. Order is matcher-relevant only
    for tie-breaks (first-defined wins), so keep topical entries before the
    small-talk catch-alls. */
export const qaEntries: QAEntry[] = [
  ...bioEntries,
  ...projectEntries,
  ...personalEntries,
  ...musicEntries,
  ...smalltalkEntries,
];

/** Questions surfaced as starter chips (order matters). */
export const suggestedQuestionIds = ["who", "what-do-you-do", "projects", "contact"];

// The curated KNOWLEDGE BASE the LLM is grounded on, derived from the entries
// so it stays in sync with the matcher.
const KNOWLEDGE_BASE = qaEntries
  .map((e) => {
    const answer = Array.isArray(e.answer) ? e.answer[0] : e.answer;
    return `Q: ${e.question}\nA: ${answer}`;
  })
  .join("\n\n");

/** Assemble the full Claude system prompt. Pass the live Spotify summary (from
    getMusicSummary) to ground music answers in real-time data. */
export function buildSystemPrompt(musicSummary?: string | null, pageContext?: string | null): string {
  const base = `${PERSONA}

MUSIC NOTES:
${MUSIC_NOTES}

PROJECT NOTES:
${PROJECT_NOTES}

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;
  let prompt = musicSummary ? `${base}\n\nMY MUSIC (live from my Spotify):\n${musicSummary}` : base;
  if (pageContext) prompt += `\n\nCURRENT PAGE CONTEXT (the visitor is viewing this content right now — use it to answer questions about it):\n${pageContext}`;
  return prompt;
}
