import { ShieldCheckIcon } from "@heroicons/react/24/solid";
import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";
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
      <CaseStudyLayout
        title="Upgrade"
        summary="Modernizing the Space-A passenger experience by reducing the surplus resource strain."
        hero={{
          src: "/projects/upgrade/hero.jpg",
          alt: "Space Available passengers in line to board a Boeing 747-400 on the flightline, with C-17s in the background",
        }}
        meta={META}
        contributions={CONTRIBUTIONS}
        sections={SECTIONS}
      >
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
