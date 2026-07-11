import { UserCircleIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import {
  Item,
  ItemMedia,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ItemActions,
  ItemGroup,
  ItemSeparator,
} from "@/components/cardboard/item";
import { Button } from "@/components/cardboard/button";
import { ComponentPage, Demo } from "../_component-page";

export default function ItemDocs() {
  return (
    <ComponentPage
      title="Item"
      description="A flexible list row — media, title, description, and actions in one aligned line. Three variants (default, outline, muted) and three sizes."
    >
      <Demo title="Outline">
        <Item variant="outline" className="max-w-md">
          <ItemMedia variant="icon">
            <UserCircleIcon />
          </ItemMedia>
          <ItemContent>
            <ItemTitle>Will Box</ItemTitle>
            <ItemDescription>Designer & engineer</ItemDescription>
          </ItemContent>
          <ItemActions>
            <Button size="sm" variant="ghost">
              <ChevronRightIcon className="size-4" />
            </Button>
          </ItemActions>
        </Item>
      </Demo>

      <Demo title="Group with separators">
        <ItemGroup className="max-w-md">
          <Item>
            <ItemContent>
              <ItemTitle>Notifications</ItemTitle>
              <ItemDescription>Manage how you’re alerted.</ItemDescription>
            </ItemContent>
          </Item>
          <ItemSeparator />
          <Item>
            <ItemContent>
              <ItemTitle>Privacy</ItemTitle>
              <ItemDescription>Control your data.</ItemDescription>
            </ItemContent>
          </Item>
        </ItemGroup>
      </Demo>

      <Demo title="Muted, small">
        <Item variant="muted" size="sm" className="max-w-md">
          <ItemContent>
            <ItemTitle>Compact row</ItemTitle>
          </ItemContent>
        </Item>
      </Demo>
    </ComponentPage>
  );
}
