# MyCarPortal — מסמך פרויקט

## מה זה

MyCarPortal היא אפליקציית ווב ישראלית (PWA) שמרכזת מידע על רכבים פרטיים בישראל ומאפשרת ניהול רכב אישי. הפרויקט הוא פרויקט גמר לקורס Full-Stack מונחה AI. המפתח (דעאל) עובד לבד עם ניסיון בסיסי, ויש לו 4 חודשים. כל הפיתוח נעשה עם Codex.

## הבעיה שאנחנו פותרים

1. **רוכשי רכב יד שנייה** מבזבזים שעות על חיפוש ידני באתר משרד התחבורה, ומפחדים מהיסטוריה בעייתית שמתגלה רק מאוחר.
2. **בעלי רכב קיים** מאבדים שליטה על מועדי טסט וביטוח, מסתמכים על SMS שמתפספס, ומסמכי הרכב פזורים בלי תיעוד מסודר.

## הפתרון

פלטפורמה אחת שעושה שני דברים:

- **חיפוש רכב לפי מספר רישוי** — שולפת אוטומטית את כל הנתונים הרשמיים מ-data.gov.il, ומאפשרת קבלת החלטה מהירה לפני בדיקה פיזית.
- **ניהול רכב אישי** — דשבורד עם תזכורות לטסט וביטוח, אחסון מסמכים דיגיטלי, היסטוריית חיפושים ומועדפים.

## משתמשים

- **ראשי — דנה (28, מפתחת תוכנה, מרכז הארץ):** רוכשת רכב יד שנייה, רוצה לסנן רכבים מהר לפני בדיקה פיזית.
- **משני — יצחק (58, מהנדס מכונות, חיפה):** בעל רכב משפחתי, רוצה תזכורות אוטומטיות לטסט וביטוח ותיעוד מסודר.

---

## סטאק טכני

| רכיב        | טכנולוגיה                            | הערות                                   |
| ----------- | ------------------------------------ | --------------------------------------- |
| Framework   | Next.js 15 (App Router) + TypeScript |                                         |
| UI          | shadcn/ui עם `--rtl`                 | RTL מובנה מינואר 2026                   |
| Styling     | Tailwind CSS v4 + logical properties | `ms-4` במקום `ml-4`                     |
| PWA         | Serwist (`@serwist/next`)            | next-pwa מת, Serwist הממשיך הרשמי       |
| Auth        | Supabase Auth (email + Google)       |                                         |
| DB          | Supabase PostgreSQL + RLS            |                                         |
| Storage     | Supabase Storage                     | למסמכים                                 |
| Email       | Resend                               | התראות                                  |
| OCR         | Codex Haiku Vision API              | לוחיות רישוי + חשבוניות                 |
| API חיצוני  | data.gov.il (CKAN)                   | חינמי, ללא מפתח                         |
| תמונות רכב  | imagin.studio CGI API                | Free: 400px+watermark, Paid: מ-$99/חודש |
| לוגו יצרנים | avto-dev/vehicle-logotypes CDN       | חינמי, GitHub CDN                       |
| Hosting     | Vercel (Free Tier)                   |                                         |
| Payments    | Paddle או Stripe                     | פרמיום                                  |
| שפה         | עברית מלאה RTL                       |                                         |

---

## data.gov.il — מפת ה-API

### Endpoints בשימוש

כל הקריאות הן ל: `https://data.gov.il/api/3/action/datastore_search`

