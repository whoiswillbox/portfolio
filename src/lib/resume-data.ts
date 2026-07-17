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
    company: "Technergetics",
    role: "Lead UX Designer",
    period: "Aug 2023 – Aug 2024",
    location: "Utica, NY",
    bullets: [
      "Sole contributor on the mobile logistics team; led end-to-end design processes for web, mobile, and PWA enterprise platforms that modernized daily operations for over 250,000+ airmen.",
      "Partnered closely with UX engineer; curated component and pattern reusability that reduced technical debt for 70+ engineers and streamlined experience cohesion across all platforms.",
      "Spearheaded back-end driven design framework; partnered with engineering leads to annotate UI iterations of data sourced query and mutation calls to enhance development workflows.",
      "Partnered with ML engineers to refine feedback loops; leveraging large language models, multi-modal models, deep neural networks, and semantic networks for recommendation systems, knowledge graphs, and predictive analysis.",
      "Partnered closely with military subject matter experts throughout agile product cycles; translated contract product requirement documentation, conducted user interviews, and architected interdependent military persona workflows.",
      "Drove collaboration with cross-functional partners (product management, engineering, subject matter experts, product owners, stakeholders, and leadership) to enable milestone completion.",
      "Responsible for Rawhide, Merlin, Upgrade, Manifast, JetDash, Hyperkit, JIJOE, DPC, and LogTrax.",
    ],
  },
  {
    company: "Technergetics",
    role: "UX Designer",
    period: "Aug 2022 – Aug 2023",
    location: "Utica, NY",
    bullets: [
      "Designed solutions that automated and optimized hundreds of archaic military processes; reducing manual logs, paperwork, and excessive communication through process visualizations, data discovery, and real-time tracking to identify process breakdowns.",
      "Conducted interactive prototype walkthroughs for product owners and stakeholders during bi-weekly sprint reviews to acquire feedback and demonstrate deliverable status.",
      "Designed early stage concepts for contract proposals; 3+ SBIR Phase II contracts won based off of demonstrated feasibility, desirability, and applicability.",
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
