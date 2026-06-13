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
  /** A single reply, or several variants picked from at random. */
  answer: string | string[];
};

/** Shown when nothing matches — picked from at random to feel less canned. */
export const fallbackAnswer = [
  "Hmm, I'm not sure about that one 😅 — but I'm great on anything about Will. Try asking what he does, what he's built, or how to reach him.",
  "That's a bit outside my wheelhouse! I can tell you about Will's work, his projects, or how to get in touch.",
  "I don't have that one yet — ask me about Will's background, skills, or what he's built and I've got you.",
];

export const qaEntries: QAEntry[] = [
  {
    id: "who",
    question: "Who is Will?",
    keywords: ["who", "who are you", "who is will", "introduce", "about will", "yourself"],
    answer:
      "I'm Will — a product designer turned vibe coder due to the world takeover of robots.",
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
  {
    id: "overview",
    question: "Overview",
    keywords: [
      "everything", "tell me something", "tell me more", "tell me about him",
      "tell me about will", "anything", "rundown", "the rundown", "overview",
      "summary", "summarize", "the gist", "his deal", "whats his deal",
      "what's his deal", "more", "what else", "anything else", "else",
      "what more", "keep going", "go on",
    ],
    answer: [
      "Will's a product designer turned vibe coder (blame the robots 🤖). He designs and builds web things. Want the details on his work, his projects, or how to reach him?",
      "Short version: designer brain, coder hands. Ask me about his skills, what he's built, or how to get in touch and I'll go deeper.",
      "He's a designer who learned to ship code. There's a lot to cover — pick a lane: his work, his projects, or contact info?",
    ],
  },
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
      "Plenty! Will surfs 🏄, snowboards 🏂, games a lot 🎮, and he's a serious music nerd and movie buff.",
      "When he's not designing or coding: surfing, snowboarding, video games, and deep-diving into music and movies.",
      "Outside work he's in the water surfing, on the mountain snowboarding, gaming, or geeking out over music and films.",
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
      "Yes — he dominates the lineup 🏄 and makes buttons blue. 🔵",
      "Top tier. He runs the lineup and ships pixel-perfect UI.",
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
      "Oh, he's cool 😎 — a product designer turned vibe coder with a sense of humor. Ask him anything.",
      "Cool? Certified. 😎 Designer turned coder, low ego, high curiosity.",
    ],
  },

  /* --- Small talk (not shown as suggestions) -------------------------- */
  {
    id: "compliment",
    question: "Compliment",
    keywords: [
      "sick", "thats sick", "that's sick", "cool", "awesome", "nice", "dope",
      "lit", "amazing", "love it", "love this", "fire", "slick", "clean", "rad",
    ],
    answer: [
      "Thank you, dog. 🐶",
      "Appreciate it! 🙏 Will put a lot into this.",
      "Haha thanks — wanna know what he built it with? Just ask.",
    ],
  },
  {
    id: "greeting",
    question: "Greeting",
    keywords: ["hi", "hey", "hello", "yo", "sup", "howdy", "what's up", "whats up"],
    answer: [
      "Hey! 👋 What do you want to know about Will?",
      "Yo! Ask me anything about Will — his work, projects, whatever.",
      "Hi there! I can tell you all about Will. What's up?",
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

/* Questions surfaced as starter chips (order matters). */
export const suggestedQuestionIds = ["who", "what-do-you-do", "projects", "contact"];
