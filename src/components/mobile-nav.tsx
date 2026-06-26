"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  CubeIcon, FolderIcon, BuildingOffice2Icon, DocumentTextIcon,
  AcademicCapIcon, LifebuoyIcon, PuzzlePieceIcon, MusicalNoteIcon,
  BoltIcon, XMarkIcon, ChevronRightIcon,
  ChatBubbleLeftRightIcon, Squares2X2Icon,
} from "@heroicons/react/24/outline"
import {
  CubeIcon as CubeSolid,
  FolderIcon as FolderSolid,
  BuildingOffice2Icon as BuildingOffice2Solid,
  DocumentTextIcon as DocumentTextSolid,
  AcademicCapIcon as AcademicCapSolid,
  LifebuoyIcon as LifebuoySolid,
  PuzzlePieceIcon as PuzzlePieceSolid,
  MusicalNoteIcon as MusicalNoteSolid,
  BoltIcon as BoltSolid,
  ChatBubbleLeftRightIcon as ChatBubbleLeftRightSolid,
  Squares2X2Icon as Squares2X2Solid,
} from "@heroicons/react/24/solid"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import {
  loadConversations,
  saveConversations,
  subscribeConversations,
  type Conversation,
} from "@/lib/chat/store"
import { caseStudyForConversation } from "@/lib/case-studies"

type Tray = "experience" | "school" | "extras" | "conversations" | null

