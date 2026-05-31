import { SiteShell } from "@/components/layout/site-shell";

function SkeletonBox({ className = "" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-[var(--color-gray-200)] ${className}`}
    />
  );
}

function SkeletonSection() {
  return (
    <div className="rounded-xl border border-[var(--color-border)] p-5 space-y-3">
      <SkeletonBox className="h-5 w-40" />
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex justify-between">
            <SkeletonBox className="h-4 w-24" />
            <SkeletonBox className="h-4 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SearchLoading() {
  return (
    <SiteShell>
      <div className="mx-auto max-w-[920px] px-4 md:px-6 py-4 md:py-8 space-y-6">
        {/* תמונת רכב */}
        <SkeletonBox className="h-48 md:h-64 w-full" />

        {/* כותרת + תג סיכון */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 space-y-2">
            <SkeletonBox className="h-8 w-2/3" />
            <SkeletonBox className="h-4 w-1/2" />
          </div>
          <SkeletonBox className="h-20 w-20 rounded-full" />
        </div>

        {/* כפתורי פעולה */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <SkeletonBox key={i} className="h-9" />
          ))}
        </div>

        {/* סקשנים */}
        <SkeletonSection />
        <SkeletonSection />
        <SkeletonSection />

        <p className="text-center text-sm text-[var(--color-text-subtle)] pt-2">
          טוען נתונים ממאגרי משרד התחבורה…
        </p>
      </div>
    </SiteShell>
  );
}
