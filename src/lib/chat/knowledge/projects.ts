/* Projects & work — favorite project, what Will has built, this site.
   PROJECT_NOTES gives Box AI the back-story/details behind specific
   projects. Case study sections are auto-imported so Box AI knows all
   of them from the /who page too. */
import type { QAEntry } from "./types";
import { caseStudies } from "@/lib/case-studies";

function buildCaseStudyNotes(): string {
  return Object.values(caseStudies)
    .filter((cs) => cs.sections.length > 0)
    .map((cs) => {
      const lines = [`${cs.title} (${cs.meta})`, `Summary: ${cs.summary}`];
      for (const s of cs.sections) lines.push(`${s.heading}: ${s.body}`);
      return lines.join("\n");
    })
    .join("\n\n---\n\n");
}

export const PROJECT_NOTES = `Jet Dash (Technergetics, 2023–24 — I was the Lead UX Designer; I led the UX/design, working with SMEs, engineering, management, and stakeholders to turn requirements and user research into the experience):

What it is — a web + delivery mobile application for U.S. Air Force Aerospace Ground Equipment (AGE) maintainers and dispatchers. It lets Airmen request support equipment for the flightline through equipment ordering, delivery, and tracking — without land mobile radios or landlines. Customers can schedule requests before maintenance start times and keep visibility of when they requested support, the equipment, and an estimated time of arrival on their assigned mobile device.

The problem it solved — for years, maintainers used land mobile radios or corded landlines to ask AGE dispatchers for equipment on the flightline. Radio transmissions get muddled by flightline noise and enunciation, causing communication errors; there were gaps in relaying delivery priority, and supervision had no visibility into what dispatchers were being tasked with — all degrading maintenance efficiency.

Origin — the idea came from U.S. Air Force Master Sgt. Jacob Sullivan, the 62d Maintenance Squadron's AGE production superintendent ("Why can't Airmen order equipment and tools like they order a ride or food from their phone?"). Technergetics (the software/mobile app development company I was at) built it.

Field test & outcome — starting April 23, 2024 at Joint Base Lewis-McChord (JBLM), Washington, the 62d Maintenance Squadron (62d MXS) collaborated with Tesseract (the Air Force's office of Logistics Innovation) and Technergetics to field-test Jet Dash: evaluating functionality, usability, and effectiveness in real-world maintenance scenarios and collecting feedback directly from the Airmen using it. During the test one Airman received and carried out all incoming orders through the app. The goal is to refine it for use at U.S. Air Force bases around the world; it modernized the delivery of 650+ equipment pieces for thousands of AGE personnel across test sites.

People (for reference — these quotes are theirs, not mine; only cite if relevant): MSgt Jacob Sullivan, creator — "Without face-to-face interaction, supervision has no visibility of what dispatchers are being tasked with. We are in an era where data collection is vital to making strategic decisions to optimize production." Tech. Sgt. Daniel Kosty, program manager at Tesseract — "Jet Dash provides maintainers with the ability to order the tools and equipment they need to keep our aircraft flying while being informed along the way." Others involved: Sherri Petkovsek (senior project manager at Technergetics) and Lt. Col. William Burrous (62d Maintenance Group deputy commander). It was covered by Joint Base Lewis-McChord / McChord AFB public affairs.

Keep answers short and in my voice; pull the specific detail the question asks for rather than dumping all of this.

---

CASE STUDIES (full detail for all projects):

${buildCaseStudyNotes()}`;

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
      "My favorite is Next Gen Bar Prep — the adaptive bar-exam platform I led at BARBRI. It's still being put together on the right, but I'm happy to talk through it. What would you like to know? 👇 [[case-study:next-gen-bar]]",
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
