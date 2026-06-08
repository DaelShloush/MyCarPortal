# MyCarPortal — Frontend

> פרויקט גמר Full-Stack מונחה AI · מודול 6 (Frontend Development)

אפליקציית ווב ישראלית (PWA) לחיפוש ובדיקת רכבים פרטיים ולניהול הרכב האישי. הפרויקט שולף נתונים ממאגרי data.gov.il (משרד התחבורה) ומציג מידע מקיף על כל רכב.

## סטאק

- **Framework:** Next.js 16 (App Router) + React 19
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4 + CSS Variables (logical properties — `ms-`, `me-`, `start-`, `end-`)
- **Fonts:** Heebo (Google Fonts) — תומך עברית + לטינית
- **Icons:** lucide-react
- **RTL:** מובנה (`<html dir="rtl" lang="he">`)

## שלב הפרויקט הנוכחי — Static Frontend

הפרויקט נמצא בשלב Frontend Development. **כל הנתונים הם dummy/placeholder** — אין חיבור ל-Backend, אין API חיצוני, אין אימות אמיתי. בשלבים הבאים (מודולים 7-8) יחובר Supabase + data.gov.il.

## הפעלה

```bash
npm install
npm run dev
# פתח http://localhost:3000
```

## מבנה תיקיות

```
frontend/
├── DESIGN.md                  # Design System (מקור האמת לעיצוב)
├── app/
│   ├── globals.css            # CSS Variables + Tailwind v4
│   ├── layout.tsx             # Root layout — RTL + Heebo
│   ├── page.tsx               # / — Landing page
│   ├── (auth)/
│   │   ├── layout.tsx
│   │   ├── login/page.tsx     # /login
│   │   └── register/page.tsx  # /register
│   ├── search/[plate]/page.tsx    # /search/:plate — תוצאות חיפוש (single page)
│   ├── dashboard/page.tsx     # /dashboard — הרכבים שלי
│   ├── vehicle/[id]/page.tsx  # /vehicle/:id — פרטי רכב אישי
│   ├── favorites/page.tsx     # /favorites
│   ├── history/page.tsx       # /history
│   └── settings/page.tsx      # /settings
├── components/
│   ├── ui/                    # Primitives (Button, Card, Input, Badge, Progress, Section)
│   ├── layout/                # Navbar, Footer, MobileBottomNav, SiteShell
│   └── domain/                # רכיבי Domain (VehicleCard, OwnershipTimeline, וכו')
└── lib/
    ├── types.ts               # TypeScript domain types
    ├── dummy-data.ts          # נתוני placeholder
    └── utils.ts               # cn() — Tailwind class merger
```

## עמודים (9)

| URL | רכיב | תיאור |
|-----|------|--------|
| `/` | LandingPage | עמוד נחיתה — Hero + חיפוש + Features + How it works |
| `/search/[plate]` | SearchResultsPage | תוצאות חיפוש רכב לפי מספר רישוי — single page עם 9 סקשנים |
| `/dashboard` | DashboardPage | "הרכבים שלי" — VehicleCards + תזכורות פעילות |
| `/vehicle/[id]` | VehicleDetailPage | פרטי רכב אישי + טיפולים + מסמכים + תזכורות |
| `/favorites` | FavoritesPage | מועדפים + השוואה |
| `/history` | HistoryPage | היסטוריית חיפושים |
| `/settings` | SettingsPage | פרופיל + מנוי + התראות |
| `/login` | LoginPage | התחברות |
| `/register` | RegisterPage | הרשמה |

לחיפוש דוגמה: `/search/1234567`, `/search/8901234`, `/search/5556677`.

## רכיבים מרכזיים

- **`SiteShell`** — Layout wrapper המכיל Navbar, Footer ו-MobileBottomNav. עוטף את כל העמודים.
- **`OwnershipTimeline`** — ציר זמן אנכי של היסטוריית בעלויות, עם הדגשה לסוחרים ולבעלים נוכחי.
- **`SafetyGrid`** — רשת של מערכות בטיחות (ABS, ESP, ADAS) עם ✓/✗.
- **`VehicleCard`** — כרטיס רכב לדשבורד עם פרוגרס בר לטסט וביטוח.

## Design System

כל הצבעים, הריווח, רדיוס וצללים מוגדרים כ-**CSS Custom Properties** ב-[`app/globals.css`](app/globals.css). אין hardcoded values בקומפוננטים — הכל דרך `var(--color-primary-700)` וכו'.

ראה את [DESIGN.md](DESIGN.md) לפרטים המלאים.

## ⚠️ Disclaimer

המידע מבוסס על נתונים ציבוריים בלבד ואינו מחליף בדיקה פיזית במכון מורשה.

---

נבנה ב-2026 בישראל 🇮🇱