| #   | מטרה                         | Resource ID                            | רשומות | שדות עיקריים                                                                                                                                           |
| --- | ---------------------------- | -------------------------------------- | ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| 1   | **רכבים פעילים (ראשי)**      | `053cea08-09bc-40ec-8f7a-156f0677aff3` | 4.1M   | mispar_rechev, tozeret_nm, kinuy_mishari, shnat_yitzur, tzeva_rechev, sug_delek_nm, mivchan_acharon_dt, tokef_dt, baalut, misgeret, moed_aliya_lakvish |
| 2   | **רכבים פעילים (נוסף)**      | `0866573c-40cd-4ca8-91d2-9dd2d7a492e5` | 4.1M   | צמיגים (עומס, מהירות), גרירה                                                                                                                           |
| 3   | **היסטוריית בעלויות**        | `bb2355dc-9ec7-4f06-9c3f-3344672171da` | 5.0M   | mispar_rechev, baalut_dt (YYYYMM), baalut (פרטי/החכר/חברה/סוחר)                                                                                        |
| 4   | **היסטוריה טכנית**           | `56063a99-8a3e-4ff4-912e-5966c0279bad` | 2.3M   | kilometer_test_aharon, shinui_mivne_ind, shnui_zeva_ind, shinui_zmig_ind, rishum_rishon_dt, mispar_manoa                                               |
| 5   | **מפרט דגמים (90 שדות)**     | `142afde2-6228-49f9-8a29-9b6c3a0cbe40` | 98K    | koah_sus, nefah_manoa, nikud_betihut, madad_yarok, ADAS, פליטות WLTP, כריות אוויר, דלתות, מושבים ועוד                                                  |
| 6   | **ריקולים פתוחים (לפי רכב)** | `36bf1404-0be4-49d2-82dc-2f1ead4a8b93` | 129K   | MISPAR_RECHEV, TEUR_TAKALA, SUG_TAKALA, TAARICH_PTICHA                                                                                                 |
| 7   | **הודעות ריקול (לפי דגם)**   | `2c33523f-87aa-44ec-a736-edbb0a82975e` | 3.6K   | RECALL_ID, DEGEM, TEUR_TAKALA, OFEN_TIKUN                                                                                                              |
| 8   | **מחירון יבואנים**           | `39f455bf-6db0-4926-859d-017f34eacbcb` | 98K    | mehir, tozeret_nm, degem_nm, shnat_yitzur                                                                                                              |
| 9   | **רכבים לא פעילים**          | `f6efe89a-fb3d-43a4-bb61-9bf12a9b9099` | 580K   | אותם שדות כמו ראשי                                                                                                                                     |
| 10  | **ביטול סופי (גריטה)**       | `851ecab1-0622-4dbe-a6c7-f950cf82abf9` | 1.15M  | bitul_dt + שדות רכב                                                                                                                                    |
| 11  | **יבוא אישי**                | `03adc637-b6fe-402b-9937-7c3d3afc9140` | 27K    | shilda, nefach_manoa, tozeret_eretz_nm                                                                                                                 |
| 12  | **רכבים ציבוריים**           | `cf29862d-ca25-4691-84f6-1be60dcb4a1e` | 65K    | sug_rechev_nm, mispar_mekomot                                                                                                                          |
| 13  | **כמויות לפי דגם**           | `5e87a7a1-2f6f-41c1-8aec-7216d52a6cf6` | 98K    | mispar_rechavim_pailim, mispar_rechavim_le_pailim                                                                                                      |
| 14  | **תג נכה**                   | `c8b9f9c8-4612-4068-934f-d4acd2e3c06e` | ~200K  | MISPAR RECHEV, SUG_TAG, TAR_HATCHALA, TAR_SIYUM                                                                                                        |

### דוגמת שאילתה

```
GET https://data.gov.il/api/3/action/datastore_search
  ?resource_id=053cea08-09bc-40ec-8f7a-156f0677aff3
  &filters={"mispar_rechev":1234567}
  &limit=1
```

### מגבלות ידועות

