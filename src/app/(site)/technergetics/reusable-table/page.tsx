import { ShieldCheckIcon, MagnifyingGlassIcon, ChevronUpDownIcon, ChevronLeftIcon, ChevronRightIcon, ChevronDownIcon, Squares2X2Icon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { EMAIL } from "@/lib/contact";

const HEADERS = ["Header", "Header", "Header", "Header", "Header", "Header", "Header", "Header"];
const ROWS = Array.from({ length: 14 }, (_, i) => i);

function TableMockup() {
  return (
    <div className="absolute inset-0 flex flex-col overflow-hidden bg-white font-sans text-[11px]">
      {/* Toolbar */}
      <div className="flex items-center gap-2 border-b border-[#d2d2d2] bg-white px-4 py-2">
        <div className="flex items-center gap-1.5 rounded border border-[#8a8d90] bg-white px-2 py-1 text-[#6a6e73]">
          <MagnifyingGlassIcon className="size-3 shrink-0" />
          <span className="text-[10px]">Search</span>
        </div>
        <div className="ml-1 h-4 w-px bg-[#d2d2d2]" />
        <button className="rounded bg-[#0066cc] px-3 py-1 text-[10px] font-medium text-white">Primary</button>
        <button className="rounded border border-[#0066cc] bg-white px-3 py-1 text-[10px] font-medium text-[#0066cc]">Secondary</button>
        <div className="ml-1 h-4 w-px bg-[#d2d2d2]" />
        <div className="flex size-6 items-center justify-center rounded border border-[#8a8d90] bg-white text-[#6a6e73]">
          <Squares2X2Icon className="size-3" />
        </div>
        <div className="ml-auto flex items-center gap-1 text-[10px] text-[#6a6e73]">
          <span>1 – 25 of 20</span>
          <ChevronDownIcon className="size-3" />
          <div className="h-4 w-px bg-[#d2d2d2]" />
          <ChevronLeftIcon className="size-3" />
          <ChevronRightIcon className="size-3" />
        </div>
      </div>
      {/* Header row */}
      <div className="grid grid-cols-8 border-b border-[#d2d2d2] bg-[#f0f0f0]">
        {HEADERS.map((h, i) => (
          <div key={i} className="flex items-center gap-0.5 px-4 py-2 text-[10px] font-bold text-[#151515]">
            {h}
            <ChevronUpDownIcon className="size-2.5 text-[#6a6e73]" />
          </div>
        ))}
      </div>
      {/* Rows */}
      <div className="flex-1 overflow-hidden">
      {ROWS.map((r) => (
        <div key={r} className="grid grid-cols-8 border-b border-[#d2d2d2] last:border-0">
          {HEADERS.map((_, i) => (
            <div key={i} className="px-4 py-2.5 text-[10px] text-[#151515]">
              {i === 7 ? (
                <span className="rounded-full bg-[#e7f1fa] px-2 py-0.5 text-[9px] font-medium text-[#0066cc]">Label</span>
              ) : "Cell"}
            </div>
          ))}
        </div>
      ))}
      </div>
      {/* Footer pagination */}
      <div className="flex items-center justify-end gap-1 border-t border-[#d2d2d2] bg-[#f0f0f0] px-4 py-2 text-[10px] text-[#6a6e73]">
        <span>1 – 25 of 20</span>
        <ChevronDownIcon className="size-3" />
        <div className="h-4 w-px bg-[#d2d2d2]" />
        <ChevronLeftIcon className="size-3" />
        <ChevronRightIcon className="size-3" />
      </div>
    </div>
  );
}

const META = [
  { label: "Company", value: "Technergetics" },
  { label: "Timeline", value: "2023–24" },
  { label: "Role", value: "Lead UX Designer" },
];

const CONTRIBUTIONS = [
  "Secondary Research",
  "Strategy",
  "Documentation",
  "Interaction Design",
  "Visual Design",
  "Handoff",
];

const SECTIONS = [
  {
    heading: "Background",
    paragraphs: [
      "Technergetics delivers software in an extremely fast-paced agile environment. Keeping technical debt at a minimum is the upmost priority, unfortunately delivering good experiences can tend to get overlooked.",
    ],
  },
  {
    heading: "Goal",
    paragraphs: [
      "Technergetics needed a way to speed up development processes while ensuring a good experience for their users.",
      "The build out of reusable and standardized components aimed to eliminate code duplication, reduce maintenance complexities, and deliver cohesive experiences.",
    ],
  },
  {
    heading: "Outcome",
    paragraphs: [
      "I worked closely with engineering to determine an efficient starting point. Tables were deemed a top priority due to their consistent application across Technergetics products.",
      "Based off of extensive research and collaboration. My findings were that the current toolbar attributes and functionality seemed to have the biggest gap across Technergetics experiences. The behavior of the table also had inconsistencies that needed to be standardized.",
      "I compiled re-occuring themes and functionality to eventually define a reusable table and its respective standards.",
      "At the time of writing this, the Technergetics reusable table has been built, allowing for interchangeable functionality/logic depending on application use case, as well as, streamlining familiarity across experiences to shape their users mental model.",
      "Their technical debt has been reduced and their experiences just got a whole lot better.",
    ],
  },
];

const GROUPS = [
  {
    label: "A table's best friend",
    items: [
      {
        heading: "Search",
        paragraphs: [
          "The first attribute of the toolbar is an omnisearch. The omnisearch provides a unified searching experience, eliminating the need to perform separate search capabilities to locate desired data.",
        ],
        image: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/Toolbar - search.png",
          alt: "Reusable table toolbar showing the omnisearch input",
          width: 800,
          height: 120,
        },
      },
      {
        heading: "Actions",
        paragraphs: [
          "The second attribute of the toolbar is an action group. The action group will allow users to perform any table or row specific tasks.",
        ],
        image: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/Toolbar - actions.png",
          alt: "Reusable table toolbar showing Primary and Secondary action buttons",
          width: 800,
          height: 120,
        },
      },
      {
        heading: "View",
        paragraphs: [
          "The third attribute of the toolbar is a view toggle. The view toggle button provides flexibility to switch the table between default and compact rows. When dealing with variable amounts of tabular data, toggling different views is necessary.",
        ],
        image: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/Toolbar - view.png",
          alt: "Reusable table toolbar showing the view toggle control",
          width: 800,
          height: 120,
        },
      },
      {
        heading: "Pagination",
        paragraphs: [
          "The fourth attribute of the toolbar is pagination. Defining the amount of data per load. 25 rows was deemed sufficient for the experience.",
        ],
        image: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/Toolbar- pagination.png",
          alt: "Reusable table pagination control showing 1-25 of 20",
          width: 800,
          height: 120,
        },
      },
    ],
  },
  {
    label: "Framing the mental model",
    items: [
      {
        heading: "Split View",
        paragraphs: [
          "Split view pattern consists of populating the adjacent side panel on-row select. The panel will remain visible displaying an empty state to help guide users through the workflow.",
        ],
        gif: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/ezgif.com-animated-gif-maker.gif",
          alt: "Split view pattern — side panel populates on row select",
          wide: true,
        },
      },
      {
        heading: "Nested",
        paragraphs: [
          "Nested pattern consists of navigating the user to a new page on-row select, resulting in a breadcrumb. This pattern is utilized solely on experience use case.",
        ],
        gif: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/ezgif.com-animated-gif-maker-2.gif",
          alt: "Nested pattern — navigates to new page with breadcrumb on row select",
          wide: true,
        },
      },
      {
        heading: "Perform action",
        paragraphs: [
          'Perform action pattern gets utilized in "row specific" and "table specific" contexts. In "row specific" contexts the toolbar actions will be disabled until checkbox selection, unless functionality is "table specific". In both contexts, the pattern directs the user to a modality where they can perform action.',
        ],
        gif: {
          src: "/projects/reusable-table/Portfolio : Reusable Table/ezgif.com-animated-gif-maker-4.gif",
          alt: "Perform action pattern — checkboxes enable toolbar actions on selection",
          wide: true,
        },
      },
    ],
  },
];

export default function ReusableTable() {
  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="Reusable Table"
        summary="Repairing inconsistencies in experiences while reducing technical debt."
        heroContent={<TableMockup />}
        meta={META}
        contributions={CONTRIBUTIONS}
        sections={SECTIONS}
        groups={GROUPS}
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
