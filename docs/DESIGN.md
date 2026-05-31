# MyCarPortal — Design System

> מסמך עיצוב מלא לשימוש בשלב 5 ו-6 של הפרויקט.  
> כל החלטות העיצוב מבוססות על Wireframes, CLAUDE.md ו-FEATURES.md.

---

## 1. זהות ויזואלית (Brand Identity)

### 1.1 שם ולוגו

- **שם:** MyCarPortal
- **סלוגן:** "בדוק כל רכב בישראל תוך שניות"
- **לוגו:** אייקון מכונית מינימליסטי + טקסט `MyCarPortal` בפונט Heebo Bold
- **פאביקון:** אייקון מכונית בצבע Primary על רקע לבן (32×32, 192×192, 512×512 לPWA)

### 1.2 Tone & Feel

- **מקצועי אך נגיש** — לא רשמי כמו ממשלה, לא צבעוני כמו גיימינג
- **בטוח ומהימן** — מידע רשמי, לא "אתר של סוחר"
- **ישראלי** — RTL מלא, עברית ראשונה, ₪ ולא $

---

## 2. מערכת צבעים (Color System)

### 2.1 Palette ראשי

```css
/* Primary — כחול כהה, אמון ומקצועיות */
--color-primary-900: #0f172a;
--color-primary-800: #1e293b;
--color-primary-700: #2C3E50;   /* ← Primary Main */
--color-primary-600: #334155;
--color-primary-500: #2563eb;   /* ← PWA theme color, links */
--color-primary-400: #3b82f6;
--color-primary-100: #dbeafe;
--color-primary-50:  #eff6ff;

/* Neutral — אפורים לטקסט ורקעים */
--color-gray-900: #111827;   /* כותרות ראשיות */
--color-gray-700: #374151;   /* טקסט רגיל */
--color-gray-500: #6b7280;   /* טקסט משני */
--color-gray-400: #9ca3af;   /* placeholder */
--color-gray-200: #e5e7eb;   /* גבולות */
--color-gray-100: #f3f4f6;   /* רקע כרטיסים */
--color-gray-50:  #f9fafb;   /* רקע דף */
```

### 2.2 ציון סיכון — Risk Score Colors

```css
/* 🟢 נראה טוב — ציון 0-33 */
--color-risk-good-bg:     #dcfce7;
--color-risk-good-border: #22c55e;
--color-risk-good-text:   #15803d;
--color-risk-good-hex:    #22c55e;

/* 🟡 יש מה לבדוק — ציון 34-66 */
--color-risk-warn-bg:     #fef9c3;
--color-risk-warn-border: #eab308;
--color-risk-warn-text:   #854d0e;
--color-risk-warn-hex:    #eab308;

/* 🔴 סיכון גבוה — ציון 67-100 */
--color-risk-high-bg:     #fee2e2;
--color-risk-high-border: #ef4444;
--color-risk-high-text:   #b91c1c;
--color-risk-high-hex:    #ef4444;
```

### 2.3 Semantic Colors

```css
/* סטטוסים */
--color-success: #22c55e;   /* טסט בתוקף, אין ריקולים */
--color-warning: #f59e0b;   /* טסט מתקרב, < 30 יום */
--color-danger:  #ef4444;   /* טסט פג, ריקול פתוח */
--color-info:    #3b82f6;   /* ביטוח, מידע כללי */

/* תגיות */
--color-tag-public:  #dbeafe;   /* ציבורי — כחול בהיר */
--color-tag-auth:    #dcfce7;   /* מחובר — ירוק בהיר */
--color-tag-premium: #fef3c7;   /* פרמיום — צהוב בהיר */
```

### 2.4 שימוש בצבעים — כללי

