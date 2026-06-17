import { EnvelopeIcon, GlobeAltIcon } from "@heroicons/react/24/outline";
import { EMAIL, LINKEDIN_URL, LINKEDIN_HANDLE, SITE_URL, SITE_DOMAIN } from "@/lib/contact";

/** LinkedIn brand mark (lucide dropped brand icons). */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

const ROWS = [
  {
    key: "linkedin",
    href: LINKEDIN_URL,
    icon: <LinkedInIcon className="size-5 text-[#0a66c2]" />,
    label: "LinkedIn",
    sub: `in/${LINKEDIN_HANDLE}`,
    external: true,
  },
  {
    key: "email",
    href: `mailto:${EMAIL}`,
    icon: <EnvelopeIcon className="size-5 text-muted-foreground" />,
    label: "Email",
    sub: EMAIL,
    external: false,
  },
  {
    key: "site",
    href: SITE_URL,
    icon: <GlobeAltIcon className="size-5 text-muted-foreground" />,
    label: "Website",
    sub: SITE_DOMAIN,
    external: true,
  },
];

/** A compact, branded "reach me" card shown under contact-related chat answers. */
export function ContactCard() {
  return (
    <div className="flex flex-col gap-1 rounded-xl border bg-card p-1.5 shadow-sm">
      {ROWS.map((row) => (
        <a
          key={row.key}
          href={row.href}
          target={row.external ? "_blank" : undefined}
          rel={row.external ? "noreferrer" : undefined}
          className="flex items-center gap-3 rounded-lg px-2.5 py-2 transition-colors hover:bg-muted"
        >
          <span className="flex size-9 shrink-0 items-center justify-center rounded-md border bg-background">
            {row.icon}
          </span>
          <span className="flex min-w-0 flex-col">
            <span className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
              {row.label}
            </span>
            <span className="truncate text-body-xs text-muted-foreground">{row.sub}</span>
          </span>
        </a>
      ))}
    </div>
  );
}
