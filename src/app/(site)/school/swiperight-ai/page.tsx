import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";

const META = [
  { label: "Company", value: "ELVTR" },
  { label: "Timeline", value: "Dec 2023–Feb 2024" },
  { label: "Role", value: "Product Designer" },
  { label: "Team", value: "Julia DeGemmis\nPaul Malabianan\nNaz Zia" },
];

const CONTRIBUTIONS = [
  "Interaction Architecture",
  "Feature Documentation",
  "Wireframing",
  "Prototyping",
  "Prompt Engineering",
];

const SECTIONS = [
  {
    heading: "Background",
    paragraphs: [
      "In recent times, dating apps have been the #1 outlet for singles to meet their future partner. Within dating applications, crafting your profile has and will always be an integral part of the matchmaking experience. Research shows that humans often struggle with presenting the best version of themselves digitally due to balance, overwhelm, and uncertainty.",
      '"Users often struggle to find a balance between presenting their authentic selves and showcasing the aspects they believe will be attractive to potential matches." – ChatGPT',
      '"Users may feel overwhelmed when faced with a variety of prompts, unsure which ones will showcase their personality effectively. Too many choices can lead to decision paralysis, hindering profile completion." – ChatGPT',
      '"The biggest and most common mistake men make with their online dating profiles boils down to not being deliberate about what they share...You get just six photos and 3–6 sentences of written text to communicate who you are. That\'s not a lot of canvas, and the competition is fierce, so each photo and word matters if you want to meet an awesome partner online." – Blaine Anderson, dating coach',
    ],
  },
  {
    heading: "Goal",
    paragraphs: [
      "To leverage Generative AI to help combat dating app user's issues with profile optimization. Profile optimization encompasses the implementation of strategies to empower users in presenting their best selves and increasing confidence. Aiming at profile optimization to help dating app users select prompts and types of photos that will increase their chances with matching with their preferred type. However, the answers will be up to the user, ensuring authenticity remains intact. In order to achieve this, fostering a culture for continuous model improvement is a must.",
    ],
  },
  {
    heading: "Outcome",
    paragraphs: [
      "SwipeRight.ai is a third party service that leverages Gen AI to help dating app user's create more effective profiles. A personalized learning assistant that works by establishing a feedback loop between the user and system to gather historical and present data on user's photos & prompts, while also gathering preferred audience trends. The SwipeRight.ai model creates general and audience-tailored recommendations for users to revise their prompts and photos. The model gets fueled by recommendation driven matchmaking. If the model's recommendations don't lead to new matches over time, it will re-analyze current preferred audience trends and provide new and improved recommendations. The model drives value to the user by helping them create a more performative profile while also remaining authentic. The model also has the potential to deliver value to the business through monetization & partnership opportunities.",
    ],
  },
];

