"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Star, Search, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/dashboard", label: "בית", icon: Home },
  { href: "/favorites", label: "מועדפים", icon: Star },
  { href: "/", label: "חיפוש", icon: Search, primary: true },
  { href: "/history", label: "היסטוריה", icon: Clock },
  { href: "/settings", label: "הגדרות", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="ניווט תחתון"
      className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[var(--color-border)] h-14 grid grid-cols-5"
    >
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = pathname === tab.href;
        return (
          <Link
            key={tab.href + tab.label}
            href={tab.href}
            className={cn(
              "flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors relative",
              isActive
                ? "text-[var(--color-primary-600)]"
                : "text-[var(--color-gray-400)] hover:text-[var(--color-gray-600)]"
            )}
          >
            {tab.primary ? (
              <span className="-mt-5 w-12 h-12 rounded-full bg-[var(--color-primary-700)] grid place-items-center shadow-[var(--shadow-md)]">
                <Icon size={22} className="text-white" />
              </span>
            ) : (
              <Icon size={22} />
            )}
            <span>{tab.label}</span>
            {isActive && !tab.primary && (
              <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary-600)]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
