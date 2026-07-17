/* Bio & professional background — who Will is, what he does, skills,
   experience, education, location.

   The SKILLS and RESUME answers are DERIVED from the shared résumé data
   (src/lib/resume-data.ts) — the same source the résumé page renders — so
   editing the résumé updates Box AI's answers automatically (no drift). */
import type { QAEntry } from "./types";
import {
  EXPERIENCE,
  EDUCATION,
  CERTIFICATIONS,
  SKILLS,
  ALL_SKILLS,
} from "@/lib/resume-data";

// Comma-joined skills grouped by category, e.g. "Design: … · Stack: …".
const skillsByCategory = SKILLS.map((g) => `${g.category}: ${g.items.join(", ")}`).join(" · ");

// A compact, résumé-style dump built from the shared data.
const resumeDump = [
  "Here's the full picture:",
  "",
  "EXPERIENCE:",
  ...EXPERIENCE.map(
    (j) => `• ${j.company} — ${j.role} (${j.period}, ${j.location}).`,
  ),
  "",
  "EDUCATION:",
  ...EDUCATION.map((e) => `• ${e.institution} — ${e.details.join(", ")} (${e.period})`),
  "",
  "CERTIFICATIONS:",
  ...CERTIFICATIONS.map((c) => `• ${c.institution} — ${c.details.join(", ")} (${c.period})`),
  "",
  `SKILLS: ${ALL_SKILLS.join(", ")}.`,
].join("\n");

export const bioEntries: QAEntry[] = [
  {
    id: "who",
    question: "Who is Will?",
    keywords: ["who", "who are you", "who is will", "introduce", "about will", "yourself"],
    answer:
      "I'm Will — a product designer who ships front-end code, building it with AI tools. Design-led, AI-fluent.",
  },
  {
    id: "what-do-you-do",
    question: "What do you do?",
    keywords: ["what do you do", "job", "role", "work", "profession", "title", "occupation"],
    answer:
      "I'm a product designer at BARBRI, working remotely from LA. I lead design across two teams — Bar Prep and SQE (partnering with UK teams on SQE). I work closely with stakeholders, product owners, and engineering to take experiences from research to polished UI — and I ship front-end code too, building it with AI tools.",
  },
  {
    id: "skills",
    question: "What are your skills?",
    keywords: [
      "skills", "tech", "stack", "technologies", "languages", "tools", "expertise",
      "good at", "figma", "design systems", "prototyping",
    ],
    answer:
      `My skills, grouped — ${skillsByCategory}. I'm design-led but AI-fluent, so I can carry work from research all the way to shipped front-end code — building it with AI tools.`,
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
      "Besides my current role at BARBRI, I spent two years at Technergetics as a UX Designer — sole designer on the mobile logistics team, shipping web, mobile, and PWA platforms used by 250,000+ airmen, partnering with engineers and SMEs from research all the way to shipped product. Before that I was a UX/UI design intern at Lightcert. All of it remote. (And way back, a stunt double — ask me. 🎬)",
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
      // NOTE: no bare "study" — it collides with "case study" and would hijack
      // project questions. Use the education-specific forms instead.
      "education", "school", "degree", "studied", "where did you study",
      "college", "university", "ucsd", "uc san diego", "major", "graduate",
      "certification", "certified",
    ],
    answer:
      "I studied Psychology with a Cognitive Science (Design + Interaction) minor at UC San Diego (2018–2022), after an AA in Communication at Santa Barbara City College. My UCSD coursework covered interaction design, prototyping, usability, and programming in Python and Java. I'm also certified in AI Product Design through ELVTR (Intro to AI Product Design with Robert Redmond, 2024).",
  },
  {
    // Explicit "show/open my CV" — opens the résumé PAGE (marker). Kept separate
    // from the general resume Q&A so experience questions stay conversational and
    // only THIS opens the page (offer, don't force).
    id: "open-cv",
    question: "See my full CV",
    keywords: [
      "see my cv", "see your cv", "full cv", "see my resume", "see your resume",
      "full resume", "open cv", "open resume", "show me your cv", "show me your resume",
      "view cv", "view resume", "cv page", "resume page",
    ],
    answer: "Here's my full CV 👇 [[case-study:resume]]",
  },
  {
    id: "resume",
    question: "What's on your resume?",
    keywords: [
      "resume", "cv", "curriculum vitae", "work history", "full experience",
      "all roles", "every job", "timeline", "career timeline",
    ],
    answer: resumeDump,
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
      "I'm a product designer who ships front-end code, building it with AI tools (blame the robots 🤖). I design and build web things. Want the details on my work, my projects, or how to reach me?",
      "Short version: design-led, AI-fluent — I ship front-end code built with AI. Ask me about my skills, what I've built, or how to get in touch and I'll go deeper.",
      "I'm a designer who ships real front-end code, built with AI tools. There's a lot to cover — pick a lane: my work, my projects, or contact info?",
    ],
  },
];
