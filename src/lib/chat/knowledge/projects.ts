/* Projects & work — favorite project, what Will has built, this site.
   (Full case-study deep-dives live in src/lib/case-studies.ts.) */
import type { QAEntry } from "./types";

export const projectEntries: QAEntry[] = [
  {
    id: "favorite-project",
    question: "What's your favorite project?",
    keywords: [
      "favorite project", "favourite project", "favorite", "favourite",
      "best project", "proudest", "favorite work", "favorite thing",
      "case study", "next gen bar", "bar prep",
    ],
    answer:
      "My favorite is Next Gen Bar Prep — the adaptive bar-exam platform I led at BARBRI. I opened the case study on the right. What would you like to know about it? 👇 [[case-study:next-gen-bar]]",
  },
  {
    id: "projects",
    question: "What have you built?",
    keywords: ["projects", "built", "portfolio", "work samples", "made", "shipped", "apps", "working on"],
    answer:
      "A few things I'm driving right now: BARBRI's unified design system that ties all their products together, a new AI tutor for the PowerScore platform, and the Bar Prep & SQE product experiences. Oh — and this site you're on. Ask me how it was made!",
  },
  {
    id: "this-site",
    question: "How was this site made?",
    keywords: ["this site", "website", "built this", "made this", "tech behind", "how was this"],
    answer:
      "I built this site with Next.js, Tailwind CSS, and shadcn/ui, on a custom design-token system. This chat is powered by Claude, grounded on a knowledge base I curated — so it answers in my voice using only the facts I've given it.",
  },
  {
    id: "contact",
    question: "How can I reach you?",
    keywords: [
      "contact", "reach", "email", "get in touch", "hire", "message", "connect",
      "linkedin", "website", "site url", "portfolio site",
    ],
    answer: "Here are some ways you can reach me! 👇 [[contact]]",
  },
];
