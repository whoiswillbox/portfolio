import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { EMAIL, LINKEDIN_URL, LINKEDIN_HANDLE, GITHUB_URL, GITHUB_HANDLE } from "@/lib/contact";

/** LinkedIn brand mark (lucide dropped brand icons). */
function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M20.45 20.45h-3.56v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.07 2.07 0 1 1 0-4.13 2.07 2.07 0 0 1 0 4.13zM7.12 20.45H3.55V9h3.57v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.22.79 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" />
    </svg>
  );
}

/** GitHub brand mark (lucide dropped brand icons). */
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M12 .5C5.73.5.5 5.73.5 12c0 5.09 3.29 9.4 7.86 10.93.58.1.79-.25.79-.56 0-.27-.01-1.16-.02-2.11-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.08-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.59.24 2.76.12 3.05.74.8 1.19 1.82 1.19 3.08 0 4.41-2.69 5.38-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .31.21.67.8.56A10.52 10.52 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5Z" />
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
    key: "github",
    href: GITHUB_URL,
    icon: <GitHubIcon className="size-5 text-foreground" />,
    label: "GitHub",
    sub: GITHUB_HANDLE,
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
