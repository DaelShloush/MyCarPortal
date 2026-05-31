# MyCarPortal — System Design (שלב 3)

---

## רכיבי המערכת ואחריותם

| רכיב | טכנולוגיה | תפקיד באפליקציה |
|---|---|---|
| **Client** | Next.js 15 (Browser / PWA) | מציג תוצאות חיפוש, דשבורד, טפסים. שולח בקשות לשרת. עובד אופליין עם Service Worker. |
| **Server** | Next.js API Routes (Vercel) | Proxy לכל קריאות ה-API החיצוניות, חישוב ציון סיכון, לוגיקה עסקית, אימות בקשות. |
| **Database** | Supabase PostgreSQL + RLS | שמירת פרופילים, רכבים, תזכורות, מועדפים, היסטוריית טיפולים, מסמכים. RLS מגן שכל משתמש רואה רק את הנתונים שלו. |
| **Authentication** | Supabase Auth | הרשמה/התחברות (email + Google). מנפיק JWT token שמצורף לכל בקשה. |
| **File Storage** | Supabase Storage | אחסון מסמכי רכב (רישיון, ביטוח, קבלות). גישה מוגנת לפי user_id. |
| **CDN** | Vercel Edge + imagin.studio + avto-dev | Vercel מגיש assets סטטיים. imagin.studio מגיש תמונות CGI של רכבים. avto-dev מגיש לוגו יצרנים (SVG). |
| **Cache** | Serwist (Service Worker) | Network First לנתוני API (TTL שעה), Cache First לאסטים סטטיים (TTL 30 יום). |
| **Third-Party: data.gov.il** | CKAN REST API | 6+1 קריאות מקבילות לכל חיפוש — פרטי רכב, היסטוריית בעלויות, ק"מ, ריקולים, תג נכה, מפרט דגם. |
| **Third-Party: Claude Haiku** | Anthropic Vision API | OCR לזיהוי לוחית רישוי מצילום. |
| **Third-Party: Stripe** | Payments API + Webhooks | עיבוד תשלומים לפרמיום. Webhook מודיע לשרת כשתשלום הצליח. |
| **Notifications** | Resend (email) + web-push | Resend שולח מיילי תזכורת. web-push + VAPID שולח Push למשתמשי פרמיום. |
| **Scheduler** | Vercel Cron | מפעיל בדיקת תזכורות כל יום ב-08:00. |

---

## Architecture Diagram

```mermaid
graph TD
    Client["🖥️ Client<br/><i>Next.js PWA<br/>Browser / Mobile</i>"]
    SW["⚡ Service Worker<br/><i>Serwist Cache</i>"]
    Server["⚙️ Server<br/><i>Next.js API Routes<br/>on Vercel</i>"]
    Auth["🔐 Supabase Auth<br/><i>Email + Google OAuth<br/>JWT Tokens</i>"]
    DB["🗄️ Supabase DB<br/><i>PostgreSQL + RLS<br/>vehicles, reminders,<br/>favorites, documents</i>"]
    Storage["📁 Supabase Storage<br/><i>מסמכי רכב<br/>תמונות מכירה</i>"]
    CDN["🌐 CDN<br/><i>Vercel Edge<br/>imagin.studio<br/>avto-dev logos</i>"]
    DataGov["🏛️ data.gov.il<br/><i>14 מסדי נתונים<br/>ממשלתיים</i>"]
    ClaudeAPI["🤖 Claude Haiku<br/><i>Vision API<br/>OCR לוחית רישוי</i>"]
    Stripe["💳 Stripe<br/><i>תשלומי פרמיום</i>"]
    Resend["📧 Resend<br/><i>מיילי תזכורת</i>"]
    WebPush["🔔 Web Push<br/><i>Push Notifications<br/>פרמיום בלבד</i>"]
    Cron["⏰ Vercel Cron<br/><i>08:00 כל יום</i>"]

    Client <-->|"HTTPS / API"| Server
    Client <-->|"Cache"| SW
    Client -->|"Login / Register"| Auth
    Auth -->|"JWT Token"| Client
    Server -->|"Read / Write"| DB
    Server -->|"Upload / Download"| Storage
    Storage -->|"CDN URLs"| CDN
    CDN -->|"Static Assets"| Client
    Server -->|"6+1 Parallel Calls"| DataGov
    Server -->|"OCR Request"| ClaudeAPI
    Server -->|"Checkout Session"| Stripe
    Stripe -->|"Webhook: payment_succeeded"| Server
    Cron -->|"Trigger Daily"| Server
    Server -->|"Send Email"| Resend
    Server -->|"Send Push"| WebPush
    Resend -->|"Email"| Client
    WebPush -->|"Push Alert"| Client

    style Client fill:#dbeafe,stroke:#2563eb,stroke-width:2px,color:#1e3a5f
    style SW fill:#e0f2fe,stroke:#0284c7,stroke-width:2px,color:#0c4a6e
    style Server fill:#fef3c7,stroke:#d97706,stroke-width:2px,color:#78350f
    style Auth fill:#fce7f3,stroke:#db2777,stroke-width:2px,color:#831843
    style DB fill:#d1fae5,stroke:#059669,stroke-width:2px,color:#064e3b
    style Storage fill:#fde68a,stroke:#ca8a04,stroke-width:2px,color:#713f12
    style CDN fill:#e0e7ff,stroke:#6366f1,stroke-width:2px,color:#312e81
    style DataGov fill:#dcfce7,stroke:#16a34a,stroke-width:2px,color:#14532d
    style ClaudeAPI fill:#f3e8ff,stroke:#9333ea,stroke-width:2px,color:#581c87
    style Stripe fill:#e9d5ff,stroke:#7c3aed,stroke-width:2px,color:#4c1d95
    style Resend fill:#fed7aa,stroke:#ea580c,stroke-width:2px,color:#7c2d12
    style WebPush fill:#fee2e2,stroke:#dc2626,stroke-width:2px,color:#7f1d1d
    style Cron fill:#f0fdf4,stroke:#15803d,stroke-width:2px,color:#14532d
```

