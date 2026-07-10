import { ContactCard } from "@/components/contact-card";
import { ComponentPage, Demo } from "../_component-page";

export default function ContactCardDocs() {
  return (
    <ComponentPage
      title="Contact Card"
      description="A compact card with contact links (email, LinkedIn, etc.). Used on the landing and about surfaces."
    >
      <Demo title="Default">
        <ContactCard />
      </Demo>
    </ComponentPage>
  );
}
