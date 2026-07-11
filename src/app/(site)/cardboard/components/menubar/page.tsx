import {
  Menubar,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarCheckboxItem,
  MenubarSub,
  MenubarSubTrigger,
  MenubarSubContent,
} from "@/components/cardboard/menubar";
import { ComponentPage, Demo } from "../_component-page";

export default function MenubarDocs() {
  return (
    <ComponentPage
      title="Menubar"
      description="A desktop-style menu bar — top-level triggers open dropdown menus with items, shortcuts, checkboxes, and submenus. Items use the secondary surface on focus."
    >
      <Demo title="Default" caption="Open a menu, then hover across the bar.">
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarItem>
                New Tab <MenubarShortcut>⌘T</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>New Window</MenubarItem>
              <MenubarSeparator />
              <MenubarSub>
                <MenubarSubTrigger>Share</MenubarSubTrigger>
                <MenubarSubContent>
                  <MenubarItem>Email link</MenubarItem>
                  <MenubarItem>Messages</MenubarItem>
                </MenubarSubContent>
              </MenubarSub>
              <MenubarSeparator />
              <MenubarItem variant="destructive">
                Delete <MenubarShortcut>⌘⌫</MenubarShortcut>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
          <MenubarMenu>
            <MenubarTrigger>View</MenubarTrigger>
            <MenubarContent>
              <MenubarCheckboxItem checked>Show Toolbar</MenubarCheckboxItem>
              <MenubarCheckboxItem>Show Sidebar</MenubarCheckboxItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </Demo>
    </ComponentPage>
  );
}