- **אין** היסטוריית תאונות לפי רכב
- **אין** פירוט מבחני טסט (רק תאריך אחרון + ק"מ)
- **אין** שמות/פרטי בעלים (חוק פרטיות)
- **אין** API לבדיקת רכב גנוב — קישור חיצוני ל-police.gov.il בלבד
- endpoint של SQL (`datastore_search_sql`) **חסום** — 403
- **אין** rate limit מתועד, אבל יש WAF של Radware — לא לעשות scraping אגרסיבי
- נתונים מ-1996+ לרכב פרטי, 1998+ למסחרי
- היסטוריית בעלויות מ-2017+
- תג נכה: שדה עם רווח `"MISPAR RECHEV"` — צריך טיפול מיוחד ב-filter

### אסטרטגיית שאילתות — לכל חיפוש מספר רישוי

```typescript
// 6 קריאות מקבילות
const [main, extended, technical, ownership, recalls, disability] =
  await Promise.all([
    queryDataGov("053cea08-...", { mispar_rechev: plate }), // פרטי רכב ראשי
    queryDataGov("0866573c-...", { mispar_rechev: plate }), // צמיגים + גרירה + merkav + sug_tkina
    queryDataGov("56063a99-...", { mispar_rechev: plate }), // ק"מ + שינויים
    queryDataGov("bb2355dc-...", { mispar_rechev: plate }), // היסטוריית בעלויות
    queryDataGov("36bf1404-...", { MISPAR_RECHEV: plate }), // ריקולים פתוחים
    queryDataGov("c8b9f9c8-...", { "MISPAR RECHEV": plate }), // תג נכה (שדה עם רווח!)
  ]);

// קריאה 7 — מפרט דגם (תלויה בתוצאה הראשונה)
const specs = await queryDataGov("142afde2-...", {
  tozeret_cd: main.tozeret_cd,
  degem_cd: main.degem_cd,
  sug_degem: main.sug_degem,
});

// חישוב "יד" — מספר בעלויות פרטיות (ללא סוחר/ליסינג)
const yad = ownership.filter((o) => o.baalut === "פרטי").length;

// לוגו יצרן — CDN
const logoUrl = `https://raw.githubusercontent.com/avto-dev/vehicle-logotypes/master/src/svg/${manufacturerSlug}.svg`;

// תמונת רכב — imagin.studio
const imageUrl = `https://cdn.imagin.studio/getimage?customer=mycarportal&make=${make}&modelFamily=${model}&modelYear=${year}&paintId=${colorCode}`;

// אם לא נמצא — בדוק inactive + decommissioned + personal import
```

---

## עמוד תוצאות חיפוש — עמוד יחיד (Single Page)

כל המידע מוצג בעמוד אחד עם גלילה, מחולק לסקשנים:

```
┌────────────────────────────────────────────────────┐
│  🖼️ [תמונת רכב — imagin.studio CGI]                │
│  🏷️ [לוגו יצרן]                                    │
│  Header: טויוטה COROLLA 2019                        │
│  יד: 3 (שלישית)                                     │
│  [⭐ מועדפים] [📤 שתף] [📄 PDF] [🚗 הוסף לרכבים שלי] │
├────────────────────────────────────────────────────┤
│                                                    │
│  ═══ פרטים כלליים ═══                               │
│  יצרן: טויוטה יפן          שנת ייצור: 2019         │
│  דגם מסחרי: COROLLA         צבע: לבן שנהב           │
│  סוג דלק: בנזין             רמת גימור: COMFORT      │
│  עלייה לכביש: 03/2019       שלדה: JTDKN3DU5A...     │
│  תג נכה: ❌ לא רשום                                 │
│                                                    │
│  ═══ מנוע ומפרט טכני ═══                            │
│  נפח מנוע: 1,798 סמ"ק      כוח: 140 כ"ס            │
│  הנעה: קדמית               תיבת הילוכים: אוטומטית   │
│  סוג מרכב: סדאן (merkav)    סוג ממיר: קטליטי         │
│  דלתות: 4                   מושבים: 5               │
│  משקל כולל: 1,745 ק"ג      כושר גרירה: 1,200 ק"ג   │
│                                                    │
│  ═══ בעלויות ═══                                    │
│  מספר בעלים: 3                                      │
│  ┌──────────────────────────────────┐              │
│  │ ● 03/2019  החכר (ליסינג)         │              │
│  │ ↓                                │              │
│  │ ● 12/2021  פרטי                  │              │
│  │ ↓                                │              │
│  │ ● 06/2023  סוחר (מעבר)           │              │
│  │ ↓                                │              │
│  │ ● 07/2023  פרטי ← בעלים נוכחי    │              │
│  └──────────────────────────────────┘              │
│  ⚠️ הרכב התחיל כליסינג                              │
│                                                    │
│  ═══ טסט וקילומטראז' ═══                            │
│  טסט אחרון: 15/01/2026       תוקף: 15/01/2027 ✅    │
│  ק"מ בטסט אחרון: 87,400     (ממוצע: 12,486/שנה ✅)  │
│  שינוי מבנה: לא ✅            שינוי צבע: לא ✅        │
│  וו גרירה: לא               שינוי צמיגים: לא        │
│                                                    │
│  ═══ ריקולים ═══                                    │
│  ✅ אין ריקולים פתוחים                               │
│  -- או --                                          │
│  ⚠️ ריקול פתוח: "בעיה בחגורת בטיחות" (נפתח: 2024)   │
│                                                    │
│  ═══ בטיחות ═══                                     │
│  ניקוד בטיחות: 82            כריות אוויר: 7          │
│  ABS: ✅  בקרת יציבות: ✅  בקרת סטייה: ✅             │
│  ניטור מרחק: ✅  זיהוי הולכי רגל: ✅  מצלמת רוורס: ✅ │
│  בלימת חירום: ✅  זיהוי שטח מת: ❌  שליטה באורות: ✅  │
│                                                    │
│  ═══ סביבה ופליטות ═══                              │
│  מדד ירוק: 8.5              קבוצת זיהום: 12         │
│  CO2: 120 g/km (WLTP)       NOX: 0.02 g/km         │
│                                                    │
│  ═══ צמיגים ═══                                     │
│  קדמי: 205/55R16            אחורי: 205/55R16        │
│  עומס קדמי: 91              מהירות: V               │
│                                                    │
│  ═══ קישורים שימושיים ═══                            │
│  🔗 בדיקת רכב גנוב — police.gov.il (קישור חיצוני)   │
│  🔗 אתר משרד התחבורה — gov.il                        │
│                                                    │
│  ⚠️ מידע שלא זמין: היסטוריית תאונות, קילומטראז'     │
│  מפורט, היסטוריית טסטים מלאה. מומלץ לבצע בדיקה     │
│  פיזית במכון מורשה.                                 │
└────────────────────────────────────────────────────┘
```

---

## מבנה בסיס הנתונים (Supabase / PostgreSQL)

```sql
-- ===== USERS =====
-- Supabase Auth מנהל את auth.users
-- הטבלה הזו מרחיבה עם נתוני פרופיל

profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text default 'free' check (plan in ('free', 'premium')),
  push_enabled boolean default false,
  created_at timestamptz default now()
)

