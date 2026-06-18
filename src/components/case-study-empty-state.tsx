export function CaseStudyEmptyState() {
  return (
    <div className="flex flex-col items-center gap-5 px-8 py-14 text-center">
      {/* viewBox expanded upward (-8 top) to give arrow room */}
      <svg
        viewBox="0 -8 24 32"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="size-24 text-foreground"
        aria-hidden="true"
      >
        {/* Box body — left face */}
        <path d="M3 9 L3 17.5 L12 22.5 L12 14 Z"
          fill="currentColor" fillOpacity="0.1"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        {/* Box body — right face */}
        <path d="M21 9 L21 17.5 L12 22.5 L12 14 Z"
          fill="currentColor" fillOpacity="0.05"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        {/* Left flap */}
        <path d="M3 9 L12 14 L9 8 L1 4 Z"
          fill="currentColor" fillOpacity="0.08"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        {/* Right flap */}
        <path d="M21 9 L12 14 L15 8 L23 4 Z"
          fill="currentColor" fillOpacity="0.05"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        {/* Back-left flap */}
        <path d="M3 9 L12 4 L10 0.5 L2 4.5 Z"
          fill="currentColor" fillOpacity="0.07"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        {/* Back-right flap */}
        <path d="M21 9 L12 4 L14 0.5 L22 4.5 Z"
          fill="currentColor" fillOpacity="0.04"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />
        {/* Box opening rim */}
        <path d="M3 9 L12 4 L21 9 L12 14 Z"
          fill="none"
          stroke="currentColor" strokeWidth={1} strokeLinejoin="round" strokeLinecap="round" />

      </svg>

      <div className="flex flex-col gap-3">
        <p className="font-heading text-h3 font-semibold text-foreground">Being packed up</p>
        <p className="max-w-xs text-body-sm text-muted-foreground">
          This case study is being carefully put together — check back soon.
        </p>
      </div>
    </div>
  );
}
