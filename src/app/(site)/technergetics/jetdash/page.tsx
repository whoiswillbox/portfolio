import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { ContentCard } from "@/components/content-card";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EMAIL } from "@/lib/contact";

// TODO: replace with the real published field-test article URL.
const ARTICLE_URL = "#";

const META = [
  { label: "Company", value: "Technergetics" },
  { label: "Timeline", value: "2023–24" },
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
      'Aerospace ground equipment "AGE" maintainers are responsible for inspecting, repairing and maintaining equipment that enables mission ready aircrafts. AGE dispatchers are responsible for operations on the flightline and safe execution of flight missions. Without the success of these individuals, aircrafts would never takeoff.',
      "For decades, many challenges have accrued for efficiently getting equipment to the flightline. U.S. Air Force Master Sgt. Jacob Sullivan, the 62d Maintenance Squadron's AGE production superintendent proposed the idea of Jet Dash to remedy these challenges.",
      '"Why can\'t Airmen order equipment and tools like they order a ride or food from their phone?" — MSgt Jacob Sullivan',
    ],
  },
  {
    heading: "Goal",
    paragraphs: [
      "Aerospace ground equipment personnel needed a more efficient way to streamline their equipment retrieval processes. Communication solely through radios and landlines posed several barriers that tended to result in degrading maintenance efficiency.",
      '"Without face-to-face interaction, supervision has no visibility of what dispatchers are being tasked with. We are in an era where data collection is vital to making strategic decisions to optimize production." — MSgt Jacob Sullivan',
    ],
  },
  {
    heading: "Outcome",
    paragraphs: [
      "At Technergetics, I worked closely with sme, engineering, management, and stakeholders to translate customer requirements & user research into experiences that would mitigate AGE personnel's communication barriers when getting equipment successfully to the flight line.",
      "Jet Dash is an e-commerce web & delivery mobile application that modernizes AGE maintainers & dispatcher's day-day operations through equipment ordering, delivery, and tracking that has demonstrated proven capability to improve communications, streamline processes, and reimagine maintenance operations.",
      "Jet Dash has been shipped and field tested at Andersen Air Force Base (AAFB), Guam and Joint Base Lewis-McChord, Washington which has modernized the delivery of 650+ equipment pieces for thousands of AGE personnel.",
    ],
  },
];

export default function Jetdash() {
  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
        {/* Hero */}
        <header className="flex flex-col gap-3">
          <h1 className="text-h1 font-bold tracking-tight">Jet Dash</h1>
          <p className="max-w-xl text-body-lg text-muted-foreground">
            Modernizing maintenance efficiency by eliminating archaic
            communication processes.
          </p>
          <a
            href={ARTICLE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex w-fit items-center gap-1 font-mono text-body-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:text-muted-foreground"
          >
            Field Test Article
            <ArrowUpRightIcon className="size-3.5" />
          </a>
        </header>

        {/* Hero image — drop the real asset in /public/projects/jetdash/ and
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
            <a
              href={ARTICLE_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex w-fit items-center gap-1 font-mono text-body-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:text-muted-foreground"
            >
              Field Test Article
              <ArrowUpRightIcon className="size-3.5" />
            </a>
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
