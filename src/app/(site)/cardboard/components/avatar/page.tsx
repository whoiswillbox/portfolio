import {
  Avatar,
  AvatarFallback,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/cardboard/avatar";
import { ComponentPage, Demo } from "../_component-page";

export default function AvatarDocs() {
  return (
    <ComponentPage
      title="Avatar"
      description="Represents a user with an image or initials fallback. Sizes and stacks into groups."
    >
      <Demo title="Sizes" caption="sm, default, lg — with an initials fallback.">
        <Avatar size="sm">
          <AvatarFallback>WB</AvatarFallback>
        </Avatar>
        <Avatar size="default">
          <AvatarFallback>WB</AvatarFallback>
        </Avatar>
        <Avatar size="lg">
          <AvatarFallback>WB</AvatarFallback>
        </Avatar>
      </Demo>

      <Demo title="Group" caption="Overlap avatars and cap with a count.">
        <AvatarGroup>
          <Avatar>
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>CD</AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>EF</AvatarFallback>
          </Avatar>
          <AvatarGroupCount>+3</AvatarGroupCount>
        </AvatarGroup>
      </Demo>
    </ComponentPage>
  );
}
