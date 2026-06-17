/* Small talk — greetings, compliments, thanks, goodbyes (not surfaced as
   suggestion chips) — plus the fallback used when nothing matches. */
import type { QAEntry } from "./types";

/** Shown when nothing matches — picked from at random to feel less canned. */
export const fallbackAnswer = [
  "Hmm, I'm not sure about that one 😅 — but ask me what I do, what I've built, or how to reach me.",
  "That's a bit outside my wheelhouse! Ask me about my work, my projects, or how to get in touch.",
  "I don't have that one yet — ask me about my background, skills, or what I've built and I've got you.",
];

export const smalltalkEntries: QAEntry[] = [
  {
    id: "compliment",
    question: "Compliment",
    keywords: [
      "sick", "thats sick", "that's sick", "cool", "awesome", "nice", "dope",
      "lit", "amazing", "love it", "love this", "fire", "slick", "clean", "rad",
    ],
    answer: [
      "Thank you, dog. 🐶",
      "Appreciate it! 🙏 I put a lot into this.",
      "Haha thanks — wanna know what I built it with? Just ask.",
    ],
  },
  {
    id: "greeting",
    question: "Greeting",
    keywords: ["hi", "hey", "hello", "yo", "sup", "howdy", "what's up", "whats up"],
    answer: [
      "Hey! 👋 What do you want to know?",
      "Yo! Ask me anything — my work, projects, whatever.",
      "Hi there! Ask me anything. What's up?",
    ],
  },
  {
    id: "thanks",
    question: "Thanks",
    keywords: ["thanks", "thank you", "thx", "appreciate it", "cheers", "ty"],
    answer: ["Anytime! 🙏", "You got it. 👊", "No problem — anything else you wanna know?"],
  },
  {
    id: "bye",
    question: "Goodbye",
    keywords: ["bye", "goodbye", "see ya", "see you", "later", "cya", "peace"],
    answer: ["Catch you later! 👋", "Peace! ✌️", "See ya — come back anytime."],
  },
];
