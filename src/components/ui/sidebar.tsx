/* Forked into Cardboard. Re-export shim — the owned component lives at
   `@/components/cardboard/sidebar`. See docs/component-customizations.md.
   (Preserves the SidebarTrigger tooltip + state-aware label, and keeps
   lucide's PanelLeftIcon since Heroicons has no panel glyph.) */
export {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/cardboard/sidebar"
