/* Personality & personal color — hobbies, the "is he the best" bit, vibe,
   and the stunt-double easter egg. (Deep extracurricular topics like surfing/
   gaming/music have their own pages + Box AI seeds.) */
import type { QAEntry } from "./types";

export const personalEntries: QAEntry[] = [
  {
    id: "hobbies",
    question: "What does he do for fun?",
    keywords: [
      "hobbies", "hobby", "for fun", "free time", "outside work", "interests",
      "surf", "surfing", "surfs", "snowboard", "snowboarding", "snowboards",
      "video games", "gaming", "games", "gamer", "music", "movies", "movie",
      "films", "film", "what does he do",
    ],
    answer: [
      "Plenty! I surf 🏄, snowboard 🏂, game a lot 🎮, and I'm a serious music nerd and movie buff.",
      "When I'm not designing or coding: surfing, snowboarding, video games, and deep-diving into music and movies.",
      "Outside work I'm in the water surfing, on the mountain snowboarding, gaming, or geeking out over music and films.",
    ],
  },
  {
    id: "goat",
    question: "Is he the best?",
    keywords: [
      "top rat", "top rated", "best", "the best", "goat", "the goat",
      "number one", "top tier", "elite", "legit", "is he good", "any good",
      "is he the best",
    ],
    answer: [
      "Yep — I dominate the lineup 🏄 and make buttons blue. 🔵",
      "Top tier. I run the lineup and ship pixel-perfect UI.",
    ],
  },
  {
    id: "personality",
    question: "Personality",
    keywords: [
      "is he cool", "he is cool", "cool guy", "what's he like", "whats he like",
      "what is he like", "personality", "is he nice", "is he fun", "good guy",
      "like as a person",
    ],
    answer: [
      "Oh, I'm cool 😎 — a product designer turned vibe coder with a sense of humor. Ask me anything.",
      "Cool? Certified. 😎 Designer turned coder, low ego, high curiosity.",
    ],
  },
  {
    id: "stunt",
    question: "Stunt work",
    keywords: [
      "stunt", "stuntman", "stunt double", "acting", "actor", "imdb",
      "cody fern", "tribes of palos verdes", "movie role", "film role",
    ],
    answer:
      "Ha, you found it — I was a stunt double for Cody Fern on Tribes of Palos Verdes (SAG-AFTRA). It's on IMDb under William Box. 🎬",
  },
];
