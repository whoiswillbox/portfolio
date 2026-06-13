/* ============================================================================
   Chat Q&A Repository
   The bot answers visitors by matching their question to an entry below.
   EDIT THESE ANSWERS — most are placeholders. Each entry:
     - question: the canonical question (shown as a suggestion chip)
     - keywords: terms/phrases that should trigger this answer (lowercase)
     - answer:   what the bot replies
   ========================================================================== */

export type QAEntry = {
  id: string;
  question: string;
  keywords: string[];
  answer: string;
};

export const greeting =
  "Hi! I'm Will's assistant. Ask me anything about him — or tap a question below to get started.";

export const fallbackAnswer =
  "I don't have an answer for that yet. Try one of the suggested questions, or reach out to Will directly at boxjwilliam@gmail.com.";

export const qaEntries: QAEntry[] = [
  {
    id: "who",
    question: "Who is Will?",
    keywords: ["who", "who are you", "who is will", "introduce", "about will", "yourself"],
    answer:
      "I'm Will Box — [TODO: one-line intro, e.g. a software engineer based in ___ who builds web apps].",
  },
  {
    id: "what-do-you-do",
    question: "What do you do?",
    keywords: ["what do you do", "job", "role", "work", "profession", "title", "occupation"],
    answer:
      "[TODO: describe your work — your current role, the kind of problems you solve, and what you enjoy building.]",
  },
  {
    id: "skills",
    question: "What are your skills?",
    keywords: ["skills", "tech", "stack", "technologies", "languages", "tools", "expertise", "good at"],
    answer:
      "[TODO: list your core skills — e.g. TypeScript, React, Next.js, Node, design systems, etc.]",
  },
  {
    id: "experience",
    question: "What's your experience?",
    keywords: ["experience", "background", "career", "history", "worked", "companies", "years"],
    answer:
      "[TODO: summarize your experience — previous roles, companies, and notable accomplishments.]",
  },
  {
    id: "projects",
    question: "What have you built?",
    keywords: ["projects", "built", "portfolio", "work samples", "made", "shipped", "apps"],
    answer:
      "[TODO: highlight a few projects. You can also point people to the Playground section of this site.]",
  },
  {
    id: "this-site",
    question: "How was this site made?",
    keywords: ["this site", "website", "built this", "made this", "tech behind", "how was this"],
    answer:
      "This site is built with Next.js, Tailwind CSS, and shadcn/ui, on a custom design-token system. The chat you're using runs entirely client-side — no AI, just a curated Q&A.",
  },
  {
    id: "contact",
    question: "How can I reach you?",
    keywords: ["contact", "reach", "email", "get in touch", "hire", "message", "connect", "linkedin"],
    answer:
      "You can reach Will at boxjwilliam@gmail.com. [TODO: add LinkedIn / GitHub / other links.]",
  },
  {
    id: "location",
    question: "Where are you based?",
    keywords: ["location", "based", "where", "live", "city", "country", "remote"],
    answer: "[TODO: where you're based, and whether you're open to remote work.]",
  },
];

/* Questions surfaced as starter chips (order matters). */
export const suggestedQuestionIds = ["who", "what-do-you-do", "projects", "contact"];
