/* Bio & professional background — who Will is, what he does, skills,
   experience, education, location. */
import type { QAEntry } from "./types";

export const bioEntries: QAEntry[] = [
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
      "I'm a product designer at BARBRI, working remotely from LA, where I lead design for the Bar Prep and SQE products across two teams. I partner closely with stakeholders, product owners, and engineering to take experiences from research to polished UI — and I ship the front-end code too. I'm also building BARBRI's unified design system and a new AI tutor for the PowerScore platform.",
  },
  {
    id: "skills",
    question: "What are your skills?",
    keywords: [
      "skills", "tech", "stack", "technologies", "languages", "tools", "expertise",
      "good at", "figma", "design systems", "prototyping",
    ],
    answer:
      "My core is UX — persona mapping, information architecture, interaction design, wireframing, prototyping, and design systems. I live in Figma (plus Figjam, Webflow, Framer, and Storybook), and I'm fluent in design handoff: tokenization, naming conventions, annotations, and changelogs. I also code, so I can carry work from research all the way to shipped front-end.",
  },
  {
    id: "experience",
    question: "What's your experience?",
    keywords: [
      "experience", "background", "career", "history", "worked", "where has he worked",
      "companies", "years", "barbri", "technergetics", "lightcert", "lead",
      "military", "airmen",
      "past", "previous", "previously", "previous experience", "done in the past",
      "before", "prior", "what have you done", "what has he done",
    ],
    answer:
      "Besides my current role at BARBRI, I spent two years at Technergetics — ending as Lead UX Designer, the sole designer on the mobile logistics team, shipping web, mobile, and PWA platforms used by 250,000+ airmen and partnering with ML engineers on LLM-powered recommendation features. Before that I was a UX/UI design intern at Lightcert. All of it remote. (And way back, a stunt double — ask me. 🎬)",
  },
  {
    id: "location",
    question: "Where are you based?",
    keywords: ["location", "based", "where", "live", "city", "country", "remote"],
    answer:
      "I'm based in Los Angeles, and I work fully remote — every role I've had, including my current one at BARBRI, has been remote.",
  },
  {
    id: "education",
    question: "Where did you study?",
    keywords: [
      "education", "school", "degree", "study", "studied", "college", "university",
      "ucsd", "uc san diego", "major", "graduate", "certification", "certified",
    ],
    answer:
      "I studied Psychology with a Cognitive Science (Design + Interaction) minor at UC San Diego (2018–2022), after an AA in Communication at Santa Barbara City College. My UCSD coursework covered interaction design, prototyping, usability, and programming in Python and Java. I'm also certified in AI Product Design through ELVTR (Intro to AI Product Design with Robert Redmond, 2024).",
  },
  {
    id: "overview",
    question: "Overview",
    keywords: [
      "everything", "tell me about him", "tell me about will", "tell me about yourself",
      "rundown", "the rundown", "overview", "summary", "summarize", "the gist",
      "his deal", "whats his deal", "what's his deal",
    ],
    answer: [
      "I'm a product designer turned vibe coder (blame the robots 🤖). I design and build web things. Want the details on my work, my projects, or how to reach me?",
      "Short version: designer brain, coder hands. Ask me about my skills, what I've built, or how to get in touch and I'll go deeper.",
      "I'm a designer who learned to ship code. There's a lot to cover — pick a lane: my work, my projects, or contact info?",
    ],
  },
];