-- ===== MY VEHICLES =====
vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  license_plate text not null,
  nickname text,                       -- כינוי: "הרכב של אמא"
  -- cache מה-API
  manufacturer text,                   -- tozeret_nm
  model text,                          -- kinuy_mishari
  year integer,                        -- shnat_yitzur
  color text,                          -- tzeva_rechev
  fuel_type text,                      -- sug_delek_nm
  ownership_type text,                 -- baalut
  last_test_date date,                 -- mivchan_acharon_dt
  test_expiry_date date,               -- tokef_dt
  km_at_last_test integer,             -- kilometer_test_aharon
  structural_change boolean,           -- shinui_mivne_ind
  color_changed boolean,               -- shnui_zeva_ind
  first_registration_date date,        -- rishum_rishon_dt
  owner_count integer,                 -- חישוב מ-ownership history
  has_open_recalls boolean,            -- מ-recalls dataset
  raw_gov_data jsonb,                  -- כל הנתונים הגולמיים
  -- נתונים שהמשתמש מזין
  insurance_expiry_date date,
  asking_price integer,                -- מחיר מבוקש (למכירה)
  sale_notes text,                     -- הערות למודעת מכירה
  sale_photo_path text,                -- תמונת רכב למכירה
  is_for_sale boolean default false,   -- האם מוצע למכירה
  last_synced_at timestamptz,
  added_at timestamptz default now(),
  unique(user_id, license_plate)
)

-- ===== SERVICE HISTORY =====
service_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  service_type text not null check (service_type in ('oil', 'tires', 'brakes', 'battery', 'ac', 'timing_belt', 'general', 'accident_repair', 'other')),
  title text not null,                  -- "החלפת שמן + פילטר"
  description text,                     -- פירוט חופשי
  garage_name text,                     -- שם מוסך
  cost integer,                         -- עלות בש"ח
  km_at_service integer,                -- ק"מ בזמן הטיפול
  service_date date not null,
  receipt_path text,                    -- קבלה ב-Supabase Storage
  created_at timestamptz default now()
)

-- ===== SEARCH HISTORY =====
search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,  -- nullable: גם אורחים שומרים ב-localStorage
  license_plate text not null,
  result_summary jsonb,                -- מינימום להצגה ברשימה
  searched_at timestamptz default now()
)

