# MyCarPortal — מדריך Deploy

## כתובות

| סביבה | URL |
|-------|-----|
| **Production** | https://frontend-mycarportal.vercel.app |
| **Vercel Dashboard** | https://vercel.com/mycarportal/frontend |
| **Supabase Dashboard** | https://supabase.com/dashboard/project/axrdctnnwnohlwqmvkln |

---

## תשתית

| רכיב | פרטים |
|------|--------|
| Hosting | Vercel (Free Tier) — Team: mycarportal |
| Database | Supabase PostgreSQL — Project ID: `axrdctnnwnohlwqmvkln`, Region: eu-west-1 |
| Framework | Next.js 16.2.4 (Turbopack) |

---

## Environment Variables

מוגדרים ב-Vercel Dashboard (Production):

| משתנה | חובה? | שימוש |
|-------|-------|--------|
| `NEXT_PUBLIC_SUPABASE_URL` | ✅ | חיבור Supabase |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | חיבור Supabase (client) |
| `GOOGLE_CLIENT_ID` / `GOOGLE_CLIENT_SECRET` | ✅ | OAuth (מוגדרים גם ב-Supabase) |
| `SUPABASE_SERVICE_ROLE_KEY` | לתזכורות | cron קורא תזכורות חוצות-משתמשים + אימיילים |
| `RESEND_API_KEY` | לתזכורות | שליחת אימייל (Resend) |
| `RESEND_FROM` | אופציונלי | כתובת שולח (ברירת מחדל onboarding@resend.dev) |
| `CRON_SECRET` | מומלץ | הקשחת `/api/reminders/check` |

לפיתוח מקומי — הקובץ `.env.local` בתיקיית `frontend/` (לא מועלה ל-git).

> ⚠️ ללא `SUPABASE_SERVICE_ROLE_KEY` + `RESEND_API_KEY` — ה-UI של תזכורות עובד אבל אימיילים לא נשלחים (ה-cron מדלג בחן).
> Resend חינמי שולח רק לאימייל שאיתו נרשמת עד שמאמתים דומיין.

---

## איך לעשות deploy חדש

```bash
cd frontend
npx vercel --prod --scope mycarportal
```

---

## Supabase — Migrations שהוחלו

| קובץ | תוכן |
|------|------|
| `001_initial_schema` | יצירת 8 טבלאות: profiles, vehicles, service_records, documents, reminders, favorites, search_history, push_subscriptions |
| `002_rls_policies` | RLS על כל הטבלאות — `auth.uid() = user_id` |
| `003_indexes_and_trigger` | 13 אינדקסים + trigger ליצירת profile אוטומטי בהרשמה |
| `fix_handle_new_user_search_path` | תיקון trigger (SET search_path=public) — תיקן שגיאת הרשמה |
| `create_documents_storage_bucket` | bucket `documents` + storage RLS policies |
| `add_insurance_cost_to_vehicles` | עמודת `insurance_cost` |

---

## הגדרות שצריך לעשות ידנית

### Google OAuth (Supabase)
1. כנס ל-[Supabase Dashboard → Authentication → Providers](https://supabase.com/dashboard/project/axrdctnnwnohlwqmvkln/auth/providers)
2. הפעל Google
3. הוסף Client ID + Client Secret מ-Google Cloud Console
4. Redirect URL: `https://axrdctnnwnohlwqmvkln.supabase.co/auth/v1/callback`

### Storage Buckets (Supabase)
✅ נוצר אוטומטית במיגרציה `create_documents_storage_bucket` (bucket פרטי `documents` + policies).

### Deployment Protection
ודא ש-**Vercel → Settings → Deployment Protection → Vercel Authentication = Disabled**, אחרת האתר חסום לציבור (HTTP 401).

---

## ארכיטקטורת Deploy

```
User Browser
     │
     ▼
 Vercel CDN (Edge Network)
     │
     ├── Static assets (.js, .css, images) ← Cached at CDN
     │
     └── Next.js Server (Node.js)
              │
              ├── /api/vehicle/[plate] ──► data.gov.il (CKAN API)
              │
              └── /dashboard, /favorites, /history ──► Supabase (PostgreSQL + Auth)
```

---

## בדיקת תקינות לאחר Deploy

1. פתח https://frontend-mycarportal.vercel.app
2. חפש מספר רישוי: `1234567` (לדוגמה)
3. וודא שהתוצאות מגיעות מ-data.gov.il
4. נסה להירשם — וודא שנוצר משתמש ב-Supabase
