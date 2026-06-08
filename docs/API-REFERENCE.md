# MyCarPortal — תיעוד API

## API Routes (Next.js)

### GET `/api/vehicle/[plate]`

שולף את כל נתוני הרכב לפי מספר רישוי.

**פרמטרים:**
- `plate` — מספר רישוי (5–8 ספרות בלבד, regex: `^\d{5,8}$`)

**תגובה מוצלחת (200):**
```json
{
  "vehicle": {
    "id": "1234567",
    "plate": "1234567",
    "manufacturer": "טויוטה",
    "model": "COROLLA",
    "year": 2019,
    "color": "לבן שנהב",
    "fuelType": "בנזין",
    "yad": 2,
    "owners": [...],
    "recalls": [...],
    "safety": {...}
  },
  "source": "active"
}
```

**תגובות שגיאה:**
- `400` — מספר רישוי לא תקין
- `404` — רכב לא נמצא

**Cache:** `Cache-Control: public, s-maxage=3600` (שעה)

---

## data.gov.il — Resources בשימוש

Base URL: `https://data.gov.il/api/3/action/datastore_search`

| # | שם | Resource ID | שדות עיקריים |
|---|-----|-------------|--------------|
| 1 | רכבים פעילים | `053cea08-09bc-40ec-8f7a-156f0677aff3` | mispar_rechev, tozeret_nm, kinuy_mishari, shnat_yitzur, tzeva_rechev, tokef_dt |
| 2 | נתונים נוספים | `0866573c-40cd-4ca8-91d2-9dd2d7a492e5` | merkav, mishkal_kolel, gorrar |
| 3 | היסטוריית בעלויות | `bb2355dc-9ec7-4f06-9c3f-3344672171da` | baalut_dt, baalut |
| 4 | היסטוריה טכנית | `56063a99-8a3e-4ff4-912e-5966c0279bad` | kilometer_test_aharon, shinui_mivne_ind |
| 5 | מפרט דגמים | `142afde2-6228-49f9-8a29-9b6c3a0cbe40` | koah_sus, nefah_manoa, nikud_betihut |
| 6 | ריקולים | `36bf1404-0be4-49d2-82dc-2f1ead4a8b93` | TEUR_TAKALA, TAARICH_PTICHA |
| 7 | תג נכה | `c8b9f9c8-4612-4068-934f-d4acd2e3c06e` | SUG_TAG (שדה עם רווח!) |
| 8 | רכבים לא פעילים | `f6efe89a-fb3d-43a4-bb61-9bf12a9b9099` | fallback → status=inactive |
| 9 | גריטה / ביטול סופי | `851ecab1-0622-4dbe-a6c7-f950cf82abf9` | fallback → status=decommissioned (אזהרה) |
| 10 | יבוא אישי | `03adc637-b6fe-402b-9937-7c3d3afc9140` | mispar_rechev, sug_yevu |
| 11 | מחירון רשמי | `39f455bf-6db0-4926-859d-017f34eacbcb` | mehir (מחיר חדש בשנת ייצור) |

**אסטרטגיית קריאות:** 7 קריאות מקבילות (`Promise.all`) + 2 תלויות במקביל (מפרט דגם + מחירון).
⚠️ שמות שדות אמיתיים במפרט (142afde2): `mispar_dlatot`, `abs_ind`, `bakarat_yatzivut_ind`, `CO2_WLTP`, `kvuzat_agra_cd`, `ramat_eivzur_betihuty` (לא ניחושים כמו dlatot/abs/co2).

---

## Supabase — טבלאות ו-CRUD

| טבלה | CREATE | READ | UPDATE | DELETE |
|------|--------|------|--------|--------|
| `profiles` | trigger אוטומטי בהרשמה | ✅ | ✅ (שם) | — |
| `vehicles` | ✅ (חיפוש→הוסף) | ✅ | ✅ (רענון, ביטוח) | — |
| `favorites` | ✅ (toggle) | ✅ | — | ✅ |
| `search_history` | ✅ (אוטומטי + dedup) | ✅ | — | — |
| `reminders` | ✅ | ✅ | (cron→notified) | ✅ |
| `documents` | ✅ (Storage) | ✅ | — | ✅ |

**Storage:** bucket `documents` (פרטי, 10MB, jpg/png/webp/pdf) — path `{user_id}/{vehicle_id}/{ts}.{ext}`, RLS לפי תיקיית user.

---

## Server Actions

| Action | קובץ | תיאור |
|--------|------|--------|
| `loginAction` / `registerAction` / `logoutAction` | `app/(auth)/actions.ts` | אימות email/password |
| `googleLoginAction` | `app/(auth)/actions.ts` | OAuth (origin מ-headers) |
| `forgotPasswordAction` / `resetPasswordAction` | `app/(auth)/actions.ts` | איפוס סיסמה |
| `toggleFavoriteAction` / `isFavoriteAction` | `app/actions/favorites.ts` | מועדפים |
| `addVehicleAction` / `refreshVehicleAction` / `updateInsuranceAction` | `app/actions/vehicle.ts` | ניהול רכב |
| `recordSearchHistory` | `app/actions/search-history.ts` | היסטוריה (מחובר) |
| `addServiceRecordAction` | `app/actions/service.ts` | טיפול |
| `createReminderAction` / `deleteReminderAction` | `app/actions/reminder.ts` | תזכורות |
| `updateProfileAction` | `app/actions/profile.ts` | פרופיל |

## Route Handlers

| Endpoint | קובץ | תיאור |
|----------|------|--------|
| GET `/api/vehicle/[plate]` | `app/api/vehicle/[plate]/route.ts` | נתוני רכב (JSON) |
| GET `/auth/callback` | `app/auth/callback/route.ts` | OAuth + recovery token |
| GET `/api/reminders/check` | `app/api/reminders/check/route.ts` | Vercel Cron יומי — שליחת אימייל (דורש service_role + Resend; מאובטח ב-CRON_SECRET) |