-- ===== FAVORITES =====
favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  license_plate text not null,
  cached_data jsonb,                   -- snapshot
  notes text,
  added_at timestamptz default now(),
  unique(user_id, license_plate)
)

-- ===== DOCUMENTS =====
documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  type text not null check (type in ('license', 'insurance', 'test', 'receipt', 'other')),
  name text not null,
  file_path text not null,             -- path ב-Supabase Storage
  file_size integer,
  uploaded_at timestamptz default now()
)

-- ===== REMINDERS =====
reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  vehicle_id uuid references vehicles(id) on delete cascade not null,
  type text not null check (type in ('test', 'insurance', 'custom')),
  title text,
  due_date date not null,
  notify_days_before integer default 30,
  notified_email boolean default false,
  notified_push boolean default false,
  created_at timestamptz default now()
)

-- ===== PUSH SUBSCRIPTIONS =====
push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  endpoint text not null unique,
  keys jsonb not null,                 -- { p256dh, auth }
  created_at timestamptz default now()
)
```

### RLS Policies (על כל הטבלאות)

```sql
-- דוגמה — אותו דפוס על כל הטבלאות
alter table vehicles enable row level security;

create policy "Users see own vehicles"
  on vehicles for select using (auth.uid() = user_id);

create policy "Users insert own vehicles"
  on vehicles for insert with check (auth.uid() = user_id);

create policy "Users update own vehicles"
  on vehicles for update using (auth.uid() = user_id);

create policy "Users delete own vehicles"
  on vehicles for delete using (auth.uid() = user_id);
```

### Supabase Storage Buckets

```
documents/
  └── {user_id}/
      └── {vehicle_id}/
          ├── license.pdf
          ├── insurance_2025.pdf
          └── test_receipt.jpg