| אלמנט | צבע |
|-------|-----|
| Navbar רקע | `white` / `gray-50` |
| Hero section | `primary-700` (#2C3E50) |
| כותרות ראשיות | `gray-900` |
| טקסט רגיל | `gray-700` |
| טקסט משני | `gray-500` |
| גבולות כרטיסים | `gray-200` |
| רקע כרטיס | `gray-50` / `white` |
| כפתור ראשי | `primary-700` + טקסט לבן |
| כפתור משני | `gray-100` + טקסט `gray-700` |
| קישורים | `primary-500` |

---

## 3. טיפוגרפיה (Typography)

### 3.1 פונט

```css
/* ← הפונט הראשי של האפליקציה */
font-family: 'Heebo', sans-serif;

/* טעינה ב-Next.js */
/* app/layout.tsx */
import { Heebo } from 'next/font/google'
const heebo = Heebo({ subsets: ['hebrew', 'latin'], weight: ['400','500','700','900'] })
```

> **למה Heebo?** פונט גוגל ישראלי, תומך עברית + לטינית, קריא בכל גודל, חינמי.

### 3.2 סקאלת גדלים

```css
/* Tailwind v4 — שימוש בכיתות */
text-xs   → 12px  /* תגיות, תאריכים, הערות שוליים */
text-sm   → 14px  /* טקסט משני, תיאורים */
text-base → 16px  /* טקסט גוף (מינימום למניעת zoom ב-iOS) */
text-lg   → 18px  /* כותרות כרטיסים */
text-xl   → 20px  /* כותרות סקשן */
text-2xl  → 24px  /* כותרות עמוד */
text-3xl  → 30px  /* Hero headline */
text-4xl  → 36px  /* Hero — דסקטופ בלבד */
```

### 3.3 משקלים

```css
font-normal  → 400  /* טקסט רגיל */
font-medium  → 500  /* כותרות משנה, label */
font-bold    → 700  /* כותרות ראשיות, כפתורים */
font-black   → 900  /* Hero — "בדוק כל רכב בישראל" */
```

### 3.4 Line Height

```css
leading-tight  → 1.25  /* כותרות */
leading-normal → 1.5   /* טקסט גוף */
leading-relaxed→ 1.625 /* פסקאות ארוכות */
```

---

## 4. RTL — כיוון טקסט

### 4.1 הגדרה גלובלית

```tsx
// app/layout.tsx
<html lang="he" dir="rtl">
```

### 4.2 Tailwind Logical Properties — חובה

> **❌ אסור** להשתמש ב-`ml-`, `mr-`, `pl-`, `pr-`, `left-`, `right-`  
> **✅ חובה** להשתמש ב-Logical Properties:

```css
/* מרווח פנימי */
ps-4  ← padding-inline-start (= padding-right ב-RTL)
pe-4  ← padding-inline-end   (= padding-left ב-RTL)

/* מרווח חיצוני */
ms-4  ← margin-inline-start
me-4  ← margin-inline-end

/* מיקום */
start-0  ← inset-inline-start
end-0    ← inset-inline-end

/* Border */
border-s  ← border-inline-start
border-e  ← border-inline-end

/* Rounded */
rounded-s-lg  ← border-start-start-radius + border-end-start-radius
rounded-e-lg  ← border-start-end-radius + border-end-end-radius
```

### 4.3 shadcn/ui RTL

```bash
# התקנה עם תמיכת RTL מובנית (מינואר 2026)
npx shadcn@latest init --rtl
```

> כל הקומפוננטים של shadcn (Dropdown, Dialog, Sheet, etc.) מכבדים את `dir="rtl"` אוטומטית.

---

## 5. Grid & Layout

### 5.1 Breakpoints

| Breakpoint | px | שימוש |
|---|---|---|
| `xs` | < 480px | מובייל קטן (iPhone SE) |
| `sm` | 480–640px | מובייל רגיל |
| `md` | 640–1024px | טאבלט + מובייל רחב |
| `lg` | 1024–1280px | דסקטופ קטן |
| `xl` | > 1280px | דסקטופ מלא |

### 5.2 Container

```css
max-width: 1200px;
margin: 0 auto;
padding: 0 16px;   /* מובייל */
padding: 0 24px;   /* md+ */
```

### 5.3 מבנה עמוד (Mobile)

```
┌─────────────────────┐
│ Navbar (fixed, 56px)│
├─────────────────────┤
│                     │
│  Page Content       │
│  (scroll)           │
│                     │
├─────────────────────┤
│ Bottom Nav (56px)   │
└─────────────────────┘
```

### 5.4 מבנה עמוד (Desktop)

```
┌─────────────────────────────────────┐
│ Navbar (fixed, 64px)                │
├─────────────┬───────────────────────┤
│ Sidebar     │  Main Content         │
│ (240px)     │  (max 860px)          │
│ fixed       │  scroll               │
└─────────────┴───────────────────────┘
```

---

## 6. Spacing Scale

```css
/* Tailwind defaults — מה אנחנו משתמשים */
gap-1   → 4px    /* בין אלמנטים קטנים */
gap-2   → 8px    /* בין אייקון לטקסט */
gap-3   → 12px   /* בין שדות בטופס */
gap-4   → 16px   /* padding בסיסי, בין כרטיסים */
gap-6   → 24px   /* בין סקשנים קטנים */
gap-8   → 32px   /* בין סקשנים גדולים */
gap-12  → 48px   /* Hero sections */
```

---

## 7. קומפוננטים — עיצוב ספציפי

### 7.1 Risk Badge

הרכיב המרכזי באפליקציה — מופיע בראש עמוד תוצאות ובכרטיסי מועדפים.

```tsx
// variants: "good" | "warn" | "high"

// גודל גדול — עמוד תוצאות
<div className="flex items-center gap-2 px-4 py-2 rounded-full border-2"
     style={{ background: riskBg, borderColor: riskBorder }}>
  <span className="text-2xl font-black">{score}</span>
  <div>
    <div className="text-sm font-bold">{label}</div>       {/* נראה טוב */}
    <div className="text-xs opacity-75">{score}/100</div>
  </div>
</div>

// גודל קטן — כרטיסי מועדפים
<span className="px-2 py-1 rounded-full text-xs font-bold"
      style={{ background: riskBg, color: riskText }}>
  {score}/100
</span>
```

| ציון | צבע רקע | גבול | טקסט | מסר |
|---|---|---|---|---|
| 0–33 | `#dcfce7` | `#22c55e` | `#15803d` | "נראה טוב" |
| 34–66 | `#fef9c3` | `#eab308` | `#854d0e` | "יש מה לבדוק" |
| 67–100 | `#fee2e2` | `#ef4444` | `#b91c1c` | "סיכון גבוה" |

---

### 7.2 Vehicle Card (Dashboard)

```
┌─────────────────────────────────────┐
│  [לוגו יצרן 40px]  שם/כינוי  bold   │
│                    יצרן דגם שנה      │
│                                     │
│  טסט:    [██████████░░░░] 45 יום ⚠️  │
│  ביטוח:  [████████████░░] 90 יום ✅  │
│                                     │
│  [פרטים]              [תזכורת]       │
└─────────────────────────────────────┘
```

- **Progress bar טסט:** ירוק > 60 יום / צהוב 30-60 / אדום < 30
- **Progress bar ביטוח:** אותו הגיון
- Border: `gray-200` רגיל / `warning` אם מתקרב / `danger` אם פג
- Hover: `shadow-md` + `border-primary-300`
- Radius: `rounded-xl` (12px)

---

### 7.3 Search Input

```
┌──────────────────────────────────────┐
│  🔍  הזן מספר רישוי...    [📷] [חפש] │
└──────────────────────────────────────┘
```

- גודל: `h-14` (56px) — גדול לנוחות מובייל
- Radius: `rounded-2xl`
- Border: `2px solid gray-200` → `primary-500` ב-focus
- Shadow: `shadow-sm` → `shadow-md` ב-focus
- אייקון מצלמה: פותח OCR dialog

---

### 7.4 Section Headers (עמוד תוצאות)

```tsx
// כל סקשן: רקע כהה + כותרת לבנה
<div className="bg-primary-700 text-white px-4 py-3 rounded-t-lg font-bold text-sm">
  ═══ פרטים כלליים ═══
</div>
<div className="border border-gray-200 rounded-b-lg p-4">
  {/* תוכן הסקשן */}
</div>
```

---

### 7.5 Ownership Timeline

```tsx
// ציר זמן אנכי של בעלויות
<div className="relative ps-8">
  {owners.map((owner, i) => (
    <div className="relative mb-4">
      {/* עיגול על הציר */}
      <div className="absolute start-0 w-3 h-3 rounded-full bg-primary-500 
                      border-2 border-white shadow" />
      {/* קו מחבר */}
      {i < owners.length-1 && (
        <div className="absolute start-1.5 top-3 w-0.5 h-full bg-gray-200" />
      )}
      {/* תוכן */}
      <div className="ms-6">
        <span className="text-sm text-gray-500">{owner.date}</span>
        <span className="ms-3 font-medium">{owner.type}</span>
      </div>
    </div>
  ))}
</div>
```

---

### 7.6 Navbar

**מובייל:**
```
┌─────────────────────────────────────┐
│  ☰   MyCarPortal   [🔍] [👤]        │
└─────────────────────────────────────┘
```

**דסקטופ:**
```
┌─────────────────────────────────────────────────────┐
│  🚗 MyCarPortal    בית  מועדפים  היסטוריה    [התחבר] │
└─────────────────────────────────────────────────────┘
```

- גובה: `h-14` מובייל / `h-16` דסקטופ
- רקע: `white` + `border-b border-gray-200`
- Sticky: `sticky top-0 z-50`
- Shadow: `shadow-sm`

---

### 7.7 Bottom Navigation (מובייל בלבד)

```
┌──────────────────────────────────────┐
│  🏠       ⭐       🔍       🕐       ⚙️ │
│  בית   מועדפים  חיפוש  היסטוריה הגדרות│
└──────────────────────────────────────┘
```

- גובה: `h-14` (56px)
- רקע: `white` + `border-t border-gray-200`
- Tab פעיל: `text-primary-600` + נקודה קטנה מתחת
- Tab לא פעיל: `text-gray-400`
- `fixed bottom-0 inset-x-0 z-50`

---

### 7.8 Alert Banner (Dashboard)

```tsx
// סוגים: warning / danger / info
<div className="flex items-center gap-3 px-4 py-3 rounded-lg mb-4
                bg-yellow-50 border border-yellow-300">
  <span className="text-xl">⚠️</span>
  <div>
    <p className="font-medium text-yellow-800">טסט של הונדה סיוויק פג בעוד 23 יום</p>
    <p className="text-sm text-yellow-600">לחץ לצפייה בפרטים</p>
  </div>
  <button className="ms-auto text-yellow-500">←</button>
</div>
```

---

### 7.9 Loading Skeleton

```tsx
// כל skeleton: אנימציית pulse
<div className="animate-pulse">
  <div className="h-48 bg-gray-200 rounded-xl mb-4" />        {/* תמונת רכב */}
  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2" />      {/* שם רכב */}
  <div className="h-4 bg-gray-200 rounded w-1/2 mb-6" />      {/* פרטים */}
  {/* 9 סקשנים */}
  {Array.from({length: 9}).map((_, i) => (
    <div key={i} className="h-24 bg-gray-100 rounded-xl mb-3" />
  ))}
</div>
```

---

### 7.10 Empty State

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <span className="text-6xl mb-4">🚗</span>
  <h3 className="text-xl font-bold text-gray-700 mb-2">אין רכבים עדיין</h3>
  <p className="text-gray-500 mb-6">חפש רכב לפי מספר רישוי והוסף אותו לניהול</p>
  <Button>חפש רכב</Button>
</div>
```

---

### 7.11 Error State

```tsx
<div className="flex flex-col items-center justify-center py-16 text-center">
  <span className="text-6xl mb-4">⚠️</span>
  <h3 className="text-xl font-bold text-gray-700 mb-2">משהו השתבש</h3>
  <p className="text-gray-500 mb-6">{errorMessage}</p>
  <Button variant="outline" onClick={retry}>נסה שוב</Button>
</div>
```

---

## 8. אייקונים

### 8.1 ספרייה

```bash
npm install lucide-react
```

> **למה Lucide?** shadcn משתמש בה, תומך RTL, Tree-shakable, עברי-נקי.

### 8.2 אייקונים מרכזיים

| שימוש | אייקון Lucide |
|-------|---------------|
| חיפוש | `Search` |
| מצלמה / OCR | `Camera` |
| רכב | `Car` |
| תזכורת / שעון | `Clock` |
| מסמך | `FileText` |
| מועדפים | `Star` / `StarOff` |
| הגדרות | `Settings` |
| מחק | `Trash2` |
| עריכה | `Pencil` |
| הוספה | `Plus` |
| חץ חזרה | `ChevronRight` (ב-RTL!) |
| אזהרה | `AlertTriangle` |
| אישור | `CheckCircle2` |
| שגיאה | `XCircle` |
| פרמיום | `Crown` |
| Push | `Bell` |
| שתף | `Share2` |
| PDF | `FileDown` |

> **⚠️ RTL + חצים:** ב-RTL `ChevronRight` = "חזרה" ו-`ChevronLeft` = "קדימה". היפוך מאנגלית.

---

## 9. אנימציות ומעברים

### 9.1 Transitions

```css
/* כלל ברירת מחדל לאלמנטים אינטראקטיביים */
transition: all 150ms ease-in-out;

/* כרטיסים */
transition: shadow 200ms, border-color 200ms, transform 150ms;

/* כפתורים */
transition: background 100ms, opacity 100ms;
```

### 9.2 Hover States

```css
/* כרטיס רכב */
hover:shadow-md hover:-translate-y-0.5

/* כפתור ראשי */
hover:bg-primary-800 active:scale-95

/* כרטיס מועדפים */
hover:border-primary-300 hover:shadow-sm
```

### 9.3 Page Transitions (Next.js)

- כניסה לעמוד: fade-in `opacity-0 → opacity-100` (200ms)
- Loading: skeleton בפרטי עמוד, spinner במקרים נדירים
- **אין** אנימציות מסובכות — מהירות > יפה

---

## 10. עמוד תוצאות — מבנה ויזואלי מלא

```
┌─────────────────────────────────┐
│ [תמונת רכב CGI — imagin.studio] │  ← h-48 מובייל / h-64 דסקטופ
│ [לוגו יצרן 40px]                │  ← absolute, bottom-start-4
├─────────────────────────────────┤
│ טויוטה COROLLA 2019             │  ← text-2xl font-black
│ יד 3 | לבן שנהב | בנזין         │  ← text-sm text-gray-500
│              [🟢 28/100 נראה טוב]│  ← Risk Badge
├─────────────────────────────────┤
│ [⭐ מועדפים] [📤 שתף] [📄 PDF] [🚗]│  ← 4 כפתורי פעולה
├─────────────────────────────────┤
│ ═══ פרטים כלליים ═══            │
│ יצרן: טויוטה יפן    שנה: 2019  │
│ ...                             │
├─────────────────────────────────┤
│ ═══ מנוע ומפרט ═══              │
│ ...                             │
├─────────────────────────────────┤
│ ═══ בעלויות ═══                 │
│ [Timeline אנכי]                 │
├─────────────────────────────────┤
│ ═══ טסט וקילומטראז' ═══         │
├─────────────────────────────────┤
│ ═══ ריקולים ═══                 │
├─────────────────────────────────┤
│ ═══ בטיחות ═══                  │
│ [Grid של checkmarks]            │
├─────────────────────────────────┤
│ ═══ סביבה ופליטות ═══           │
├─────────────────────────────────┤
│ ═══ צמיגים ═══                  │
├─────────────────────────────────┤
│ ═══ ציון סיכון — פירוט ═══      │
│ [Progress bars לכל פרמטר]       │
├─────────────────────────────────┤
│ ═══ קישורים שימושיים ═══        │
│ 🔗 בדיקת רכב גנוב               │
│ 🔗 משרד התחבורה                 │
├─────────────────────────────────┤
│ ⚠️ Disclaimer                   │
└─────────────────────────────────┘
```

---

## 11. תמונות רכב — imagin.studio

```typescript
// lib/car-image.ts
export function getCarImageUrl(params: {
  make: string;        // "toyota"
  model: string;       // "corolla"
  year: number;        // 2019
  colorCode?: string;  // optional paint code
}): string {
  const base = 'https://cdn.imagin.studio/getimage'
  return `${base}?customer=mycarportal&make=${params.make}&modelFamily=${params.model}&modelYear=${params.year}&paintId=${params.colorCode ?? 'base'}`
}

// Fallback אם imagin.studio לא מוצא
// → placeholder אפור עם אייקון מכונית
```

**תצוגה:**
- מובייל: `w-full h-48 object-cover`
- דסקטופ: `w-full h-64 object-cover`
- Radius: `rounded-xl` בעמוד תוצאות / `rounded-lg` בכרטיסים
- Fallback: `bg-gray-100` עם `Car` icon מ-Lucide במרכז

---

## 12. לוגו יצרן — avto-dev CDN

```typescript
// lib/manufacturer-logos.ts
export function getManufacturerLogoUrl(hebrewName: string): string {
  const slug = MANUFACTURER_SLUGS[hebrewName] ?? hebrewName.toLowerCase()
  return `https://raw.githubusercontent.com/avto-dev/vehicle-logotypes/master/src/svg/${slug}.svg`
}

const MANUFACTURER_SLUGS: Record<string, string> = {
  'טויוטה': 'toyota',
  'הונדה': 'honda',
  'מזדה': 'mazda',
  'יונדאי': 'hyundai',
  'קיה': 'kia',
  'סוזוקי': 'suzuki',
  'מיצובישי': 'mitsubishi',
  'ניסאן': 'nissan',
  'פולקסווגן': 'volkswagen',
  'סקודה': 'skoda',
  // ... המשך ב-lib/manufacturer-logos.ts
}
```

**תצוגה:** `w-10 h-10 object-contain` עם `next/image`

---

## 13. PWA — Visual

### 13.1 Theme

```typescript
// app/manifest.ts
{
  theme_color: '#2563eb',      // כחול ראשי
  background_color: '#ffffff', // לבן
  display: 'standalone',
  orientation: 'portrait',
}
```

### 13.2 Splash Screen

- רקע: `white`
- לוגו: מרכז המסך, 120px
- טקסט: "MyCarPortal" מתחת ללוגו

### 13.3 Install Banner

```tsx
// components/layout/add-to-homescreen.tsx
// מופיע לאחר 30 שניות, מלמטה (slide-up)
// "הוסף למסך הבית לחוויה הטובה ביותר"
// כפתורים: "הוסף" / "אחר כך"
```

---

## 14. Responsive Design

### 14.1 גרסת מובייל (< 640px) — **עדיפות ראשונה**

- Bottom Navigation (5 tabs)
- Search input — גדול, מלא רוחב
- כרטיסי רכב — עמודה אחת
- תוצאות חיפוש — סקשנים מוערמים
- Touch targets: מינימום 44×44px
- Font-size גוף: מינימום 16px (מונע auto-zoom ב-iOS)

### 14.2 גרסת טאבלט (640–1024px)

- Bottom Nav → Sidebar מתכווץ (icons בלבד)
- 2 עמודות בדשבורד
- תמונת רכב גדולה יותר

### 14.3 גרסת דסקטופ (> 1024px)

- Sidebar קבוע 240px
- עמוד תוצאות: תמונה + פרטים side-by-side
- עד 3 כרטיסי רכב בשורה
- Hover states פעילים

---

## 15. Accessibility

- **Contrast ratio:** מינימום 4.5:1 לטקסט רגיל (WCAG AA)
- **Focus visible:** `focus-visible:ring-2 ring-primary-500` על כל אלמנט אינטראקטיבי
- **Alt text:** לכל תמונת רכב ולוגו יצרן
- **ARIA labels:** לכפתורי אייקון בלי טקסט
- **Semantic HTML:** `<main>`, `<nav>`, `<section>`, `<article>`
- **Skip link:** "דלג לתוכן הראשי" בראש הדף

---

## 16. shadcn/ui — קומפוננטים בשימוש

```bash
# קומפוננטים שיותקנו
npx shadcn@latest add button
npx shadcn@latest add input
npx shadcn@latest add card
npx shadcn@latest add dialog
npx shadcn@latest add sheet          # mobile drawer
npx shadcn@latest add tabs
npx shadcn@latest add badge
npx shadcn@latest add progress
npx shadcn@latest add skeleton
npx shadcn@latest add toast          # הודעות הצלחה/שגיאה
npx shadcn@latest add alert
npx shadcn@latest add dropdown-menu
npx shadcn@latest add avatar
npx shadcn@latest add separator
```

### 16.1 Theme Override (globals.css)

```css
@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --primary: 217 91% 60%;          /* #2563eb */
    --primary-foreground: 0 0% 100%;
    --ring: 217 91% 60%;
    --radius: 0.75rem;               /* 12px — יותר עגול */
  }
}
```

---

## 17. קבצי CSS — מבנה

```
app/
└── globals.css
    ├── @import 'tailwindcss'
    ├── @import './fonts.css'        ← Heebo
    ├── :root { CSS variables }
    ├── .risk-good / .risk-warn / .risk-high
    ├── .skeleton { animate-pulse }
    └── custom scrollbar (Hebrew-friendly)
```

---

## 18. Checklist לפני פיתוח

- [ ] `html dir="rtl" lang="he"` מוגדר ב-root layout
- [ ] Heebo נטען עם `next/font/google`
- [ ] shadcn/ui מותקן עם `--rtl`
- [ ] Tailwind logical properties בלבד (אין `ml-`/`mr-`)
- [ ] Risk Badge נבדק בשלושת הצבעים
- [ ] Skeleton loading לכל עמוד שמשיג API
- [ ] Touch targets ≥ 44px
- [ ] Font-size גוף ≥ 16px
- [ ] Bottom Nav קיים במובייל
- [ ] תמונות עם `next/image` + alt text
- [ ] Focus styles נראים בכל מקום
