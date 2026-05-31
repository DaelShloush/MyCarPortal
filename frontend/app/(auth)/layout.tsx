import Link from "next/link";
import { Car } from "lucide-react";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid place-items-center bg-[var(--color-bg-subtle)] p-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-11 h-11 rounded-xl bg-[var(--color-primary-700)] grid place-items-center text-white">
            <Car size={24} strokeWidth={2.5} />
          </div>
          <span className="text-xl font-black text-[var(--color-gray-900)]">MyCarPortal</span>
        </Link>
        {children}
        <p className="text-xs text-center text-[var(--color-text-subtle)] mt-6">
          ⚠️ הציון מבוסס על נתונים ציבוריים בלבד ואינו מחליף בדיקה פיזית.
        </p>
      </div>
    </div>
  );
}