export function MobileNav() {
  const pathname = usePathname()
  const router = useRouter()
  const searchParams = useSearchParams()

  const convoParam = searchParams.get("c")
  const boxParam = searchParams.get("box")
  const [openTray, setOpenTray] = React.useState<Tray>(null)
  const [activeNav, setActiveNav] = React.useState<string | null>(null)
  const [conversations, setConversations] = React.useState<Conversation[]>([])

  // Hide on scroll down, show on scroll up (and always show near the top). The
  // page scrolls inside the ContentCard's [data-scroll-container], not window.
  const [hidden, setHidden] = React.useState(false)
  React.useEffect(() => {
    setHidden(false) // reveal on every route change
    const el = document.querySelector<HTMLElement>("[data-scroll-container]")
    if (!el) return
    let lastY = el.scrollTop
    const onScroll = () => {
      const y = el.scrollTop
      const delta = y - lastY
      if (y < 64) {
        setHidden(false) // always visible near the top
      } else if (delta > 6) {
        setHidden(true) // scrolling down
      } else if (delta < -6) {
        setHidden(false) // scrolling up
      }
      lastY = y
    }
    el.addEventListener("scroll", onScroll, { passive: true })
    return () => el.removeEventListener("scroll", onScroll)
  }, [pathname])

  // Reset optimistic active state when pathname settles
  React.useEffect(() => { setActiveNav(null) }, [pathname])
  React.useEffect(() => {
    const sync = () => setConversations(loadConversations())
    sync()
    return subscribeConversations(sync)
  }, [])

  // Prefetch all nav destinations on mount so taps feel instant
  React.useEffect(() => {
    const hrefs = [
      "/who",
      "/technergetics",
      "/school",
      "/projects/next-gen-bar",
      "/technergetics/jetdash",
      "/technergetics/upgrade",
      "/technergetics/reusable-table",
      "/technergetics/design-standards",
      "/technergetics/lightcert",
      "/resume",
      "/school/swiperight-ai",
      "/extracurriculars",
      "/extracurriculars/surfing",
      "/extracurriculars/gaming",
      "/extracurriculars/music",
    ]
    hrefs.forEach((href) => router.prefetch(href))
  }, [router])

  const toggleTray = (tray: Tray) => {
    setActiveNav(null)
    setOpenTray((prev) => (prev === tray ? null : tray))
  }

  const closeTray = () => setOpenTray(null)

  const navigate = (href: string, navId?: string) => {
    closeTray()
    if (navId) setActiveNav(navId)
    router.push(href)
  }

  const removeConversation = (id: string) => {
    const next = conversations.filter((c) => c.id !== id)
    saveConversations(next)
    setConversations(next)
  }

  if (pathname === "/") return null

  const experienceActive = activeNav === "experience" || (!activeNav && openTray === null && (pathname === "/technergetics" || pathname.startsWith("/technergetics/") || pathname === "/projects/next-gen-bar" || pathname === "/resume"))
  const schoolActive = activeNav === "school" || (!activeNav && openTray === null && (pathname === "/school" || pathname.startsWith("/school/")))
  const extrasActive = activeNav === "extras" || (!activeNav && openTray === null && (pathname === "/extracurriculars" || pathname.startsWith("/extracurriculars/")))
  const boxActive = activeNav === "box" || (!activeNav && pathname === "/who" && convoParam === null && openTray === null)
  const convsActive = activeNav === "conversations" || (!activeNav && pathname === "/conversations" && openTray === null)

  const navItems = [
    {
      id: "box" as const,
      label: "Box",
      iconOutline: CubeIcon,
      iconSolid: CubeSolid,
      active: boxActive,
      onPress: () => { closeTray(); setActiveNav("box"); router.push("/who") },
    },
    {
      id: "experience" as const,
      label: "Experience",
      iconOutline: FolderIcon,
      iconSolid: FolderSolid,
      active: experienceActive,
      onPress: () => { closeTray(); setActiveNav("experience"); router.push("/technergetics") },
    },
    {
      id: "school" as const,
      label: "School",
      iconOutline: AcademicCapIcon,
      iconSolid: AcademicCapSolid,
      active: schoolActive,
      onPress: () => { closeTray(); setActiveNav("school"); router.push("/school") },
    },
    {
      id: "extras" as const,
      label: "Extras",
      iconOutline: Squares2X2Icon,
      iconSolid: Squares2X2Solid,
      active: extrasActive,
      onPress: () => { closeTray(); setActiveNav("extras"); router.push("/extracurriculars") },
    },
    {
      id: "conversations" as const,
      label: "Convos",
      iconOutline: ChatBubbleLeftRightIcon,
      iconSolid: ChatBubbleLeftRightSolid,
      active: convsActive,
      onPress: () => { closeTray(); setActiveNav("conversations"); router.push("/conversations") },
    },
  ]

  return (
    <>
      {/* Backdrop — stops above the nav bar so nav buttons remain tappable */}
      {openTray && (
        <div
          className="fixed inset-0 bottom-[4.5rem] z-[39]"
          onClick={closeTray}
        />
      )}

      {/* Tray */}
      {openTray && (
        <div className="fixed bottom-[4.5rem] left-6 right-6 z-[41] pb-1 animate-in slide-in-from-bottom-2 fade-in duration-150">
          <div className="rounded-2xl bg-background ring-1 ring-border/50 shadow-lg overflow-hidden">
            {openTray === "experience" && (
              <TraySection>
                <TrayItem
                  label="BARBRI"
                  href="/projects/next-gen-bar"
                  active={pathname === "/projects/next-gen-bar"}
                  onPress={() => navigate("/projects/next-gen-bar")}
                  badge="PACKAGING"
                  icon={pathname === "/projects/next-gen-bar" ? FolderSolid : FolderIcon}
                />
                <TrayItem label="Jetdash" href="/technergetics/jetdash" active={pathname === "/technergetics/jetdash"} onPress={() => navigate("/technergetics/jetdash")} icon={pathname === "/technergetics/jetdash" ? BuildingOffice2Solid : BuildingOffice2Icon} />
                <TrayItem label="Upgrade" href="/technergetics/upgrade" active={pathname === "/technergetics/upgrade"} onPress={() => navigate("/technergetics/upgrade")} icon={pathname === "/technergetics/upgrade" ? BuildingOffice2Solid : BuildingOffice2Icon} />
                <TrayItem label="Reusable Table" href="/technergetics/reusable-table" active={pathname === "/technergetics/reusable-table"} onPress={() => navigate("/technergetics/reusable-table")} icon={pathname === "/technergetics/reusable-table" ? BuildingOffice2Solid : BuildingOffice2Icon} />
                <TrayItem label="Design Standards" href="/technergetics/design-standards" active={pathname === "/technergetics/design-standards"} onPress={() => navigate("/technergetics/design-standards")} icon={pathname === "/technergetics/design-standards" ? BuildingOffice2Solid : BuildingOffice2Icon} />
                <TrayItem label="Lightcert" href="/technergetics/lightcert" active={pathname === "/technergetics/lightcert"} onPress={() => navigate("/technergetics/lightcert")} icon={pathname === "/technergetics/lightcert" ? BoltSolid : BoltIcon} />
                <TrayItem label="Resume" href="/resume" active={pathname === "/resume"} onPress={() => navigate("/resume")} icon={pathname === "/resume" ? DocumentTextSolid : DocumentTextIcon} />
              </TraySection>
            )}
            {openTray === "school" && (
              <TraySection>
                <TrayItem label="SwipeRight.ai" href="/school/swiperight-ai" active={pathname === "/school/swiperight-ai"} onPress={() => navigate("/school/swiperight-ai")} icon={pathname === "/school/swiperight-ai" ? AcademicCapSolid : AcademicCapIcon} />
              </TraySection>
            )}
            {openTray === "extras" && (
              <TraySection>
                <TrayItem label="Surfing" href="/extracurriculars/surfing" active={pathname === "/extracurriculars/surfing"} onPress={() => navigate("/extracurriculars/surfing")} icon={pathname === "/extracurriculars/surfing" ? LifebuoySolid : LifebuoyIcon} />
                <TrayItem label="Gaming" href="/extracurriculars/gaming" active={pathname === "/extracurriculars/gaming"} onPress={() => navigate("/extracurriculars/gaming")} icon={pathname === "/extracurriculars/gaming" ? PuzzlePieceSolid : PuzzlePieceIcon} />
                <TrayItem label="Music" href="/extracurriculars/music" active={pathname === "/extracurriculars/music"} onPress={() => navigate("/extracurriculars/music")} icon={pathname === "/extracurriculars/music" ? MusicalNoteSolid : MusicalNoteIcon} />
              </TraySection>
            )}
            {openTray === "conversations" && (
              <TraySection>
                {conversations.length === 0 ? (
                  <div className="px-4 py-3 text-sm text-muted-foreground">No conversations yet</div>
                ) : (
                  conversations.slice(0, 8).map((c) => {
                    const study = caseStudyForConversation(c)
                    const href = study ? `${study.href}?box=${c.id}` : `/who?c=${c.id}`
                    const active = study
                      ? pathname === study.href && boxParam === c.id
                      : pathname === "/who" && convoParam === c.id
                    return (
                      <div key={c.id} className="flex items-center">
                        <button
                          onClick={() => navigate(href)}
                          className={cn(
                            "flex flex-1 items-center gap-3 px-4 py-3 text-sm text-left transition-colors",
                            active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <CubeIcon className="size-4 shrink-0" />
                          <span className="truncate">{c.title}</span>
                        </button>
                        <button
                          onClick={() => removeConversation(c.id)}
                          className="px-3 py-3 text-muted-foreground hover:text-foreground"
                          aria-label="Delete"
                        >
                          <XMarkIcon className="size-4" />
                        </button>
                      </div>
                    )
                  })
                )}
              </TraySection>
            )}
          </div>
        </div>
      )}

      {/* Bottom bar — hides on scroll down, shows on scroll up */}
      <nav className={cn(
        "mobile-nav fixed bottom-0 left-0 right-0 z-[42] flex items-end justify-center px-6 pt-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] transition-transform duration-300 ease-[cubic-bezier(0.32,0.72,0,1)]",
        hidden && "translate-y-[calc(100%+1rem)]",
      )}>
        <div className="flex w-full items-center gap-1 rounded-2xl bg-background/80 supports-backdrop-filter:backdrop-blur-md ring-1 ring-border/50 shadow-lg p-1.5">
        {navItems.map((item) => {
          const isOpen = openTray === item.id
          const highlighted = item.active || isOpen
          const Icon = highlighted ? item.iconSolid : item.iconOutline
          return (
            <button
              key={item.id}
              onClick={item.onPress}
              className={cn(
                "flex flex-1 flex-col items-center justify-center gap-1 outline-none transition-colors duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                highlighted ? "text-foreground" : "text-muted-foreground"
              )}
            >
              <div className={cn(
                "relative flex w-full flex-col items-center gap-1 rounded-lg py-1.5 transition-[background-color,box-shadow] duration-300 ease-[cubic-bezier(0.25,0.46,0.45,0.94)]",
                highlighted
                  ? "bg-muted/40 supports-backdrop-filter:backdrop-blur-md ring-1 ring-border/50 shadow-sm"
                  : "bg-transparent shadow-none"
              )}>
                <Icon className="size-5" />
                <span className="font-mono text-[10px] uppercase tracking-wide">{item.label}</span>
              </div>
            </button>
          )
        })}
        </div>
      </nav>
    </>
  )
}

function TraySection({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col divide-y divide-border">{children}</div>
}

function TrayItem({
  label,
  active,
  onPress,
  icon: Icon,
  badge,
}: {
  label: string
  href: string
  active: boolean
  onPress: () => void
  icon: React.ElementType
  badge?: string
}) {
  return (
    <button
      onClick={onPress}
      className={cn(
        "flex w-full items-center gap-3 px-4 py-3 text-sm transition-colors",
        active ? "text-foreground font-medium" : "text-muted-foreground hover:text-foreground"
      )}
    >
      <Icon className="size-4 shrink-0" />
      <span>{label}</span>
      {badge && <Badge variant="warning" className="ml-1">{badge}</Badge>}
    </button>
  )
}
