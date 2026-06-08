import Link from "next/link";
import { Car } from "lucide-react";

export function Footer() {
  return (
    <footer className="hidden md:block bg-[var(--color-gray-900)] text-[var(--color-gray-300)] mt-12">
      <div className="mx-auto max-w-[1200px] px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-primary-500)] grid place-items-center text-white">
              <Car size={20} strokeWidth={2.5} />
            </div>
            <span className="text-lg font-black text-white">MyCarPortal</span>
          </div>
          <p className="text-sm text-[var(--color-gray-400)] leading-relaxed">
            בדוק כל רכב בישראל תוך שניות. מידע רשמי ממשרד התחבורה, הערכת שווי וניהול הרכב האישי שלך — במקום אחד.
          </p>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-3">המוצר</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/" className="hover:text-white">חיפוש רכב</Link></li>
            <li><Link href="/dashboard" className="hover:text-white">הרכבים שלי</Link></li>
            <li><Link href="/favorites" className="hover:text-white">מועדפים</Link></li>
            <li><Link href="/compare" className="hover:text-white">השוואת רכבים</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-3">החברה</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/history" className="hover:text-white">היסטוריית חיפושים</Link></li>
            <li><Link href="/privacy" className="hover:text-white">פרטיות</Link></li>
            <li><Link href="/terms" className="hover:text-white">תנאי שימוש</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold text-white mb-3">נתונים</h4>
          <p className="text-xs text-[var(--color-gray-400)] leading-relaxed">
            כל המידע נשלף ממאגרי data.gov.il של ממשלת ישראל. הנתונים מתעדכנים מדי יום.
          </p>
          <p className="text-xs text-[var(--color-gray-500)] mt-3">
            ⚠️ המידע אינו מחליף בדיקה פיזית במכון מורשה.
          </p>
        </div>
      </div>
      <div className="border-t border-[var(--color-gray-800)]">
        <div className="mx-auto max-w-[1200px] px-6 py-4 text-xs text-[var(--color-gray-500)] flex justify-between">
          <span>© 2026 MyCarPortal. כל הזכויות שמורות.</span>
          <span>נבנה בישראל 🇮🇱</span>
        </div>
      </div>
    </footer>
  );
}