```

Policy: `auth.uid()::text = (storage.foldername(name))[1]`

---

## מודל עסקי — Freemium

| פיצ'ר             | חינם           | פרמיום (₪9.90/חודש) |
| ----------------- | -------------- | ------------------- |
| חיפוש רכבים       | ✅ ללא הגבלה   | ✅ ללא הגבלה        |
| היסטוריית חיפושים | ✅ 20 אחרונים  | ✅ ללא הגבלה        |
| מועדפים           | ✅ עד 5        | ✅ ללא הגבלה        |
| ניהול רכבים       | 1 רכב          | עד 3 רכבים          |
| מסמכים            | עד 5 לרכב      | ✅ ללא הגבלה        |
| תזכורות           | ✅ אימייל      | ✅ אימייל           |
| הפקת PDF          | ❌             | ✅                  |
| ללא פרסומות       | ❌             | ✅                  |
| השוואת רכבים      | עד 2           | עד 4                |
| יצירת מודעת מכירה | ✅ בסיסי       | ✅ עם תמונות        |
| היסטוריית טיפולים | ✅ עד 10       | ✅ ללא הגבלה        |

**הערה:** בגרסה הנוכחית השדרוג ל-Premium הוא מיידי וללא תשלום אמיתי (מצב דמו) — לחיצה על "שדרג" הופכת את המשתמש ל-premium ופותחת את כל הפיצ'רים.

---

## מבנה תיקיות

```
mycarportal/
├── app/
│   ├── layout.tsx                  # Root layout — RTL, fonts, metadata
│   ├── page.tsx                    # Landing page + search bar
│   ├── manifest.ts                 # PWA manifest
│   ├── sw.ts                       # Service worker (Serwist)
│   ├── globals.css                 # Tailwind + custom styles
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── layout.tsx              # Auth layout (centered, minimal)
│   ├── (main)/
│   │   ├── layout.tsx              # Authenticated layout — navbar, sidebar
│   │   ├── dashboard/page.tsx      # "הרכבים שלי"
│   │   ├── vehicle/
│   │   │   └── [id]/page.tsx       # Vehicle detail — tabs
│   │   ├── favorites/page.tsx
│   │   ├── history/page.tsx
│   │   └── settings/page.tsx       # פרופיל, תשלום, push consent
│   ├── search/
│   │   └── [plate]/page.tsx        # *** עמוד תוצאות — single page ***
│   └── api/
│       ├── vehicle/
│       │   └── [plate]/route.ts    # Proxy ל-data.gov.il (5 קריאות מקבילות)
│       ├── reminders/
│       │   └── check/route.ts      # Vercel Cron — בודק תזכורות
│       ├── documents/
│       │   └── route.ts            # Upload/delete
│       ├── ocr/route.ts            # Codex Vision — לוחיות רישוי
│       └── webhooks/
│           └── payment/route.ts    # Paddle/Stripe webhook
├── components/
│   ├── ui/                         # shadcn/ui generated
│   ├── layout/
│   │   ├── navbar.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── add-to-homescreen.tsx   # PWA install banner
│   ├── search/
│   │   ├── search-input.tsx        # Input + camera button
│   │   ├── search-results.tsx      # Single page — all sections
│   │   ├── vehicle-header.tsx      # שם רכב + לוגו + תמונה + "יד"
│   │   ├── vehicle-image.tsx       # תמונת רכב מ-imagin.studio
│   │   ├── general-info.tsx        # פרטים כלליים + תג נכה
│   │   ├── specs-info.tsx          # מנוע ומפרט טכני
│   │   ├── ownership-timeline.tsx  # Timeline בעלויות
│   │   ├── test-km-section.tsx     # טסט + ק"מ
│   │   ├── recalls-section.tsx     # ריקולים
│   │   ├── safety-section.tsx      # בטיחות + ADAS
│   │   ├── environment-section.tsx # סביבה + פליטות
│   │   ├── tires-section.tsx       # צמיגים
│   │   └── useful-links.tsx         # קישורים: רכב גנוב, משרד התחבורה
│   ├── dashboard/
│   │   ├── vehicle-card.tsx
│   │   ├── reminder-alert.tsx
│   │   └── add-vehicle-dialog.tsx
│   ├── vehicle/
│   │   ├── service-history.tsx      # היסטוריית טיפולים
│   │   ├── add-service-dialog.tsx   # הוספת טיפול חדש
│   │   └── sale-ad-generator.tsx    # יצירת מודעת מכירה
│   ├── favorites/
│   │   ├── favorite-card.tsx
│   │   └── comparison-table.tsx
│   └── shared/
│       ├── loading-skeleton.tsx
│       ├── error-message.tsx
│       └── empty-state.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # createBrowserClient
│   │   ├── server.ts               # createServerClient
│   │   └── middleware.ts            # Auth middleware
│   ├── api/
│   │   ├── data-gov.ts             # data.gov.il wrapper + types
│   │   ├── data-gov-resources.ts   # Resource IDs + field mappings
│   │   └── vehicle-aggregator.ts   # Combines all API calls
│   ├── yad-calculator.ts           # חישוב "יד" מהיסטוריית בעלויות
│   ├── manufacturer-logos.ts       # מיפוי שם יצרן → slug ל-CDN
│   ├── car-image.ts                # imagin.studio URL builder
│   ├── validators.ts               # License plate validation etc.
│   ├── formatters.ts               # Date, number, Hebrew formatting
│   ├── types.ts                    # TypeScript interfaces
│   └── utils.ts                    # General utilities
├── hooks/
│   ├── use-vehicle-search.ts
│   ├── use-favorites.ts
│   └── use-reminders.ts
├── public/
│   ├── icons/                      # PWA icons (192, 512)
│   ├── screenshots/                # PWA screenshots
│   └── sw.js                       # Generated by Serwist
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── .env.local
├── AGENTS.md                       # THIS FILE
├── FEATURES.md                     # Feature documentation
├── next.config.ts
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

---

## עמודים

| עמוד               | נתיב              | גישה       | תיאור                            |
| ------------------ | ----------------- | ---------- | -------------------------------- |
| Landing            | `/`               | Public     | Hero + Search Box + CTA          |
| Login              | `/login`          | Public     | Email/password + Google          |
| Register           | `/register`       | Public     | שם + email + password            |
| **Search Results** | `/search/[plate]` | **Public** | **עמוד יחיד עם כל המידע**        |
| Dashboard          | `/dashboard`      | Protected  | רשימת רכבים + alerts             |
| Vehicle Detail     | `/vehicle/[id]`   | Protected  | פרטי רכב אישי + מסמכים + תזכורות |
| Favorites          | `/favorites`      | Protected  | רשימה + השוואה                   |
| History            | `/history`        | Protected  | חיפושים אחרונים                  |
| Settings           | `/settings`       | Protected  | פרופיל, תשלום, push consent      |

