/* Single source of truth for the résumé content — experience, education,
   certifications, and skills. BOTH the résumé page (src/app/(site)/resume) AND
   Box AI's bio knowledge (src/lib/chat/knowledge/bio.ts) read from here, so a
   change updates the page AND the assistant's answers in one edit. */

export type ResumeJob = {
  company: string;
  role: string;
  period: string;
  location: string;
  bullets: string[];
};

export type ResumeSchool = {
  institution: string;
  period: string;
  location: string;
  details: string[];
};

export type SkillGroup = {
  category: string;
  items: string[];
};

export const EXPERIENCE: ResumeJob[] = [
  {
    company: "Nice Logic Systems",
    role: "Founding Designer",
    period: "Jul 2026 – Oct 2026",
    location: "Atlanta, GA",
    bullets: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    ],
  },
  {
    company: "BARBRI",
    role: "UX Designer",
    period: "Jan 2025 – Current",
    location: "Dallas, TX",
    bullets: [
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
      "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
    ],
  },
  {
    company: "Technergetics",
    role: "UX Designer",
    period: "Aug 2022 – Aug 2024",
    location: "Utica, NY",
    bullets: [
      "Sole designer on the mobile logistics team, owning end-to-end design for platforms that modernized daily operations for 250,000+ airmen. Partnered with engineering and military SMEs & product owners from research to production, and worked closely with a UX engineer to standardize components and patterns across platforms — cutting technical debt for 70+ engineers.",
    ],
  },
  {
    company: "Lightcert",
    role: "UX/UI Design Intern",
    period: "Jan 2022 – Jun 2022",
    location: "Los Angeles, CA",
    bullets: [
      "Worked cross-functionally to revamp Lightcert's internal mobile design system; streamlined their onboarding processes and designed the save/share feature for MVP v.2 that resulted in reaching over 40k+ fandoms.",
    ],
  },
];

export const EDUCATION: ResumeSchool[] = [
  {
    institution: "University of California, San Diego",
    period: "Sep 2018 – June 2022",
    location: "La Jolla, CA",
    details: ["Psychology, B.A", "Cognitive Science (Design + Interaction), Minor"],
  },
  {
    institution: "Santa Barbara City College",
    period: "Aug 2017 – June 2018",
    location: "Santa Barbara, CA",
    details: ["Communication, A.A"],
  },
];

export const CERTIFICATIONS: ResumeSchool[] = [
  {
    institution: "ELVTR",
    period: "Nov 2023 – Jan 2024",
    location: "Irvine, CA",
    details: ["Intro to AI Product Design with Robert Redmond"],
  },
];

export const SKILLS: SkillGroup[] = [
  {
    category: "Design",
    items: [
      "Persona Mapping",
      "Information Architecture",
      "Interaction Design",
      "AI Prototyping",
      "Design Systems",
      "DesignOps",
      "Accessibility (WCAG)",
    ],
  },
  {
    category: "Stack",
    items: ["Figma", "Claude Code", "Azure DevOps", "GitHub", "Storybook", "Jira", "Confluence", "Fullstory"],
  },
  {
    category: "Other",
    items: ["Agile Ceremonies", "Agentic Workflows"],
  },
];

/** A flat, comma-joined list of every skill — handy for prose contexts (e.g.
    Box AI's knowledge base). */
export const ALL_SKILLS: string[] = SKILLS.flatMap((g) => g.items);
