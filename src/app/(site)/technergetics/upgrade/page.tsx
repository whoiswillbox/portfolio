import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { ContentCard } from "@/components/content-card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EMAIL } from "@/lib/contact";

const META = [
  { label: "Company", value: "Technergetics" },
  { label: "Timeline", value: "2022–24" },
  { label: "Role", value: "Lead UX Designer" },
];

const CONTRIBUTIONS = [
  "Competitive Audits",
  "Persona Mapping",
  "Information Architecture",
  "Interaction Models",
  "Visual Design",
  "Handoff",
];

const SECTIONS = [
  {
    heading: "Background",
    paragraphs: [
      "Air Mobility Command (AMC) is a major command of the United States Air Force (USAF) responsible for airlift, air refueling, aeromedical evacuation, and air mobility support. AMC plays a crucial role in providing the U.S. military with rapid global mobility, enabling the transportation of personnel, equipment, and supplies to anywhere in the world at a moment's notice. Space Available (Space-A) travel is a benefit offered by the U.S. military that allows eligible passengers to fly on military aircraft when there are available seats. This program is managed by Air Mobility Command, which oversees the flights on which Space-A passengers can travel. Space-A travel has been known for its cost effective, yet unpredictable alternative to commercial air travel.",
      "For decades, AMC managed Space-A travel processes have posed significant resource strains on eligible passengers and AMC Terminal personnel. Current commercial systems address Space Required (Space-R) requirements but fail to address unique Space-A processes.",
      "Collaboration with 436th Aerial Port Squadron (Dover AFB) and AMC's Baltimore-Washington International Gateway (BWI) allowed Technergetics to understand the Space-A passenger journey in greater detail. Manual methods, lack of transparency, process bottlenecks, and constricted mission execution windows deemed to be the most common resource strain examples these passengers and personnel live with today.",
    ],
  },
  {
    heading: "Goal",
    paragraphs: [
      "Air Mobility Command needed a way to streamline their antiquated military passenger travel processes so AMC Terminal personnel can efficiently assist in getting Space-A passengers from point a to b.",
    ],
  },
  {
    heading: "Outcome",
    paragraphs: [
      "At Technergetics, I worked closely with sme, engineering, management, and stakeholders to translate customer requirements and user research into experiences that would mitigate resource strain for AMC Terminal personnel and Space-A passengers.",
      "Upgrade is an air terminal web & passenger mobile application that is designed to modernize Space-A travel through automated processes (passenger sign-ups, roll calls, selection, baggage tracking), increased predictability (flight schedules) and remote capabilities (passenger check-ins, meal selection/ordering, boarding passes).",
    ],
  },
];

export default function Upgrade() {
  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
        {/* Hero */}
        <header className="flex flex-col gap-3">
          <h1 className="text-h1 font-bold tracking-tight">Upgrade</h1>
          <p className="max-w-xl text-body-lg text-muted-foreground">
            Modernizing the Space-A passenger experience by reducing the surplus
            resource strain.
          </p>
        </header>

        {/* Hero image — drop the real asset in /public/projects/upgrade/ and
            swap this placeholder for next/image. */}
        <div className="mt-8 aspect-[16/7] w-full rounded-xl bg-gradient-to-br from-muted to-muted-foreground/30" />

        {/* Body: metadata sidebar + sections */}
        <div className="mt-20 grid gap-10 md:grid-cols-[180px_1fr]">
          {/* Metadata */}
          <aside className="flex flex-col gap-6 md:sticky md:top-6 md:self-start">
            {META.map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
                  {m.label}
                </p>
                <p className="text-body-sm text-muted-foreground">{m.value}</p>
              </div>
            ))}
            <div className="flex flex-col gap-1">
              <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
                Contributions
              </p>
              <ul className="flex flex-col gap-0.5">
                {CONTRIBUTIONS.map((c) => (
                  <li key={c} className="text-body-sm text-muted-foreground">
                    {c}
                  </li>
                ))}
              </ul>
            </div>
          </aside>

          {/* Sections */}
          <div className="flex flex-col gap-8">
            {SECTIONS.map((s) => (
              <section key={s.heading} className="flex flex-col gap-3">
                <h2 className="text-h3 font-semibold tracking-tight">{s.heading}</h2>
                {s.paragraphs.map((p, i) => (
                  <p key={i} className="text-body-md leading-relaxed text-foreground">
                    {p}
                  </p>
                ))}
              </section>
            ))}

            <Alert variant="success">
              <ShieldCheckIcon />
              <AlertTitle>These designs are protected</AlertTitle>
              <AlertDescription>
                Please feel free to reach out to me{" "}
                <a href={`mailto:${EMAIL}`} className="underline underline-offset-2">
                  {EMAIL}
                </a>
                , as I would be more than happy to discuss my experiences.
              </AlertDescription>
            </Alert>
          </div>
        </div>
      </article>
    </ContentCard>
  );
}