const GROUPS = [
  {
    label: "The journey for love",
    items: [
      {
        heading: "At a glance",
        paragraphs: [
          "A high level overview of a dating app user's journey. In order to leverage AI, it's crucial to understand the dating app user's journey and the problems that arise with receiving likes or matches. AI is cool and everything, but without problem solving utility, it won't serve a purpose. The team decided to target the profile revision step within the journey as research showed profile optimization was a leading factor in failed matchmaking.",
        ],
        image: { src: "/projects/swiperight-ai/user journey.png", alt: "Dating app user journey map", width: 1200, height: 300 },
      },
    ],
  },
  {
    label: "Wait wait... how will AI enhance the journey for love?",
    items: [
      {
        heading: "Historical recommendations",
        paragraphs: [
          "On initial user sign up, the user will have the option to opt into profile recommendations. The user will be prompted to select preferred or general recommendations. If preferred, the SwipeRight.ai model will scan and analyze historical preferred audience trends of most interacted prompts and photo types to provide recommendations. If no, the model will instead scan and analyze historical user wide trends to provide general recommendations. Unless the user opts-out entirely, SwipeRight.ai profile optimization will commence on user sign up.",
        ],
        image: { src: "/projects/swiperight-ai/Historical data recommendations.png", alt: "Historical recommendations flow diagram", width: 1200, height: 500 },
      },
      {
        heading: "Preferred recommendations",
        paragraphs: [
          "The model will examine existing and current trends based off of gender, age, location and ethnicity data. Users that posses these preferred data points will be analyzed based off of reocurring prompts [utilizing classification of supervised data] and photo types [utilizing deep learning image recognition/regression] they engage with. The model will funnel that data and redirect it back to the user in recommendations to help optimize their profile.",
        ],
        image: { src: "/projects/swiperight-ai/Initial recommendations.png", alt: "Preferred recommendations model diagram", width: 1200, height: 500 },
      },
      {
        heading: "Over time recommendations",
        paragraphs: [
          "The model is designed to become more intelligent over time. If recommendation based matchmaking occurs, the model will foster continuous improvement. If recommendation based matchmaking does not occur, the model will re-recommend recommendations until it does occur. A consideration with this may be visibility, if so, [utilizing regression/classification], the model can performance monitor engagement on which photo/prompt lead to skipping profiles, thus recommending shuffling photos and prompts. Users will now know which photo or prompt is not leading to matchmaking success. Regardless of recommendation based matchmaking, the model is setup to receive and continuously train data overtime eventually leading to more accurate recommendations.",
        ],
        image: { src: "/projects/swiperight-ai/Over time recommendations.png", alt: "Over time recommendations model diagram", width: 1200, height: 400 },
      },
    ],
  },
  {
    label: "Ok got it, but will it deliver value?",
    compact: true,
    items: [
      {
        subheading: "User value",
        heading: "Time and Effort Saving",
        paragraphs: [
          "Reducing the time and effort users need to invest in optimizing their profile. User can focus on connecting with potential matches rather than struggling to create an attractive profile. It also saves time and effort for profile viewers since they can glean more from robust profiles.",
        ],
      },
      {
        heading: "Enhanced Trust",
        paragraphs: [
          "Fosters trust within the user, knowing SwipeRight.ai has their best interest in mind (matching, not just profiting). With interests and profile content reflecting each other, it bolsters user authenticity, ultimately making users feel safer.",
        ],
      },
      {
        heading: "Quality Connections",
        paragraphs: [
          "Personalized and targeted profiles to allow users' conversations to build upon richer profile content by surfacing commonalities. It jumpstarts their conversations and builds stronger connections.",
        ],
      },
      {
        heading: "Success Stories",
        paragraphs: [
          "Users have increased likelihood of their profile resonating with their desired audience, increasing their likelihood of finding their match.",
        ],
      },
      {
        subheading: "Business value",
        heading: "User Acquisition/Retainment",
        paragraphs: [
          "Attracts new users seeking a better dating experience, as well as aims to mitigate consumer churn due to increased matchmaking.",
        ],
      },
      {
        heading: "Data Monetization",
        paragraphs: [
          "Provides valuable insights and info for targeted advertising and sets their product apart from competitors. This data can be monetized to create additional revenue streams for the business.",
        ],
      },
      {
        heading: "Competitive Advantage",
        paragraphs: [
          "Positions their product as a market leader. This product's unique approach and AI-powered analysis, give the business a competitive advantage in the online dating industry/apps.",
        ],
      },
    ],
  },
];

export default function SwipeRightAI() {
  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="SwipeRight.ai"
        summary="Leveraging GenAI to enhance profile optimization within dating app users."
        hero={{
          src: "/projects/swiperight-ai/Mockups.png",
          alt: "SwipeRight.ai app screens showing profile optimization recommendations",
          contain: true,
        }}
        meta={META}
        contributions={CONTRIBUTIONS}
        sections={SECTIONS}
        groups={GROUPS}
      />
    </ContentCard>
  );
}
