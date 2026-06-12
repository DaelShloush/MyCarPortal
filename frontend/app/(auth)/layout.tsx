import Link from "next/link";
import { Car, ArrowRight } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-bg-subtle)] p-4">
      <div className="w-full max-w-md">
        {/* יציאה ברורה — לעמודי auth אין navbar, ובלי הקישור הזה משתמשים
            נתקעו כאן (באג אמיתי: הדרך היחידה החוצה הייתה לסגור את הדפדפן) */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 mb-4 -ms-2 px-3 py-2 rounded-lg text-sm font-medium text-[var(--color-gray-700)] hover:bg-white hover:text-[var(--color-primary-700)] transition-colors"
        >
          <ArrowRight size={16} />
          חזרה לדף הבית
        </Link>

        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-700)] grid place-items-center text-white">
            <Car size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black text-[var(--color-gray-900)]">MyCarPortal</span>
        </Link>
        {children}
        <div className="text-center mt-6 space-y-3">
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-primary-600)] hover:underline"
          >
            <ArrowRight size={15} />
            המשך לחיפוש רכב בלי חשבון
          </Link>
          <p className="text-xs text-center text-[var(--color-text-subtle)]">
            ⚠️ המידע מבוסס על נתונים ציבוריים בלבד ואינו מחליף בדיקה פיזית.
          </p>
        </div>
      </div>
    </div>
  );
}
