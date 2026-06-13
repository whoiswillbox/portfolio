/* ============================================================================
   Chat Q&A Repository
   The bot answers visitors by matching their question to an entry below.
   The bot speaks AS Will — always first person ("I", "my"), never "he"/"Will".
   EDIT THESE ANSWERS — some are placeholders. Each entry:
     - question: the canonical question (shown as a suggestion chip)
     - keywords: terms/phrases that should trigger this answer (lowercase)
     - answer:   what the bot replies (a string, or variants picked at random)
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
  "Hmm, I'm not sure about that one 😅 — but ask me what I do, what I've built, or how to reach me.",
  "That's a bit outside my wheelhouse! Ask me about my work, my projects, or how to get in touch.",
  "I don't have that one yet — ask me about my background, skills, or what I've built and I've got you.",
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
      "I'm a UX designer at BARBRI in Dallas, leading design for the Bar Prep and SQE products across two teams. I partner closely with stakeholders, product owners, and engineering to take experiences from research to polished UI — and I ship the front-end code too. I'm also building BARBRI's unified design system and a new AI tutor for the PowerScore platform.",
  },
  {
    id: "skills",
    question: "What are your skills?",
    keywords: ["skills", "tech", "stack", "technologies", "languages", "tools", "expertise", "good at", "figma"],
    answer:
      "My core is UX — Figma, wireframing, usability testing, and information architecture — grounded in real user research. I also code (Python, Java, and modern web), so I can take an idea from research all the way to a shipped product.",
  },
  {
    id: "experience",
    question: "What's your experience?",
    keywords: [
      "experience", "background", "career", "history", "worked", "where has he worked",
      "companies", "years", "barbri", "technergetics", "lightcert",
      "past", "previous", "previously", "previous experience", "done in the past",
      "before", "prior", "what have you done", "what has he done",
    ],
    answer:
      "I'm a UX Designer at BARBRI (Jan 2025–present) in Dallas. Before that I spent ~2 years as a UX Designer at Technergetics in Utica, NY, and started out as a UX/UI design intern at Lightcert in LA. Fun fact: way back I was also a stunt double (SAG-AFTRA) — ask me about it. 🎬",
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
      "I built this site with Next.js, Tailwind CSS, and shadcn/ui, on a custom design-token system. This chat runs entirely client-side — no AI, just my curated answers.",
  },
  {
    id: "contact",
    question: "How can I reach you?",
    keywords: ["contact", "reach", "email", "get in touch", "hire", "message", "connect", "linkedin"],
    answer:
      "You can reach me at boxjwilliam@gmail.com, or connect with me on LinkedIn: linkedin.com/in/williamjbox.",
  },
  {
    id: "location",
    question: "Where are you based?",
    keywords: ["location", "based", "where", "live", "city", "country", "remote"],
    answer: "I'm based in Dallas, Texas.",
  },
  {
    id: "education",
    question: "Where did you study?",
    keywords: [
      "education", "school", "degree", "study", "studied", "college", "university",
      "ucsd", "uc san diego", "major", "graduate", "certification", "certified",
    ],
    answer:
      "I studied Psychology with a Cognitive Science (Design + Interaction) minor at UC San Diego (2018–2022), after an AA in Communication at Santa Barbara City College. My UCSD coursework covered interaction design, prototyping, usability, and programming in Python and Java. I'm also certified in AI Product Design (ELVTR, 2024).",
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
      "I'm a product designer turned vibe coder (blame the robots 🤖). I design and build web things. Want the details on my work, my projects, or how to reach me?",
      "Short version: designer brain, coder hands. Ask me about my skills, what I've built, or how to get in touch and I'll go deeper.",
      "I'm a designer who learned to ship code. There's a lot to cover — pick a lane: my work, my projects, or contact info?",
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

/* Questions surfaced as starter chips (order matters). */
export const suggestedQuestionIds = ["who", "what-do-you-do", "projects", "contact"];
