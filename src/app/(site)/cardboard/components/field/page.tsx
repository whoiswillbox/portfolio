import {
  FieldGroup,
  Field,
  FieldLabel,
  FieldDescription,
  FieldError,
  FieldSeparator,
} from "@/components/cardboard/field";
import { Input } from "@/components/cardboard/input";
import { ComponentPage, Demo } from "../_component-page";

export default function FieldDocs() {
  return (
    <ComponentPage
      title="Field"
      description="The form-row primitive — label, control, description, and error stacked with consistent spacing. Invalid state and error text use the critical token."
    >
      <Demo title="Default">
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="name">Name</FieldLabel>
            <Input id="name" placeholder="Will Box" />
            <FieldDescription>As it appears on your ID.</FieldDescription>
          </Field>
          <Field>
            <FieldLabel htmlFor="email">Email</FieldLabel>
            <Input id="email" type="email" placeholder="you@example.com" />
          </Field>
        </FieldGroup>
      </Demo>

      <Demo title="With separator + error">
        <FieldGroup className="max-w-sm">
          <Field>
            <FieldLabel htmlFor="user">Username</FieldLabel>
            <Input id="user" defaultValue="taken" aria-invalid />
            <FieldError>That username is already taken.</FieldError>
          </Field>
          <FieldSeparator>or</FieldSeparator>
          <Field>
            <FieldLabel htmlFor="alias">Display name</FieldLabel>
            <Input id="alias" placeholder="Optional" />
          </Field>
        </FieldGroup>
      </Demo>

      <Demo title="Horizontal">
        <FieldGroup className="max-w-sm">
          <Field orientation="horizontal">
            <FieldLabel htmlFor="port">Port</FieldLabel>
            <Input id="port" defaultValue="3000" className="w-24" />
          </Field>
        </FieldGroup>
      </Demo>
    </ComponentPage>
  );
}
