import { qaEntries, fallbackAnswer, type QAEntry } from "./repository";

/* Common words ignored when scoring, so they don't create false matches. */
const STOPWORDS = new Set([
  "a", "an", "the", "is", "are", "was", "do", "does", "did", "you", "your",
  "what", "who", "how", "when", "where", "why", "tell", "me", "about", "can",
  "could", "would", "i", "of", "to", "and", "with", "for", "on", "in", "at",
  "have", "has", "be", "this", "that",
]);

function tokenize(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 0 && !STOPWORDS.has(w));
}

export const MATCH_THRESHOLD = 2;

/**
 * Find the best Q&A entry for a visitor's question.
 * Scores each entry by phrase hits (strong) and token overlap (weak).
 * Returns the matched entry, or null when nothing clears the threshold.
 */
export function findAnswer(input: string): { entry: QAEntry | null; score: number } {
  const lower = input.toLowerCase();
  const tokens = tokenize(input);

  let best: QAEntry | null = null;
  let bestScore = 0;

  for (const entry of qaEntries) {
    let score = 0;
    for (const keyword of entry.keywords) {
      const k = keyword.toLowerCase();
      // Strong signal: the full keyword/phrase appears in the question.
      if (lower.includes(k)) score += 3;
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

  return { entry: bestScore >= MATCH_THRESHOLD ? best : null, score: bestScore };
}

export function answerFor(input: string): string {
  return findAnswer(input).entry?.answer ?? fallbackAnswer;
}
