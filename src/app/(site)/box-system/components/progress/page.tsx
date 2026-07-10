import { Progress } from "@/components/cardboard/progress";
import { ComponentPage, Demo } from "../_component-page";

export default function ProgressDocs() {
  return (
    <ComponentPage
      title="Progress"
      description="A determinate progress bar. The track uses the secondary surface; the fill is the solid action token."
    >
      <Demo title="Values">
        <div className="flex w-full max-w-md flex-col gap-4">
          <Progress value={25} />
          <Progress value={50} />
          <Progress value={80} />
          <Progress value={100} />
        </div>
      </Demo>
    </ComponentPage>
  );
}
