"use client";

import * as React from "react";
import { ComputerDesktopIcon, DevicePhoneMobileIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";
import { CaseStudyLayout } from "@/components/case-study-layout";
import { SegmentedControl, SegmentedControlItem } from "@/components/cardboard/segmented-control";
import { TngsLogo } from "@/components/tngs-logo";
import { WEB_SUMMARY, WEB_CONTRIBUTIONS, WEB_SECTIONS, WEB_GROUPS } from "./web-content";
import { MOBILE_SUMMARY, MOBILE_CONTRIBUTIONS, MOBILE_SECTIONS, MOBILE_GROUPS } from "./mobile-content";

type Platform = "web" | "mobile";

const META = [
  { label: "Company", value: "Technergetics" },
  { label: "Timeline", value: "2022–24" },
  { label: "Role", value: "Lead UX Designer" },
];

export default function DesignStandards() {
  const [platform, setPlatform] = React.useState<Platform>("web");
  const isWeb = platform === "web";

  return (
    <ContentCard className="h-full overflow-auto">
      <CaseStudyLayout
        title="Design Standards"
        summary={isWeb ? WEB_SUMMARY : MOBILE_SUMMARY}
        heroContent={<TngsLogo className="w-3/4 max-w-lg text-foreground" />}
        meta={META}
        contributions={isWeb ? WEB_CONTRIBUTIONS : MOBILE_CONTRIBUTIONS}
        sections={isWeb ? WEB_SECTIONS : MOBILE_SECTIONS}
        groups={isWeb ? WEB_GROUPS : MOBILE_GROUPS}
        headerExtra={
          <SegmentedControl
            aria-label="Platform"
            value={platform}
            onValueChange={(v) => setPlatform(v as Platform)}
          >
            <SegmentedControlItem value="web" icon={<ComputerDesktopIcon />}>
              Web
            </SegmentedControlItem>
            <SegmentedControlItem value="mobile" icon={<DevicePhoneMobileIcon />}>
              Mobile
            </SegmentedControlItem>
          </SegmentedControl>
        }
      >
      </CaseStudyLayout>
    </ContentCard>
  );
}
