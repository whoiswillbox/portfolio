"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  SwatchIcon,
  Squares2X2Icon,
  ChevronRightIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/outline"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarSeparator,
  SidebarTrigger,
} from "@/components/ui/sidebar"

const foundations = [
  { title: "Overview", href: "/cardboard/foundations" },
  { title: "Colors", href: "/cardboard/foundations/colors" },
  { title: "Typography", href: "/cardboard/foundations/typography" },
  { title: "Spacing", href: "/cardboard/foundations/spacing" },
  { title: "Radius", href: "/cardboard/foundations/radius" },
  { title: "Elevation", href: "/cardboard/foundations/elevation" },
  { title: "Iconography", href: "/cardboard/foundations/iconography" },
]

export function CardboardSidebar() {
  const pathname = usePathname()
  const inFoundations = pathname.startsWith("/cardboard/foundations")
  const inComponents = pathname.startsWith("/cardboard/components")

  return (
    <Sidebar
      variant="floating"
      className="max-sm:hidden sm:top-14 sm:!h-[calc(100svh-3.5rem)] [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-inner]]:!shadow-none [&_[data-slot=sidebar-inner]]:!ring-0 [&_[data-slot=sidebar-menu-button]_span]:font-sans [&_[data-slot=sidebar-menu-button]_span]:normal-case [&_[data-slot=sidebar-menu-button]_span]:tracking-normal [&_[data-slot=sidebar-menu-sub-button]_span]:font-sans [&_[data-slot=sidebar-menu-sub-button]_span]:normal-case [&_[data-slot=sidebar-menu-sub-button]_span]:tracking-normal"
    >
      <SidebarHeader>
        <div className="flex items-center justify-end">
          <SidebarTrigger className="max-sm:hidden" />
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {/* Foundations — expanded sub-tree */}
              <Collapsible
                asChild
                defaultOpen={inFoundations}
                className="group/foundations"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip="Foundations">
                      <SwatchIcon />
                      <span>Foundations</span>
                      <ChevronRightIcon className="ml-auto transition-transform duration-200 group-data-[state=open]/foundations:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {foundations.map((f) => (
                        <SidebarMenuSubItem key={f.href}>
                          <SidebarMenuSubButton
                            asChild
                            isActive={pathname === f.href}
                          >
                            <Link href={f.href}>
                              <span>{f.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Components — a single link to the live gallery (the gallery is
                  the browser; a flat 65-item tree would be unusable). */}
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={inComponents}>
                  <Link href="/cardboard/components">
                    <Squares2X2Icon />
                    <span>Components</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <SidebarSeparator className="mx-0 mb-2 bg-border/50" />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild isActive={pathname === "/settings"}>
              <Link href="/settings">
                <Cog6ToothIcon />
                <span>Settings</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
