"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Car, Search, User, Menu, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchInput } from "@/components/domain/search-input";
import { SearchOverlay } from "@/components/domain/search-overlay";
import { createClient } from "@/lib/supabase/client";

export interface NavUser {
  name: string;
  email: string;
}

const NAV_LINKS = [
  { href: "/", label: "בית" },
  { href: "/dashboard", label: "הרכבים שלי" },
  { href: "/favorites", label: "מועדפים" },
  { href: "/history", label: "היסטוריה" },
  { href: "/settings", label: "הגדרות" },
];

interface NavbarProps {
  initialUser: NavUser | null;
}

export function Navbar({ initialUser }: NavbarProps) {
  const [user, setUser] = useState<NavUser | null>(initialUser);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const supabase = createClient();
    const { data: listener } = supabase.auth.onAuthStateChange((_e, session) => {
      const u = session?.user;
      setUser(
        u
          ? {
              name:
                (u.user_metadata?.name as string | undefined) ??
                u.email ??
                "משתמש",
              email: u.email ?? "",
            }
          : null
      );
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/";
  }

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-[var(--color-border)] shadow-[var(--shadow-sm)]">
      <div className="mx-auto max-w-[1200px] px-4 md:px-6 h-14 md:h-16 flex items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-700)] grid place-items-center text-white">
            <Car size={20} strokeWidth={2.5} />
          </div>
          <span className="text-lg font-black text-[var(--color-gray-900)] hidden sm:inline">
            MyCarPortal
          </span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-1 ms-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Quick search — desktop, fills the center */}
        <div className="hidden lg:flex flex-1 justify-center px-6">
          <div className="w-full max-w-sm">
            <SearchInput size="md" />
          </div>
        </div>

        {/* Spacer for md and below */}
        <div className="flex-1 lg:hidden" />

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {/* חיפוש מיידי — פותח חלון עם מקלדת במקום ניווט לעמוד הבית */}
          <button
            type="button"
            onClick={() => setSearchOpen(true)}
            aria-label="חיפוש רכב לפי מספר רישוי"
            aria-haspopup="dialog"
            className="lg:hidden w-10 h-10 grid place-items-center rounded-lg hover:bg-[var(--color-gray-100)]"
          >
            <Search size={20} className="text-[var(--color-gray-700)]" />
          </button>

          {user ? (
            <>
              <span className="hidden md:block text-sm text-[var(--color-text-subtle)] max-w-[160px] truncate">
                {user.name}
              </span>
              <button
                onClick={handleLogout}
                aria-label="התנתקות"
                className="hidden md:grid w-10 h-10 place-items-center rounded-lg hover:bg-[var(--color-gray-100)]"
              >
                <LogOut size={18} className="text-[var(--color-gray-700)]" />
              </button>
            </>
          ) : (
            <div className="hidden md:flex items-center gap-2">
              <Link href="/register">
                <Button variant="outline" size="sm">
                  הרשמה
                </Button>
              </Link>
              <Link href="/login">
                <Button variant="primary" size="sm">
                  <User size={16} />
                  התחברות
                </Button>
              </Link>
            </div>
          )}

          {/* Hamburger — mobile */}
          <button
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "סגור תפריט" : "פתח תפריט"}
            aria-expanded={menuOpen}
            className="md:hidden w-10 h-10 grid place-items-center rounded-lg hover:bg-[var(--color-gray-100)]"
          >
            {menuOpen ? (
              <X size={20} className="text-[var(--color-gray-700)]" />
            ) : (
              <Menu size={20} className="text-[var(--color-gray-700)]" />
            )}
          </button>
        </div>
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-white shadow-[var(--shadow-md)]">
          <div className="px-4 py-4 space-y-3">
            <SearchInput size="md" />

            <nav className="flex flex-col">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="px-3 py-3 rounded-lg text-sm font-medium text-[var(--color-gray-700)] hover:bg-[var(--color-gray-100)] transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="pt-2 border-t border-[var(--color-border)]">
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm text-[var(--color-text-subtle)] truncate">
                    {user.name}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 text-sm font-medium text-[var(--color-danger)] px-3 py-2 rounded-lg hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    התנתק
                  </button>
                </div>
              ) : (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block">
                  <Button variant="primary" size="sm" className="w-full">
                    <User size={16} />
                    התחברות / הרשמה
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