**הערה:** חיפוש פתוח לכולם. שמירה למועדפים / הוספה לרכבים שלי דורשת הרשמה.

---

## PWA — אסטרטגיה

- **Serwist** (`@serwist/next`) לניהול Service Worker
- `app/manifest.ts` — manifest דינמי
- Cache strategy: **Network First** לנתוני API, **Cache First** לאסטים סטטיים
- בנר "הוסף למסך הבית" מותאם (אין prompt מובנה ב-iOS)
- Storage limit 50MB ב-iOS — נגביל גודל מסמכים

---

## אבטחה

1. **RLS** על כל טבלה — `auth.uid() = user_id`
2. **API Routes כ-proxy** — הקליינט לא פונה ישירות ל-data.gov.il
3. **Rate limiting** על API Routes (Vercel Edge Middleware)
4. **Input validation** — מספר רישוי: `^\d{5,8}$`
5. **Supabase Storage policies** — כל משתמש גישה רק לתיקייה שלו
6. **CSP headers** ב-next.config.ts
7. **סודות** תמיד ב-`.env.local`

---

## סדר פיתוח — לפי 10 שלבי הקורס

### שלב 1: Ideation — הגדרת הבעיה והקונספט ✅

- [x] הגדרת שתי בעיות: קונה רכב יד שנייה + בעל רכב קיים
- [x] הגדרת שני פרסונות: דנה (קונה) + יצחק (בעל רכב)
- [x] הגדרת הפתרון: חיפוש + ניהול בפלטפורמה אחת
- [x] מודל עסקי: Freemium (₪9.90/חודש)

### שלב 2: Research & Requirements — מחקר ודרישות ✅

- [x] מחקר data.gov.il API — 14 datasets (כולל תג נכה), שדות, מגבלות
- [x] מחקר מתחרים (Car2Check, AutoDB) — עמוד יחיד, לא tabs
- [x] מחקר טכנולוגי: next-pwa מת → Serwist, shadcn RTL מובנה
- [x] הגדרת פיצ'רים: Must / Should / Could / Won't
- [x] מגבלות iOS PWA: 50MB cache, push רק מ-Home Screen

### שלב 3: System Design — ארכיטקטורת המערכת ✅

- [x] ארכיטקטורה: Next.js 15 App Router + Supabase + Vercel
- [x] תרשים מערכת: Client → API Routes → data.gov.il / Supabase (ראה SYSTEM-DESIGN.md)
- [x] אסטרטגיית API: 6 קריאות מקבילות + קריאה 7 תלויה
- [x] אסטרטגיית Cache: Network First ל-API, Cache First לאסטים
- [x] אבטחה: RLS, proxy, rate limiting, CSP
- [x] מבנה תיקיות ו-routing
- [x] Sequence Diagrams: חיפוש רכב, תזכורת טסט, רכישת פרמיום (ראה SYSTEM-DESIGN.md)

### שלב 4: Wireframe — שרטוט מסכים

- [ ] Landing page wireframe (Hero + Search)
- [ ] עמוד תוצאות חיפוש — single page עם 9 סקשנים
- [ ] דשבורד "הרכבים שלי"
- [ ] עמוד רכב אישי (tabs: כללי, טיפולים, מסמכים, תזכורות)
- [ ] מועדפים + השוואה
- [ ] יצירת מודעת מכירה
- [ ] Auth pages (login / register)
- [ ] Settings page
- [ ] User flows: חיפוש, הוספת רכב, יצירת מודעה, הוספת טיפול

### שלב 5: Design — עיצוב ויזואלי

- [ ] זהות ויזואלית: צבעים, פונטים (Heebo), לוגו
- [ ] עיצוב RTL מלא עם Tailwind logical properties
- [ ] shadcn/ui theme מותאם
- [ ] Dark/Light mode (אופציונלי)
- [ ] Mobile-first responsive design

### שלב 6: Frontend Development — פיתוח צד לקוח

