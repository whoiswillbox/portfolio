import {
  NativeSelect,
  NativeSelectOption,
} from "@/components/cardboard/native-select";
import { ComponentPage, Demo } from "../_component-page";

export default function NativeSelectDocs() {
  return (
    <ComponentPage
      title="Native Select"
      description="A styled native <select> — full OS accessibility, with a Cardboard chevron and tokens."
    >
      <Demo title="Default">
        <NativeSelect defaultValue="apple">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
          <NativeSelectOption value="pear">Pear</NativeSelectOption>
        </NativeSelect>
      </Demo>

      <Demo title="Small">
        <NativeSelect size="sm" defaultValue="apple">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
          <NativeSelectOption value="orange">Orange</NativeSelectOption>
        </NativeSelect>
      </Demo>

      <Demo title="Disabled">
        <NativeSelect disabled defaultValue="apple">
          <NativeSelectOption value="apple">Apple</NativeSelectOption>
        </NativeSelect>
      </Demo>
    </ComponentPage>
  );
}
