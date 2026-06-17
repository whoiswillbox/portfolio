import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EMAIL } from "@/lib/contact";

const ARTICLE_URL =
  "https://www.mcchord.af.mil/News/Article-Display/Article/3760946/";

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

function ArticleLink() {
  return (
    <a
      href={ARTICLE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1 font-mono text-body-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:text-muted-foreground"
    >
      Field Test Article
      <ArrowUpRightIcon className="size-3.5" />
    </a>
  );
}

export default function Jetdash() {
  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="Jet Dash"
        summary="Modernizing maintenance efficiency by eliminating archaic communication processes."
        hero={{
          src: "/projects/jetdash/hero.jpg",
          alt: "Airmen reviewing a JetDash equipment request on a shop display at McChord Air Force Base",
        }}
        headerExtra={<ArticleLink />}
        meta={META}
        contributions={CONTRIBUTIONS}
        sidebarExtra={<ArticleLink />}
        sections={SECTIONS}
      >
        {/* JetDash in the field */}
        <div className="grid gap-3 sm:grid-cols-2">
          {[
            {
              src: "/projects/jetdash/catalog.webp",
              alt: "An Airman browsing the JetDash AGE equipment catalog by category",
            },
            {
              src: "/projects/jetdash/confirmation.jpg",
              alt: "JetDash order confirmation screen after submitting an equipment request",
            },
          ].map((img) => (
            <div
              key={img.src}
              className="relative aspect-[3/2] w-full overflow-hidden rounded-xl ring-1 ring-border"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 640px) 28rem, 100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

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
      </CaseStudyLayout>
    </ContentCard>
  );
}
