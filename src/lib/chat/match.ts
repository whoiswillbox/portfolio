import { qaEntries, fallbackAnswer, type QAEntry } from "./knowledge";

/* Common words ignored when scoring, so they don't create false matches. */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "do", "does", "did", "you", "your",
  "what", "who", "how", "when", "where", "why", "tell", "me", "about", "can",
  "could", "would", "i", "of", "to", "and", "with", "for", "on", "in", "at",
  "have", "has", "be", "this", "that", "if", "or",
  // Pronouns — common across many keywords, so they create false matches.
  "he", "him", "his", "she", "her", "they", "them", "their", "we", "our", "us",
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
}

export const MATCH_THRESHOLD = 2;

/* Whole-message follow-ups (e.g. "and?", "what else") — too short/common to be
   keywords. Handled separately so they can walk through topics in order. */
const CONTINUATIONS = new Set([
  "and", "so", "ok", "okay", "k", "next", "then", "continue", "more", "go on",
  "and then", "yeah", "right", "huh", "uh huh", "tell me more", "what else",
  "anything else", "else", "what more",
]);

function normalize(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim();
}

export function isContinuation(input: string): boolean {
  return CONTINUATIONS.has(normalize(input));
}

/* The "tour" — order topics are revealed when a visitor keeps saying "what
   else". Each is shown once per conversation before we loop to a wrap-up. */
export const PROGRESSION = [
  "who", "what-do-you-do", "experience", "projects", "skills", "education", "hobbies", "contact",
];

const WRAPUP =
  "That's the grand tour! 🎉 Ask me anything specific, or reach me at csswillbox@gmail.com.";

function entryById(id: string): QAEntry | undefined {
  return qaEntries.find((e) => e.id === id);
}

/**
 * Find the best Q&A entry for a visitor's question.
 * Scores each entry by phrase hits (strong) and token overlap (weak).
 * Returns the matched entry, or null when nothing clears the threshold.
 */
export function findEntry(input: string): QAEntry | null {
  const lower = input.toLowerCase();
  const tokens = tokenize(input);

  let best: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of qaEntries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const k = keyword.toLowerCase();
      // Strong signal: the keyword/phrase appears as a whole word (not a
      // substring — so "hi" won't match inside "this").
      const escaped = k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (new RegExp(`\\b${escaped}\\b`, "i").test(lower)) score += 3;
      // Weak signal: individual word overlap.
      const keywordTokens = tokenize(keyword);
      for (const t of tokens) {
        if (keywordTokens.includes(t)) score += 1;
      }
    }
    if (score > bestScore) {
      bestScore = score;
      best = entry;
    }
  }

  return bestScore >= MATCH_THRESHOLD ? best : null;
}

function pick(answer: string | string[]): string {
  return Array.isArray(answer)
    ? answer[Math.floor(Math.random() * answer.length)]
    : answer;
}

export type Reply = { entryId: string | null; text: string };

/**
 * Produce a reply, using `shown` (topic ids already covered in this
 * conversation) so that "what else"-style follow-ups walk through new topics
 * instead of repeating. Returns the chosen entry id (to record) and the text.
 */
export function respondTo(input: string, shown: string[]): Reply {
  if (isContinuation(input)) {
    const nextId = PROGRESSION.find((id) => !shown.includes(id));
    const entry = nextId ? entryById(nextId) : undefined;
    if (entry) return { entryId: entry.id, text: pick(entry.answer) };
    return { entryId: null, text: WRAPUP };
  }

  const entry = findEntry(input);
  if (entry) return { entryId: entry.id, text: pick(entry.answer) };
  return { entryId: null, text: pick(fallbackAnswer) };
}