---

## Flow 1: חיפוש רכב לפי מספר רישוי

### שלבי הזרימה

1. **הקלדה + ולידציה** — המשתמש מקליד מספר רישוי. ה-Client בודק פורמט (`^\d{5,8}$`) ומציג Loading skeleton.
2. **בקשה לשרת** — Client שולח `GET /api/vehicle/[plate]`. השרת הוא Proxy — ה-Client לא מדבר ישירות עם data.gov.il.
3. **6 קריאות מקבילות** — השרת שולח `Promise.all` עם 6 בקשות בו-זמנית ל-data.gov.il: פרטי רכב ראשי, Extended (מרכב/צמיגים), היסטורית בעלויות, היסטוריה טכנית (ק"מ/שינויים), ריקולים פתוחים, תג נכה.
4. **קריאה 7 תלויה** — לאחר תוצאה מקריאה 1, השרת שולח קריאה נוספת למפרט הדגם (לפי `tozeret_cd` + `degem_cd`).
5. **עיבוד ב-Server** — חישוב ציון סיכון (8 פרמטרים), חישוב "יד", בניית URL לתמונה (imagin.studio) ולוגו (avto-dev).
6. **תגובה ל-Client** — השרת מחזיר JSON מאוחד. Client מרנדר עמוד אחד עם כל הסקשנים.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User as 👤 משתמש
    participant Client as 🖥️ Client
    participant Server as ⚙️ Server
    participant DataGov as 🏛️ data.gov.il
    participant CDN as 🌐 CDN

    User->>Client: מקליד מספר רישוי
    Client->>Client: ולידציה (5-8 ספרות)
    Client->>Server: GET /api/vehicle/1234567

    par 6 קריאות מקבילות
        Server->>DataGov: פרטי רכב ראשי (053cea08)
        Server->>DataGov: Extended - מרכב, צמיגים (0866573c)
        Server->>DataGov: היסטוריית בעלויות (bb2355dc)
        Server->>DataGov: היסטוריה טכנית - ק"מ (56063a99)
        Server->>DataGov: ריקולים פתוחים (36bf1404)
        Server->>DataGov: תג נכה (c8b9f9c8)
    end

    DataGov-->>Server: תוצאות כל הקריאות

    Server->>DataGov: מפרט דגם (142afde2) — לפי tozeret_cd + degem_cd
    DataGov-->>Server: מפרט מלא (90 שדות)

    Server->>Server: חישוב ציון סיכון (8 פרמטרים)
    Server->>Server: חישוב "יד" מהיסטוריית בעלויות
    Server->>Server: בניית URL לתמונה + לוגו

    Server-->>Client: JSON מאוחד — כל הנתונים + ציון סיכון

    Client->>CDN: טעינת תמונת CGI (imagin.studio)
    Client->>CDN: טעינת לוגו יצרן (avto-dev)
    CDN-->>Client: תמונה + לוגו

    Client->>User: עמוד תוצאות מלא (single page)
```

---

## Flow 2: תזכורת טסט אוטומטית

### שלבי הזרימה

1. **Cron מופעל** — Vercel Cron מפעיל בכל יום ב-08:00 בקשה ל-`/api/reminders/check`.
2. **שליפת תזכורות** — השרת שואל את Supabase DB: "אילו תזכורות לא נשלחו עדיין, ו-`due_date` שלהן הוא בין היום ל-30 יום מעכשיו?"
3. **לכל תזכורת — שליחת אימייל** — השרת קורא ל-Resend API עם פרטי התזכורת. זמין לכל המשתמשים (חינם + פרמיום).
4. **לפרמיום — שליחת Push** — השרת בודק אם למשתמש יש `push_subscription` ב-DB. אם כן — שולח Push Notification דרך web-push + VAPID.
5. **עדכון DB** — השרת מסמן את התזכורת כ-`notified_email = true` / `notified_push = true` כדי לא לשלוח שוב.
6. **הודעה מגיעה** — המשתמש מקבל מייל / Push עם "הטסט של הרכב שלך פג בעוד 30 יום".

### Sequence Diagram

```mermaid
sequenceDiagram
    participant Cron as ⏰ Vercel Cron
    participant Server as ⚙️ Server
    participant DB as 🗄️ Supabase DB
    participant Resend as 📧 Resend
    participant Push as 🔔 Web Push
    actor User as 👤 משתמש

    Cron->>Server: POST /api/reminders/check (08:00 בוקר)

    Server->>DB: שאילתה — תזכורות לא נשלחו עם due_date ≤ 30 יום
    DB-->>Server: רשימת תזכורות ממתינות

    loop לכל תזכורת
        Server->>Resend: שלח מייל — "הטסט פג בעוד X ימים"
        Resend-->>User: 📧 מייל תזכורת

        alt משתמש פרמיום + push_subscription קיים
            Server->>DB: שלוף push_subscription endpoint + keys
            DB-->>Server: { endpoint, p256dh, auth }
            Server->>Push: שלח Web Push Notification
            Push-->>User: 🔔 התראה על המסך
        end

        Server->>DB: עדכן notified_email=true / notified_push=true
    end

    Server-->>Cron: 200 OK — X תזכורות נשלחו
```

---

## Flow 3: רכישת מנוי פרמיום

### שלבי הזרימה

1. **לחיצה על "שדרג לפרמיום"** — Client שולח בקשה לשרת ליצור Checkout Session.
2. **יצירת Session ב-Stripe** — השרת יוצר session עם פרטי התוכנית (₪9.90/חודש) ו-`user_id` כ-metadata.
3. **הפניה ל-Stripe** — השרת מחזיר URL. Client מפנה המשתמש לדף תשלום של Stripe.
4. **השלמת תשלום** — המשתמש מכניס פרטי אשראי ישירות לדף Stripe (פרטי הכרטיס לא עוברים דרך השרת שלנו).
5. **Webhook מ-Stripe** — Stripe שולח HTTP POST ל-`/api/webhooks/payment` עם אירוע `payment_succeeded`.
6. **אימות + עדכון** — השרת מאמת חתימת Webhook (להגנה מזיופים), ואז מעדכן את `profiles.plan = 'premium'` ב-Supabase DB.
7. **Client מרוענן** — המשתמש מועבר חזרה לאפליקציה ורואה את הפיצ'רים הפרמיום פתוחים.

### Sequence Diagram

```mermaid
sequenceDiagram
    actor User as 👤 משתמש
    participant Client as 🖥️ Client
    participant Server as ⚙️ Server
    participant Stripe as 💳 Stripe
    participant DB as 🗄️ Supabase DB

    User->>Client: לוחץ "שדרג לפרמיום"
    Client->>Server: POST /api/checkout (עם JWT token)

    Server->>Server: אימות JWT — מי המשתמש?
    Server->>Stripe: צור Checkout Session<br/>(₪9.90/חודש, metadata: user_id)
    Stripe-->>Server: { session_id, checkout_url }

    Server-->>Client: { checkout_url }
    Client->>User: מפנה לדף תשלום של Stripe

    User->>Stripe: מכניס פרטי אשראי
    Note over Stripe: הכרטיס לא עובר דרך השרת שלנו
    Stripe->>Stripe: מעבד תשלום

    Stripe->>Server: POST /api/webhooks/payment<br/>{ event: "payment_succeeded", user_id, amount }
    Server->>Server: מאמת Stripe-Signature header
    Server->>DB: UPDATE profiles SET plan='premium'<br/>WHERE id = user_id
    DB-->>Server: ✅ עודכן

    Stripe->>Client: מפנה ל-success_url (חזרה לאפליקציה)
    Client->>Server: GET /api/profile — מה התוכנית שלי?
    Server->>DB: SELECT plan FROM profiles
    DB-->>Server: plan = 'premium'
    Server-->>Client: { plan: 'premium' }
    Client->>User: 🎉 פיצ'רי פרמיום פתוחים
```

---

## סיכום הארכיטקטורה

| עיקרון | איך מיושם ב-MyCarPortal |
|---|---|
| **Never trust the Client** | כל קריאות ל-data.gov.il עוברות דרך API Routes בשרת — הקליינט לא מדבר ישירות |
| **Security** | RLS ב-Supabase, JWT validation בכל בקשה, Webhook signature verification |
| **Performance** | 6 קריאות מקבילות (`Promise.all`), Serwist cache, CDN לתמונות ולוגו |
| **Scalability** | Vercel ו-Supabase מטפלים ב-Load Balancing אוטומטית |
| **Separation of concerns** | Client = תצוגה בלבד, Server = לוגיקה + אבטחה, DB = נתונים |