- [ ] Next.js 15 + TypeScript + Tailwind v4 + shadcn/ui --rtl
- [ ] Layout: Navbar, Footer, Mobile Nav, RTL
- [ ] Landing page + Search Input
- [ ] **עמוד תוצאות — single page עם כל הסקשנים**
- [ ] Ownership Timeline component
- [ ] Safety/ADAS grid component
- [ ] Dashboard "הרכבים שלי" + Vehicle Cards
- [ ] Vehicle Detail page עם tabs
- [ ] **היסטוריית טיפולים** — Timeline + Add Service dialog
- [ ] **מודעת מכירה** — יצירת טקסט אוטומטי + תמונה + העתקה
- [ ] Favorites + Comparison table
- [ ] History page
- [ ] Settings page
- [ ] Loading skeletons + Error states בעברית
- [ ] PWA: Serwist + manifest + Add to Home Screen banner

### שלב 7: Data Design — תכנון בסיס נתונים

- [ ] ERD diagram: profiles, vehicles, service_records, search_history, favorites, documents, reminders, push_subscriptions
- [ ] Supabase project setup
- [ ] Migration: `001_initial_schema.sql`
- [ ] RLS Policies על כל הטבלאות
- [ ] Supabase Storage buckets + policies
- [ ] Indexes: license_plate, user_id, vehicle_id

### שלב 8: Backend Development — פיתוח צד שרת

- [ ] API Route: `/api/vehicle/[plate]` — proxy ל-data.gov.il (6+1 קריאות)
- [ ] `lib/api/data-gov.ts` — wrapper עם TypeScript types
- [ ] `lib/ad-generator.ts` — יצירת טקסט מודעה אוטומטית
- [ ] Auth: Supabase Auth (email + Google)
- [ ] CRUD: vehicles, service_records, favorites, documents, reminders
- [ ] Upload: Supabase Storage לתמונות ומסמכים
- [ ] Notifications: Resend email
- [ ] Cron: `/api/reminders/check` — Vercel Cron יומי
- [ ] OCR: Codex Haiku Vision API
- [ ] Payments: Paddle/Stripe webhook

### שלב 9: Deploy — פריסה

- [ ] Vercel deployment + environment variables
- [ ] Custom domain (אופציונלי)
- [ ] Supabase production project
- [ ] PWA testing on iPhone
- [ ] Performance: LCP < 2.5s, CLS < 0.1

### שלב 10: Test & Iterate — בדיקות ושיפור

- [ ] בדיקות ידניות על כל flow
- [ ] בדיקות responsive (mobile, tablet, desktop)
- [ ] בדיקות PWA: offline, push, install
- [ ] Bug fixes
- [ ] Could Have features (הערכת מחיר, גרף הוצאות, מוסכים/סוחרים/תחנות דלק)
- [ ] הכנת מצגת הגשה

---

## Coding Conventions

- **שמות קבצים:** kebab-case (`vehicle-card.tsx`)
- **שמות רכיבים:** PascalCase (`VehicleCard`)
- **Server Components** כברירת מחדל, Client רק כשצריך אינטראקטיביות
- **API calls** — רק מ-API Routes, לא מהקליינט
- **סודות** ב-`.env.local` בלבד
- **שגיאות** עם try/catch, הודעות למשתמש בעברית
- **TypeScript strict** — אין `any`
- **Tailwind logical properties** — `ms-`, `me-`, `ps-`, `pe-`, `start-`, `end-`

---

## משאבים חיצוניים

| שירות         | מה צריך                                                      | מתי     |
| ------------- | ------------------------------------------------------------ | ------- |
| Supabase      | SUPABASE_URL + SUPABASE_ANON_KEY + SUPABASE_SERVICE_ROLE_KEY | שבוע 1  |
| Vercel        | חשבון לפריסה                                                 | שבוע 1  |
| Anthropic API | ANTHROPIC_API_KEY (Codex Haiku)                             | שבוע 11 |
| Resend        | RESEND_API_KEY                                               | שבוע 9  |
| Paddle/Stripe | API keys                                                     | שבוע 13 |
| Google OAuth  | Client ID + Secret (ב-Supabase)                              | שבוע 1  |
| imagin.studio | Customer key (חינמי: 400px+watermark)                        | שבוע 6  |
