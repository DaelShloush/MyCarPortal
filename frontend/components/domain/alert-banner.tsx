import Link from "next/link";
import { AlertTriangle, AlertCircle, Info, ChevronLeft } from "lucide-react";
import { cn } from "@/lib/utils";

type Tone = "warn" | "high" | "info" | "good";

interface AlertBannerProps {
  tone: Tone;
  title: string;
  description?: string;
  href?: string;
  className?: string;
}

const styles: Record<Tone, { container: string; icon: React.ElementType; iconColor: string }> = {
  good: {
    container: "bg-[var(--color-risk-good-bg)] border-[var(--color-risk-good-border)] text-[var(--color-risk-good-text)]",
    icon: Info,
    iconColor: "text-[var(--color-success)]",
  },
  warn: {
    container: "bg-[var(--color-risk-warn-bg)] border-[var(--color-risk-warn-border)] text-[var(--color-risk-warn-text)]",
    icon: AlertTriangle,
    iconColor: "text-[var(--color-warning)]",
  },
  high: {
    container: "bg-[var(--color-risk-high-bg)] border-[var(--color-risk-high-border)] text-[var(--color-risk-high-text)]",
    icon: AlertCircle,
    iconColor: "text-[var(--color-danger)]",
  },
  info: {
    container: "bg-[var(--color-primary-50)] border-[var(--color-primary-100)] text-[var(--color-primary-700)]",
    icon: Info,
    iconColor: "text-[var(--color-primary-500)]",
  },
};

export function AlertBanner({ tone, title, description, href, className }: AlertBannerProps) {
  const s = styles[tone];
  const Icon = s.icon;

  const content = (
    <>
      <Icon size={22} className={cn("shrink-0 mt-0.5", s.iconColor)} />
      <div className="flex-1 min-w-0">
        <p className="font-bold text-sm">{title}</p>
        {description && <p className="text-xs opacity-80 mt-0.5">{description}</p>}
      </div>
      {href && <ChevronLeft size={20} className="opacity-60 shrink-0" />}
    </>
  );

  const containerClass = cn(
    "flex items-start gap-3 rounded-lg border px-4 py-3",
    s.container,
    href && "hover:opacity-90 cursor-pointer transition-opacity",
    className
  );

  if (href) {
    return (
      <Link href={href} className={containerClass}>
        {content}
      </Link>
    );
  }
  return <div className={containerClass}>{content}</div>;
}
