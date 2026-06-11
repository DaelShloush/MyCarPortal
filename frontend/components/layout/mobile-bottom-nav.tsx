"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Home, Star, Search, Clock, Settings } from "lucide-react";
import { cn } from "@/lib/utils";
import { SearchOverlay } from "@/components/domain/search-overlay";

const TABS = [
  { href: "/dashboard", label: "בית", icon: Home },
  { href: "/favorites", label: "מועדפים", icon: Star },
  { href: "/history", label: "היסטוריה", icon: Clock },
  { href: "/settings", label: "הגדרות", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  // טאב רגיל משני הצדדים, כפתור חיפוש מורם במרכז
  const [home, favorites, history, settings] = TABS;
  const sideTabs = [
    [home, favorites],
    [history, settings],
  ];

  const renderTab = (tab: (typeof TABS)[number]) => {
    const Icon = tab.icon;
    const isActive = pathname === tab.href;
    return (
      <Link
        key={tab.href}
        href={tab.href}
        className={cn(
          "flex flex-col items-center justify-center gap-0.5 text-[11px] font-medium transition-colors relative",
          isActive
            ? "text-[var(--color-primary-600)]"
            : "text-[var(--color-gray-500)] hover:text-[var(--color-gray-700)]"
        )}
      >
        <Icon size={22} />
        <span>{tab.label}</span>
        {isActive && (
          <span className="absolute bottom-1 w-1 h-1 rounded-full bg-[var(--color-primary-600)]" />
        )}
      </Link>
    );
  };

  return (
    <>
      <nav
        aria-label="ניווט תחתון"
        className="md:hidden fixed bottom-0 inset-x-0 z-50 bg-white border-t border-[var(--color-border)] h-14 grid grid-cols-5"
      >
        {sideTabs[0].map(renderTab)}

        {/* כפתור חיפוש מרכזי — פותח חלון חיפוש מיידי עם מקלדת, לא ניווט */}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          aria-label="חיפוש רכב לפי מספר רישוי"
          aria-haspopup="dialog"
          className="flex flex-col items-center justify-center gap-0.5 text-[11px] font-bold text-[var(--color-primary-700)]"
        >
          <span className="-mt-5 w-12 h-12 rounded-full bg-[var(--color-primary-700)] grid place-items-center shadow-[var(--shadow-md)] active:scale-95 transition-transform">
            <Search size={22} className="text-white" />
          </span>
          <span>חיפוש</span>
        </button>

        {sideTabs[1].map(renderTab)}
      </nav>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
