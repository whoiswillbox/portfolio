import Link from "next/link";
import { ArrowLeftIcon } from "@heroicons/react/24/outline";
import { ContentCard } from "@/components/content-card";

/* Shared scaffold for the per-component reference pages — keeps the back link,
   header, and spacing identical across every component doc. */
export function ComponentPage({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36 pb-10">
        <Link
          href="/cardboard/components"
          className="mb-6 inline-flex items-center gap-1.5 text-body-sm text-muted-foreground transition-colors hover:text-foreground max-sm:hidden"
        >
          <ArrowLeftIcon className="size-4" />
          Components
        </Link>
        <div className="flex flex-col gap-3 mb-12">
          <h1 className="text-h1 font-semibold">{title}</h1>
          <p className="text-body-lg text-muted-foreground">{description}</p>
        </div>
        {children}
      </div>
    </ContentCard>
  );
}

// A titled demo block: a heading + optional caption, then a rendered preview
// surface holding the live component(s).
export function Demo({
  title,
  caption,
  children,
}: {
  title: string;
  caption?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-12 flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-h3 font-semibold">{title}</h2>
        {caption && <p className="text-body-sm text-muted-foreground">{caption}</p>}
      </div>
      <div className="flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-6">
        {children}
      </div>
    </section>
  );
}

// A specs table: the anatomy of a component — part → the token(s) that style it.
// For custom pattern components, this makes the doc a build-from template, not
// just a picture (icon size, title size, body size, spacing, colors…).
export function Specs({ rows }: { rows: { part: string; spec: string }[] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[24rem] text-left text-body-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50 font-mono text-body-xs text-muted-foreground">
            <th className="px-4 py-2 font-normal">Part</th>
            <th className="px-4 py-2 font-normal">Spec</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((r) => (
            <tr key={r.part}>
              <td className="px-4 py-2 text-foreground">{r.part}</td>
              <td className="px-4 py-2 font-mono text-body-xs text-muted-foreground">{r.spec}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
