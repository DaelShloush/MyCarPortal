// תוכן עניינים קומפקטי לנייד — צ'יפים נדבקים מתחת ל-navbar שמקפיצים לסקשנים.
// בדסקטופ העמוד קצר יחסית לגלילה ולכן מוצג בנייד בלבד.

const LINKS: { href: string; label: string }[] = [
  { href: "#ownership", label: "בעלויות" },
  { href: "#test", label: "טסט וק״מ" },
  { href: "#recalls", label: "ריקולים" },
  { href: "#value", label: "שווי ועלויות" },
  { href: "#safety", label: "בטיחות" },
  { href: "#specs", label: "מפרט" },
  { href: "#score", label: "ציון" },
];

interface SectionNavProps {
  /** עוגנים להסתרה כשהסקשן לא קיים בעמוד (למשל "#value" ברכב ישן ללא מחירון) */
  hide?: string[];
}

export function SectionNav({ hide = [] }: SectionNavProps) {
  const links = LINKS.filter((l) => !hide.includes(l.href));
  return (
    <nav
      aria-label="ניווט מהיר בדוח"
      className="md:hidden sticky top-14 z-40 -mx-4 px-3 py-2 bg-white/95 backdrop-blur border-b border-[var(--color-border)] no-print"
    >
      {/* flex-wrap ולא גלילה אופקית — כל הקטגוריות גלויות בכל רוחב מסך */}
      <ul className="flex flex-wrap justify-center gap-1.5">
        {links.map((l) => (
          <li key={l.href}>
            <a
              href={l.href}
              className="block px-2.5 py-1 rounded-full text-[11px] font-bold bg-[var(--color-primary-50)] text-[var(--color-primary-700)] border border-[var(--color-primary-100)] active:bg-[var(--color-primary-100)] whitespace-nowrap"
            >
              {l.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
