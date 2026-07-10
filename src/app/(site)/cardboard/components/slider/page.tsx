import { Slider } from "@/components/cardboard/slider";
import { ComponentPage, Demo } from "../_component-page";

export default function SliderDocs() {
  return (
    <ComponentPage
      title="Slider"
      description="Pick a value or a range along a track. The filled range uses the solid action token; the thumb sits on the focus-ring border."
    >
      <Demo title="Single value">
        <Slider defaultValue={[50]} max={100} step={1} className="max-w-xs" />
      </Demo>

      <Demo title="Range" caption="Two thumbs define a min and max.">
        <Slider defaultValue={[25, 75]} max={100} step={1} className="max-w-xs" />
      </Demo>

      <Demo title="Disabled">
        <Slider defaultValue={[40]} max={100} disabled className="max-w-xs" />
      </Demo>
    </ComponentPage>
  );
}
