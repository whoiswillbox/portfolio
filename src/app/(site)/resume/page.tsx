import { ContentCard } from "@/components/content-card";
import { EXPERIENCE, EDUCATION, CERTIFICATIONS, SKILLS } from "@/lib/resume-data";

export default function Resume() {
  return (
    <ContentCard className="h-full overflow-auto">
      <div className="mx-auto w-full max-w-4xl px-6 pb-10 pt-16 max-sm:pt-28 max-sm:[@media(display-mode:standalone)]:pt-36">
        {/* Header */}
        <div className="mb-10 grid items-center gap-4 md:grid-cols-[1fr_200px]">
          <div>
            <h1 className="text-h1 tracking-tight">William Box</h1>
            <p className="font-heading text-body-lg text-muted-foreground">Product Designer</p>
          </div>
          <div className="font-mono text-body-xs text-muted-foreground">
            <p>www.whoiswillbox.com</p>
            <p>csswillbox@gmail.com</p>
          </div>
        </div>

        <div className="grid gap-10 md:grid-cols-[1fr_200px]">
          {/* Left: Experience + Education + Certifications */}
          <div className="flex flex-col gap-10">
            {/* Experience */}
            <section className="flex flex-col gap-6">
              <h2 className="text-h3 tracking-tight">Experience</h2>
              {EXPERIENCE.map((job) => (
                <div key={`${job.company}-${job.role}`} className="flex flex-col gap-2">
                  <div>
                    <p className="text-h6">
                      <span>{job.company}</span>
                      <span className="font-normal text-muted-foreground">, {job.role}</span>
                    </p>
                    <p className="font-mono text-body-xs text-muted-foreground">
                      {job.period} | {job.location}
                    </p>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {job.bullets.map((b, i) => (
                      <li key={i} className="font-heading text-body-sm leading-relaxed text-muted-foreground">
                        {b}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            {/* Education */}
            <section className="flex flex-col gap-4">
              <h2 className="text-h3 tracking-tight">Education</h2>
              {EDUCATION.map((e) => (
                <div key={e.institution} className="flex flex-col gap-0.5">
                  <p className="text-h6">{e.institution}</p>
                  <p className="font-mono text-body-xs text-muted-foreground">
                    {e.period} | {e.location}
                  </p>
                  {e.details.map((d) => (
                    <p key={d} className="text-body-sm text-muted-foreground">{d}</p>
                  ))}
                </div>
              ))}
            </section>

            {/* Certifications */}
            <section className="flex flex-col gap-4">
              <h2 className="text-h3 tracking-tight">Certifications</h2>
              {CERTIFICATIONS.map((c) => (
                <div key={c.institution} className="flex flex-col gap-0.5">
                  <p className="text-h6">{c.institution}</p>
                  <p className="font-mono text-body-xs text-muted-foreground">
                    {c.period} | {c.location}
                  </p>
                  {c.details.map((d) => (
                    <p key={d} className="text-body-sm text-muted-foreground">{d}</p>
                  ))}
                </div>
              ))}
            </section>
          </div>

          {/* Right: Skills */}
          <div className="flex flex-col gap-6">
            <h2 className="text-h3 tracking-tight">Skills</h2>
            {SKILLS.map((s) => (
              <div key={s.category} className="flex flex-col gap-1">
                <p className="font-mono text-body-xs font-medium uppercase tracking-wide text-foreground">
                  {s.category}
                </p>
                <ul className="flex flex-col gap-0.5">
                  {s.items.map((item) => (
                    <li key={item} className="text-body-sm text-muted-foreground">{item}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </ContentCard>
  );
}
