import { ContentCard } from "@/components/content-card";

const EXPERIENCE = [
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

const EDUCATION = [
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

const CERTIFICATIONS = [
  {
    institution: "ELVTR",
    period: "Nov 2023 – Jan 2024",
    location: "Irvine, CA",
    details: ["Intro to AI Product Design with Robert Redmond"],
  },
];

const SKILLS = [
  {
    category: "Design",
    items: [
      "Persona Mapping",
      "Information Architecture",
      "Interaction Design",
      "Wireframing",
      "Responsive Design",
      "Prototyping",
      "Design Systems",
      "Design Operations",
    ],
  },
  {
    category: "Handoff",
    items: ["Data Labeling", "Tokenization", "Naming Conventions", "Walkthroughs", "Changelogs", "Annotations", "Q&A"],
  },
  {
    category: "Stack",
    items: ["Figma", "Figjam", "Webflow", "Framer", "Lucid Chart", "VS Code", "Storybook", "YouTrack"],
  },
  {
    category: "Other",
    items: ["Agile Methodologies", "Component Libraries"],
  },
];

export default function Resume() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
        {/* Header */}
        <div className="mb-10 grid items-center gap-4 md:grid-cols-[1fr_200px]">
          <div>
            <h1 className="text-h1 font-bold tracking-tight">William Box</h1>
            <p className="text-body-lg text-muted-foreground">Product Designer</p>
          </div>
          <div className="font-mono text-body-xs text-muted-foreground">
            <p>www.whoiswillbox.com</p>
            <p>csswillbox@gmail.com</p>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_200px]">
          {/* Left: Experience + Education + Certifications */}
          <div className="flex flex-col gap-10">
            {/* Experience */}
            <section className="flex flex-col gap-6">
              <h2 className="text-h3 font-semibold tracking-tight">Experience</h2>
              {EXPERIENCE.map((job) => (
                <div key={`${job.company}-${job.role}`} className="flex flex-col gap-2">
                  <div>
                    <p className="text-body-md font-semibold">
                      <span>{job.company}</span>
                      <span className="font-normal text-muted-foreground">, {job.role}</span>
                    </p>
                    <p className="font-mono text-body-xs text-muted-foreground">
                      {job.period} | {job.location}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="text-body-sm leading-relaxed text-muted-foreground">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="flex flex-col gap-4">
              <h2 className="text-h3 font-semibold tracking-tight">Education</h2>
              {EDUCATION.map((e) => (
                <div key={e.institution} className="flex flex-col gap-0.5">
                  <p className="text-body-md font-semibold">{e.institution}</p>
                  <p className="font-mono text-body-xs text-muted-foreground">
                    {e.period} | {e.location}
                  </p>
                  {e.details.map((d) => (
                    <p key={d} className="text-body-sm text-muted-foreground">{d}</p>
                  ))}
                </div>
              ))}
            </section>

            {/* Certifications */}
            <section className="flex flex-col gap-4">
              <h2 className="text-h3 font-semibold tracking-tight">Certifications</h2>
              {CERTIFICATIONS.map((c) => (
                <div key={c.institution} className="flex flex-col gap-0.5">
                  <p className="text-body-md font-semibold">{c.institution}</p>
                  <p className="font-mono text-body-xs text-muted-foreground">
                    {c.period} | {c.location}
                  </p>
                  {c.details.map((d) => (
                    <p key={d} className="text-body-sm text-muted-foreground">{d}</p>
                  ))}
                </div>
              ))}
            </section>
          </div>

          {/* Right: Skills */}
          <div className="flex flex-col gap-6">
            <h2 className="text-h3 font-semibold tracking-tight">Skills</h2>
            {SKILLS.map((s) => (
              <div key={s.category} className="flex flex-col gap-1">
                <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
                  {s.category}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {s.items.map((item) => (
                    <li key={item} className="text-body-sm text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
