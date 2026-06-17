import { ContentCard } from "@/components/content-card";

export default function Surfing() {
  return (
    <ContentCard className="h-full overflow-auto">
      <article className="mx-auto w-full max-w-4xl px-6 pb-10 pt-28">
        <header className="flex flex-col gap-3">
          <h1 className="text-h1 font-bold tracking-tight">Surfing</h1>
        </header>
      </article>
    </ContentCard>
  );
}
