import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuItem,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
} from "@/components/cardboard/navigation-menu";
import { ComponentPage, Demo } from "../_component-page";

export default function NavigationMenuDocs() {
  return (
    <ComponentPage
      title="Navigation Menu"
      description="A site-navigation bar with rich flyout panels. Triggers and links use the secondary surface on hover/focus; the focus ring uses the focus-ring token."
    >
      <Demo title="Default" caption="Hover a trigger to reveal its panel.">
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuItem>
              <NavigationMenuTrigger>Getting started</NavigationMenuTrigger>
              <NavigationMenuContent>
                <div className="grid w-[18rem] gap-1 p-2">
                  <NavigationMenuLink href="#">
                    <div>
                      <div className="font-medium">Introduction</div>
                      <div className="text-body-xs text-muted-foreground">
                        What Cardboard is and why.
                      </div>
                    </div>
                  </NavigationMenuLink>
                  <NavigationMenuLink href="#">
                    <div>
                      <div className="font-medium">Installation</div>
                      <div className="text-body-xs text-muted-foreground">
                        Add it to your app.
                      </div>
                    </div>
                  </NavigationMenuLink>
                </div>
              </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <NavigationMenuLink href="#" className="font-medium">
                Docs
              </NavigationMenuLink>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </Demo>
    </ComponentPage>
  );
}
