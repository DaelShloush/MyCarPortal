# MyCarPortal — יומן התקדמות

## שלב 1: Ideation ✅
- הגדרת בעיה: רוכשי רכב יד שנייה + בעלי רכב קיים
- פרסונות: דנה (קונה), יצחק (בעל רכב)
- מודל עסקי: Freemium ₪9.90/חודש

## שלב 2: Research & Requirements ✅
- מחקר data.gov.il — 14 datasets
- מחקר מתחרים (Car2Check, AutoDB)
- הגדרת פיצ'רים Must/Should/Could/Won't

## שלב 3: System Design ✅
- ארכיטקטורה: Next.js 16 + Supabase + Vercel
- Sequence Diagrams (ראה docs/SYSTEM-DESIGN.md)
- אסטרטגיית API: 6 קריאות מקבילות + קריאה 7 תלויה

## שלב 4: Wireframe ✅
- עמוד נחיתה + חיפוש
- עמוד תוצאות — single page עם 9 סקשנים
- דשבורד, מועדפים, היסטוריה, Auth

## שלב 5: Design ✅
- עיצוב RTL עם Tailwind logical properties
- מערכת צבעים סמנטית (ירוק/צהוב/אדום) לסטטוסים והתראות
- Mobile-first responsive

## שלב 6: Frontend Development ✅
- Next.js 16.2.4 + TypeScript + Tailwind v4 + shadcn/ui RTL
- עמוד תוצאות מלא (9 סקשנים): פרטים כלליים, מנוע, בעלויות, טסט, ריקולים, בטיחות, סביבה, צמיגים, קישורים
- Ownership Timeline + Safety Grid
- Dashboard, Favorites, History, Login, Register pages

## שלב 7: Data Design ✅
- 8 טבלאות: profiles, vehicles, service_records, documents, reminders, favorites, search_history, push_subscriptions
- RLS על כל הטבלאות
- 13 indexes + trigger אוטומטי ליצירת profile

## שלב 8: Backend Development ✅
- API Route: `/api/vehicle/[plate]` — proxy ל-data.gov.il (7 קריאות מקבילות + 2 תלויות)
- Auth מלא: email/password + Google OAuth + איפוס סיסמה
- CRUD: favorites, search_history, vehicles, service_records, reminders, documents
- Storage: bucket `documents` פרטי + RLS; העלאה/צפייה/מחיקה
- תזכורות: יצירה/מחיקה + Vercel Cron יומי (`/api/reminders/check`) + אימייל (Resend)
- מנועי הערכה: שווי משוער, TCO (אגרה + דלק), מחירון רשמי
- מחולל מודעת מכירה (`lib/ad-generator.ts`)
- עריכת פרטי ביטוח ידנית (תאריך + עלות)
- נתונים: VIN, יבוא אישי, אזהרת רכב מבוטל, ADAS מלא, פליטות WLTP

## שלב 9: Deploy ✅
- Vercel: https://frontend-mycarportal.vercel.app (Deployment Protection כבוי — ציבורי)
- Supabase production (eu-west-1)
- Environment variables: Supabase (anon + service_role), Google OAuth, Resend
- Google OAuth מוגדר ב-Supabase

## שלב 10: Test & Iterate — בתהליך
- [x] בדיקות עשן על כל ה-routes (כולם 200)
- [x] build + eslint נקיים
- [x] תיקוני באגים: מיפוי שדות מפרט, הבהוב auth, היסטוריית חיפושים, OAuth redirect, תאריכי טסט
- [ ] בדיקות responsive ידניות מקיפות
- [ ] הגדרת CRON_SECRET (הקשחה)
- [ ] אימות דומיין ב-Resend (לשליחה לכל המשתמשים)
- [ ] הכנת מצגת הגשה

### באגים פוטנציאליים ידועים (לא חוסמים)
- תזכורת חוזרת שנתית: `notified_email` לא מתאפס — נשלחת פעם אחת בלבד
- עמוד השוואה ל-4 רכבים: ~5 שניות (36 קריאות ל-data.gov.il) — קרוב לגבול timeout
- `/api/reminders/check` ללא `CRON_SECRET` — ניתן לקריאה חיצונית (השפעה נמוכה — `notified_email` מונע שליחה כפולה)
