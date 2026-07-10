import {
  InformationCircleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { ComponentPage, Demo } from "../_component-page";

export default function AlertDocs() {
  return (
    <ComponentPage
      title="Alert"
      description="An inline message that draws attention to a state or outcome, colored by intent."
    >
      <Demo title="Default">
        <div className="w-full max-w-lg">
          <Alert>
            <InformationCircleIcon />
            <AlertTitle>Heads up</AlertTitle>
            <AlertDescription>A neutral message with no particular intent.</AlertDescription>
          </Alert>
        </div>
      </Demo>

      <Demo title="Info" caption="For informational context.">
        <div className="w-full max-w-lg">
          <Alert variant="info">
            <InformationCircleIcon />
            <AlertTitle>Good to know</AlertTitle>
            <AlertDescription>This uses the info intent surface and accent.</AlertDescription>
          </Alert>
        </div>
      </Demo>

      <Demo title="Success" caption="For a positive outcome.">
        <div className="w-full max-w-lg">
          <Alert variant="success">
            <CheckCircleIcon />
            <AlertTitle>All set</AlertTitle>
            <AlertDescription>Your changes were saved successfully.</AlertDescription>
          </Alert>
        </div>
      </Demo>

      <Demo title="Destructive" caption="For errors and failures.">
        <div className="w-full max-w-lg">
          <Alert variant="destructive">
            <ExclamationTriangleIcon />
            <AlertTitle>Something went wrong</AlertTitle>
            <AlertDescription>We couldn&apos;t complete that request.</AlertDescription>
          </Alert>
        </div>
      </Demo>
    </ComponentPage>
  );
}
