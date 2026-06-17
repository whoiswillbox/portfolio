/* ============================================================================
   Case studies — sample project deep-dives surfaced as a card in chat.
   An answer can include the marker [[case-study:<slug>]] to render the card
   for that project (stripped from the displayed text). Keyed by slug so more
   projects can be added later.
   ========================================================================== */

export type CaseStudyMetric = { value: string; label: string };

export type CaseStudySection = { heading: string; body: string };

export type CaseStudy = {
  slug: string;
  title: string;
  meta: string; // role · org · timeline
  summary: string;
  metrics: CaseStudyMetric[];
  sections: CaseStudySection[];
  /** Suggested follow-up questions shown as chips when the study is open. */
  prompts: string[];
  href?: string; // optional link to the full project page
  /** Custom Box AI opener when seeded from this page (defaults to the case
      study phrasing). Used by lightweight topic seeds like extracurriculars. */
  opener?: string;
};

export const caseStudies: Record<string, CaseStudy> = {
  "next-gen-bar": {
    slug: "next-gen-bar",
    title: "Next Gen Bar Prep",
    meta: "Lead Product Designer · BARBRI · 2024–2025",
    summary:
      "A ground-up reimagining of how law graduates prepare for the bar exam — replacing a rigid, one-size-fits-all course with an adaptive study experience that meets each student where they are.",
    metrics: [
      { value: "+28%", label: "Study-plan completion" },
      { value: "4.6/5", label: "Avg. student satisfaction" },
      { value: "10k+", label: "Students onboarded" },
    ],
    sections: [
      {
        heading: "The problem",
        body: "Students faced a fixed, linear schedule that ignored their strengths and gaps. Falling behind early meant low confidence and high drop-off heading into the most important exam of their careers.",
      },
      {
        heading: "What I did",
        body: "Led design end-to-end across two squads — from research and IA through prototyping and shipped front-end. Designed an adaptive study planner that re-sequences daily tasks based on diagnostic performance, and built the shared component system that keeps the experience consistent across web and mobile.",
      },
      {
        heading: "The outcome",
        body: "The adaptive planner lifted plan completion and student-reported confidence, and became the template for BARBRI's broader product modernization.",
      },
    ],
    prompts: [
      "How did you solve the problem?",
      "What was your design process?",
      "What was the measurable impact?",
    ],
    href: "/projects/next-gen-bar",
  },
  jetdash: {
    slug: "jetdash",
    title: "Jet Dash",
    meta: "Lead UX Designer · Technergetics · 2023–24",
    summary:
      "Modernizing maintenance efficiency for Air Force aerospace ground equipment teams — replacing radio-and-landline equipment requests with an e-commerce web and delivery mobile app.",
    metrics: [],
    sections: [
      {
        heading: "The problem",
        body: "For decades, getting aerospace ground equipment to the flightline was slow and opaque. AGE maintainers and dispatchers coordinated solely over radios and landlines, which created barriers, removed supervision visibility, and degraded maintenance efficiency.",
      },
      {
        heading: "What I did",
        body: "Worked closely with SMEs, engineering, management, and stakeholders to translate customer requirements and user research into experiences that mitigate AGE personnel's communication barriers when getting equipment to the flight line.",
      },
      {
        heading: "The outcome",
        body: "Jet Dash is an e-commerce web and delivery mobile app that modernizes day-to-day operations through equipment ordering, delivery, and tracking. Shipped and field-tested at Andersen AFB (Guam) and Joint Base Lewis-McChord, it has modernized delivery of 650+ equipment pieces for thousands of AGE personnel.",
      },
    ],
    prompts: [
      "What problem were you solving?",
      "What was your process?",
      "What was the outcome?",
    ],
    href: "/technergetics/jetdash",
  },
  upgrade: {
    slug: "upgrade",
    title: "Upgrade",
    meta: "Lead UX Designer · Technergetics · 2022–24",
    summary:
      "Modernizing the Space-A passenger experience for Air Mobility Command — replacing manual, opaque military travel processes with an automated air-terminal web and passenger mobile app.",
    metrics: [],
    sections: [
      {
        heading: "The problem",
        body: "For decades, AMC's Space-A travel processes posed significant resource strains on passengers and terminal personnel — manual methods, lack of transparency, process bottlenecks, and constricted mission windows.",
      },
      {
        heading: "What I did",
        body: "Worked closely with SMEs, engineering, management, and stakeholders to translate customer requirements and user research into experiences that mitigate resource strain for AMC terminal personnel and Space-A passengers.",
      },
      {
        heading: "The outcome",
        body: "Upgrade is an air-terminal web and passenger mobile app that modernizes Space-A travel through automation (sign-ups, roll calls, selection, baggage tracking), predictability (flight schedules), and remote capabilities (check-ins, meal ordering, boarding passes).",
      },
    ],
    prompts: [
      "What problem were you solving?",
      "What was your process?",
      "What was the outcome?",
    ],
    href: "/technergetics/upgrade",
  },

  // Lightweight topic seeds (extracurriculars) — no case-study body; they just
  // give their page a Box AI context with a custom opener + prompts.
  surfing: {
    slug: "surfing",
    title: "Surfing",
    meta: "",
    summary: "",
    metrics: [],
    sections: [],
    opener: "Wanna talk surfing? 🏄 Ask me anything about it 👇",
    prompts: [
      "How long have you been surfing?",
      "Where do you surf?",
      "Does surfing influence your design?",
    ],
    href: "/extracurriculars/surfing",
  },
  gaming: {
    slug: "gaming",
    title: "Gaming",
    meta: "",
    summary: "",
    metrics: [],
    sections: [],
    opener: "Wanna talk gaming? 🎮 Ask me anything about it 👇",
    prompts: [
      "What games are you playing?",
      "All-time favorite game?",
      "PC or console?",
    ],
    href: "/extracurriculars/gaming",
  },
};

/** Find the case study whose project page matches the given path, if any. */
export function findCaseStudyByPath(path: string): CaseStudy | null {
  return Object.values(caseStudies).find((c) => c.href === path) ?? null;
}

/** Resolve the case study a conversation is framed around: by its stored slug,
    or (for conversations seeded before the slug existed) by its "About <title>"
    title. */
export function caseStudyForConversation(c: {
  title: string;
  caseStudySlug?: string;
}): CaseStudy | null {
  if (c.caseStudySlug && caseStudies[c.caseStudySlug]) return caseStudies[c.caseStudySlug];
  return Object.values(caseStudies).find((s) => c.title === `About ${s.title}`) ?? null;
}

/** Matches [[case-study:some-slug]] and captures the slug. */
const MARKER_RE = /\[\[case-study:([a-z0-9-]+)\]\]/i;

/** Returns the case study referenced by a marker in the text, if any. */
export function findCaseStudy(text: string): CaseStudy | null {
  const m = text.match(MARKER_RE);
  if (!m) return null;
  return caseStudies[m[1].toLowerCase()] ?? null;
}

/** Remove the case-study marker (and tidy whitespace) for display. */
export function stripCaseStudyMarker(text: string): string {
  return text.replace(MARKER_RE, "").replace(/\s+/g, " ").trim();
}
