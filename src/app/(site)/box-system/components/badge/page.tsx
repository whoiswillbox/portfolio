import { CheckIcon } from "@heroicons/react/24/outline";
import { Badge } from "@/components/ui/badge";
import { ComponentPage, Demo } from "../_component-page";

const VARIANTS = ["default", "secondary", "destructive", "outline", "ghost", "warning", "link"] as const;

export default function BadgeDocs() {
  return (
    <ComponentPage
      title="Badge"
      description="A compact label for status, counts, or categories. Sits inline with text."
    >
      <Demo title="Variants" caption="warning is a mono, uppercase treatment for status flags.">
        {VARIANTS.map((v) => (
          <Badge key={v} variant={v}>
            {v}
          </Badge>
        ))}
      </Demo>

      <Demo title="With icon" caption="Icons are auto-sized and sit before the label.">
        <Badge>
          <CheckIcon />
          Verified
        </Badge>
        <Badge variant="secondary">
          <CheckIcon />
          Done
        </Badge>
      </Demo>
    </ComponentPage>
  );
}
