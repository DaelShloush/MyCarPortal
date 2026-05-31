import { SiteShell } from "@/components/layout/site-shell";

interface LegalPageProps {
  title: string;
  lastUpdated: string;
  children: React.ReactNode;
}

export function LegalPage({ title, lastUpdated, children }: LegalPageProps) {
  return (
    <SiteShell>
      <article className="mx-auto max-w-[760px] px-4 md:px-6 py-8 md:py-12">
        <h1 className="text-3xl font-black text-[var(--color-gray-900)] mb-1">
          {title}
        </h1>
        <p className="text-sm text-[var(--color-text-subtle)] mb-8">
          עודכן לאחרונה: {lastUpdated}
        </p>
        <div className="space-y-6 text-[var(--color-text)] leading-relaxed [&_h2]:text-lg [&_h2]:font-bold [&_h2]:text-[var(--color-gray-900)] [&_h2]:mt-6 [&_h2]:mb-2 [&_p]:text-sm [&_p]:text-[var(--color-text-muted)] [&_ul]:list-disc [&_ul]:ps-6 [&_ul]:text-sm [&_ul]:text-[var(--color-text-muted)] [&_li]:mb-1">
          {children}
        </div>
      </article>
    </SiteShell>
  );
}
