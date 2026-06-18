import { ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";

const APP_STORE_URL = "https://apps.apple.com/us/app/lightcert/id1546766262";

const META = [
  { label: "Company", value: "Lightcert" },
  { label: "Timeline", value: "2022" },
  { label: "Role", value: "UX/UI Design Intern" },
];

const CONTRIBUTIONS = [
  "Heuristic Evaluation",
  "User Research",
  "UX / UI",
  "Design Systems",
  "Handoff",
];

const SECTIONS = [
  {
    heading: "Background",
    paragraphs: [
      "Lightcert, a fan engagement app, is crafted to enhance live music experiences by orchestrating audience-wide light displays. Its multifaceted design aims to connect fans and artists, broaden creative possibilities, foster a sense of community, and facilitate interactive collaboration. The app goes beyond the conventional boundaries of fan engagement, offering a platform where the worlds of music and visual spectacle seamlessly converge, creating an immersive and unforgettable live entertainment experience.",
    ],
  },
  {
    heading: "Goal",
    paragraphs: [
      "Concert goers needed a way to feel more engaged with their community and artist. Lightcert targets small to large venues to enhance the concert experience by providing a platform that fosters community and immersion.",
    ],
  },
  {
    heading: "Outcome",
    paragraphs: [
      "At Lightcert, I worked closely with design, product management, engineering, marketing, and business development to revamp their current MVP for Q2 release.",
      "My deliverables for v.2 included:",
      "▸ Heuristic evaluation of Lightcert's original state\n▸ Obtain & translate outreach insights into design solutions\n▸ Iterate based on feedback from users, product management, and founders.\n▸ Design new components/styles for Lightcert design system\n▸ Delivering final assets for production",
    ],
  },
];

const GROUPS = [
  {
    label: "Concerts just got a whole lot brighter",
    items: [
      {
        heading: "Onboarding",
        paragraphs: ["For v.2, concert goers now have a more clear and concise walkthrough on how to successfully use Lightcert."],
        gif: { src: "/projects/lightcert/onboarding.gif", alt: "Lightcert onboarding flow animation", size: "w-80" },
      },
      {
        heading: "Happy path",
        paragraphs: ["For v.2, concert goers now have a more streamlined experience when selecting their venue, artist, and song."],
        gif: { src: "/projects/lightcert/happy-path.gif", alt: "Lightcert venue and song selection flow animation", size: "w-80" },
      },
    ],
  },
  {
    label: "Wait we can save AND share our experience?",
    items: [
      {
        heading: "Share",
        paragraphs: ["A new feature that was shipped for v.2 was the ability to share your immersive concert experience. Utilizing a bottom sheet, concert goers can not only save their experience but share it."],
        gif: { src: "/projects/lightcert/share.gif", alt: "Lightcert share bottom sheet animation" },
      },
    ],
  },
  {
    label: "The new generation of lighters",
    items: [
      {
        heading: "Louis Tomlinson, Youtube Theatre 2022",
        paragraphs: ["This is a snippet from the Louis Tomlinson show, the launch of Q2. All of the blue and red lights are Lightcert users. Lightcert aims to bridge the gap between art and technology to bring fans together. Lightcert transforms the audience into part of the show itself, creating an interactive experience like no other."],
        gif: { src: "/projects/lightcert/ezgif.com-gif-maker-3 copy.gif", alt: "Louis Tomlinson concert at Youtube Theatre 2022 with Lightcert users lighting up the venue", wide: true },
      },
    ],
  },
  {
    label: "What are the fans saying?",
    items: [
      {
        heading: "Absolutely solid.",
        paragraphs: [
          '"Yo this app– I\'m going to see Harry on September 29 and I\'m so pumped and this app and the whole idea of the app just makes me even more excited. If been to concerts in the past for other artists and we\'ve always used tape and so now that we can just use our phone screens AND VIDEO is golden, (see what I did there). anyways I\'m so excited for this and I\'m so glad that the creators came up with this!"',
          "–sheryl6734",
        ],
      },
      {
        heading: "AMAZING!!",
        paragraphs: [
          '"The app is so easy to use and it\'s such a great idea to use for fan projects at concerts!! there\'s nothing confusing about it and it doesn\'t take long to figure out!!!"',
          "–angd03",
        ],
      },
      {
        heading: "I'm so excited!!!",
        paragraphs: [
          '"This is my first time ever going to a Harry Styles concert and I think this is the best and most convenient ways for us fans to come together and do something for the artist/s we love and support."',
          "–msixelaj",
        ],
      },
    ],
  },
];

function AppStoreLink() {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex w-fit items-center gap-1 font-mono text-body-xs font-medium uppercase tracking-wide text-foreground transition-colors hover:text-muted-foreground"
    >
      View on App Store
      <ArrowUpRightIcon className="size-3.5" />
    </a>
  );
}

export default function Lightcert() {
  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="Lightcert"
        summary="A new way to experience live music."
        hero={{
          src: "/projects/lightcert/Frame 1.png",
          alt: "Two iPhones showing the Lightcert app — splash screen and setlist screen at a concert",
          contain: true,
        }}
        headerExtra={<AppStoreLink />}
        meta={META}
        contributions={CONTRIBUTIONS}
        sidebarExtra={<AppStoreLink />}
        sections={SECTIONS}
        groups={GROUPS}
      >
      </CaseStudyLayout>
    </ContentCard>
  );
}
