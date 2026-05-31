# MyCarPortal — Data Design

## סקירה כללית

בסיס הנתונים של MyCarPortal רץ על **Supabase PostgreSQL**.  
8 טבלאות, כולן עם RLS מופעל. הרשאות: כל משתמש רואה ומשנה רק את הנתונים שלו.

---

## טבלאות

### 1. `profiles`
מרחיבה את `auth.users` של Supabase עם נתוני פרופיל.

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | — | PK, FK → `auth.users(id)` ON DELETE CASCADE | מזהה זהה ל-auth |
| `name` | `text` | `null` | — | שם תצוגה |
| `plan` | `text` | `'free'` | CHECK IN ('free','premium') | מסלול מנוי |
| `push_enabled` | `boolean` | `false` | — | הסכמה להתראות Push |
| `created_at` | `timestamptz` | `now()` | — | תאריך הרשמה |

---

### 2. `vehicles`
רכבים שמשתמש הוסיף לניהול אישי.

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה ייחודי |
| `user_id` | `uuid` | — | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | בעל הרכב |
| `license_plate` | `text` | — | NOT NULL | מספר לוחית רישוי |
| `nickname` | `text` | `null` | — | כינוי: "הרכב של אמא" |
| `manufacturer` | `text` | `null` | — | יצרן (מ-API) |
| `model` | `text` | `null` | — | דגם מסחרי (מ-API) |
| `year` | `integer` | `null` | — | שנת ייצור |
| `color` | `text` | `null` | — | צבע |
| `fuel_type` | `text` | `null` | — | סוג דלק |
| `ownership_type` | `text` | `null` | — | סוג בעלות נוכחית |
| `last_test_date` | `date` | `null` | — | תאריך טסט אחרון |
| `test_expiry_date` | `date` | `null` | — | תוקף טסט |
| `insurance_expiry_date` | `date` | `null` | — | תוקף ביטוח (משתמש מזין) |
| `km_at_last_test` | `integer` | `null` | — | ק"מ בטסט האחרון |
| `structural_change` | `boolean` | `null` | — | שינוי מבנה |
| `color_changed` | `boolean` | `null` | — | שינוי צבע |
| `first_registration_date` | `date` | `null` | — | עלייה לכביש |
| `owner_count` | `integer` | `null` | — | מספר בעלים (מחושב) |
| `has_open_recalls` | `boolean` | `null` | — | ריקולים פתוחים |
| `raw_gov_data` | `jsonb` | `null` | — | כל הנתונים הגולמיים מ-API |
| `asking_price` | `integer` | `null` | — | מחיר מבוקש (אם למכירה) |
| `is_for_sale` | `boolean` | `false` | — | האם מוצע למכירה |
| `sale_notes` | `text` | `null` | — | הערות למודעת מכירה |
| `sale_photo_path` | `text` | `null` | — | תמונה למכירה (Storage path) |
| `last_synced_at` | `timestamptz` | `null` | — | עדכון אחרון מ-API |
| `added_at` | `timestamptz` | `now()` | — | תאריך הוספה |

**אילוץ ייחודי:** `UNIQUE(user_id, license_plate)`

---

### 3. `service_records`
היסטוריית טיפולים לכל רכב.

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה |
| `vehicle_id` | `uuid` | — | NOT NULL, FK → `vehicles(id)` ON DELETE CASCADE | הרכב |
| `user_id` | `uuid` | — | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | המשתמש |
| `service_type` | `text` | — | NOT NULL, CHECK IN ('oil','tires','brakes','battery','ac','timing_belt','general','accident_repair','other') | סוג טיפול |
| `title` | `text` | — | NOT NULL | כותרת: "החלפת שמן + פילטר" |
| `description` | `text` | `null` | — | פירוט חופשי |
| `garage_name` | `text` | `null` | — | שם מוסך |
| `cost` | `integer` | `null` | — | עלות בש"ח |
| `km_at_service` | `integer` | `null` | — | ק"מ בזמן הטיפול |
| `service_date` | `date` | — | NOT NULL | תאריך ביצוע |
| `receipt_path` | `text` | `null` | — | קבלה (Storage path) |
| `created_at` | `timestamptz` | `now()` | — | תאריך הזנה |

---

### 4. `documents`
קבצים מצורפים לכל רכב (רישיון, ביטוח, טסט וכו').

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה |
| `vehicle_id` | `uuid` | — | NOT NULL, FK → `vehicles(id)` ON DELETE CASCADE | הרכב |
| `type` | `text` | — | NOT NULL, CHECK IN ('license','insurance','test','receipt','other') | סוג מסמך |
| `name` | `text` | — | NOT NULL | שם הקובץ |
| `file_path` | `text` | — | NOT NULL | נתיב ב-Supabase Storage |
| `file_size` | `integer` | `null` | — | גודל בבייטים |
| `uploaded_at` | `timestamptz` | `now()` | — | תאריך העלאה |

---

### 5. `reminders`
תזכורות אוטומטיות לטסט, ביטוח, או מותאמות אישית.

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה |
| `user_id` | `uuid` | — | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | המשתמש |
| `vehicle_id` | `uuid` | — | NOT NULL, FK → `vehicles(id)` ON DELETE CASCADE | הרכב |
| `type` | `text` | — | NOT NULL, CHECK IN ('test','insurance','custom') | סוג תזכורת |
| `title` | `text` | `null` | — | כותרת מותאמת |
| `due_date` | `date` | — | NOT NULL | תאריך יעד |
| `notify_days_before` | `integer` | `30` | — | ימי התראה מראש |
| `notified_email` | `boolean` | `false` | — | האם נשלח מייל |
| `notified_push` | `boolean` | `false` | — | האם נשלחה התראת Push |
| `created_at` | `timestamptz` | `now()` | — | תאריך יצירה |

---

### 6. `favorites`
רכבים שמשתמש שמר לצפייה חוזרת.

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה |
| `user_id` | `uuid` | — | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | המשתמש |
| `license_plate` | `text` | — | NOT NULL | מספר רישוי של הרכב המועדף |
| `cached_data` | `jsonb` | `null` | — | snapshot של נתוני הרכב בעת השמירה |
| `notes` | `text` | `null` | — | הערות אישיות |
| `added_at` | `timestamptz` | `now()` | — | תאריך הוספה |

**אילוץ ייחודי:** `UNIQUE(user_id, license_plate)`

---

### 7. `search_history`
היסטוריית חיפושים — גם למשתמשים מחוברים וגם אורחים (ב-localStorage).

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה |
| `user_id` | `uuid` | `null` | FK → `auth.users(id)` ON DELETE CASCADE (nullable) | משתמש (null = אורח) |
| `license_plate` | `text` | — | NOT NULL | מספר רישוי שנחפש |
| `result_summary` | `jsonb` | `null` | — | מינימום נתונים להצגה ברשימה |
| `searched_at` | `timestamptz` | `now()` | — | זמן החיפוש |

---

### 8. `push_subscriptions`
מנויי Push Notification (Web Push / VAPID).

| עמודה | סוג | ברירת מחדל | אילוצים | תיאור |
|-------|-----|------------|---------|-------|
| `id` | `uuid` | `gen_random_uuid()` | PK | מזהה |
| `user_id` | `uuid` | — | NOT NULL, FK → `auth.users(id)` ON DELETE CASCADE | המשתמש |
| `endpoint` | `text` | — | NOT NULL, UNIQUE | כתובת endpoint של הדפדפן |
| `keys` | `jsonb` | — | NOT NULL | `{ p256dh, auth }` |
| `created_at` | `timestamptz` | `now()` | — | תאריך רישום |

---

## קשרים בין טבלאות

```
auth.users ──────────────── profiles          (1:1)
profiles   ──────────────── vehicles          (1:N)
profiles   ──────────────── favorites         (1:N)
profiles   ──────────────── search_history    (1:N)
profiles   ──────────────── push_subscriptions(1:N)
profiles   ──────────────── reminders         (1:N)
vehicles   ──────────────── service_records   (1:N)
vehicles   ──────────────── documents         (1:N)
vehicles   ──────────────── reminders         (1:N)
```

---

## SQL Migration — `001_initial_schema.sql`

```sql
-- ============================================================
-- MyCarPortal — Initial Schema
-- ============================================================

-- ===== PROFILES =====
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text,
  plan text not null default 'free' check (plan in ('free', 'premium')),
  push_enabled boolean not null default false,
  created_at timestamptz not null default now()
);

-- ===== VEHICLES =====
create table vehicles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  license_plate text not null,
  nickname text,
  manufacturer text,
  model text,
  year integer,
  color text,
  fuel_type text,
  ownership_type text,
  last_test_date date,
  test_expiry_date date,
  insurance_expiry_date date,
  km_at_last_test integer,
  structural_change boolean,
  color_changed boolean,
  first_registration_date date,
  owner_count integer,
  has_open_recalls boolean,
  raw_gov_data jsonb,
  asking_price integer,
  is_for_sale boolean not null default false,
  sale_notes text,
  sale_photo_path text,
  last_synced_at timestamptz,
  added_at timestamptz not null default now(),
  unique(user_id, license_plate)
);

-- ===== SERVICE RECORDS =====
create table service_records (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  service_type text not null check (service_type in (
    'oil','tires','brakes','battery','ac','timing_belt','general','accident_repair','other'
  )),
  title text not null,
  description text,
  garage_name text,
  cost integer,
  km_at_service integer,
  service_date date not null,
  receipt_path text,
  created_at timestamptz not null default now()
);

-- ===== DOCUMENTS =====
create table documents (
  id uuid primary key default gen_random_uuid(),
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  type text not null check (type in ('license','insurance','test','receipt','other')),
  name text not null,
  file_path text not null,
  file_size integer,
  uploaded_at timestamptz not null default now()
);

-- ===== REMINDERS =====
create table reminders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  vehicle_id uuid not null references vehicles(id) on delete cascade,
  type text not null check (type in ('test','insurance','custom')),
  title text,
  due_date date not null,
  notify_days_before integer not null default 30,
  notified_email boolean not null default false,
  notified_push boolean not null default false,
  created_at timestamptz not null default now()
);

-- ===== FAVORITES =====
create table favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  license_plate text not null,
  cached_data jsonb,
  notes text,
  added_at timestamptz not null default now(),
  unique(user_id, license_plate)
);

-- ===== SEARCH HISTORY =====
create table search_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade,
  license_plate text not null,
  result_summary jsonb,
  searched_at timestamptz not null default now()
);

-- ===== PUSH SUBSCRIPTIONS =====
create table push_subscriptions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  endpoint text not null unique,
  keys jsonb not null,
  created_at timestamptz not null default now()
);
```

---

## RLS Policies

```sql
-- ============================================================
-- Row Level Security — כל טבלה
-- ============================================================

-- profiles
alter table profiles enable row level security;
create policy "profiles: select own" on profiles for select using (auth.uid() = id);
create policy "profiles: insert own" on profiles for insert with check (auth.uid() = id);
create policy "profiles: update own" on profiles for update using (auth.uid() = id);

-- vehicles
alter table vehicles enable row level security;
create policy "vehicles: select own" on vehicles for select using (auth.uid() = user_id);
create policy "vehicles: insert own" on vehicles for insert with check (auth.uid() = user_id);
create policy "vehicles: update own" on vehicles for update using (auth.uid() = user_id);
create policy "vehicles: delete own" on vehicles for delete using (auth.uid() = user_id);

-- service_records
alter table service_records enable row level security;
create policy "service_records: select own" on service_records for select using (auth.uid() = user_id);
create policy "service_records: insert own" on service_records for insert with check (auth.uid() = user_id);
create policy "service_records: update own" on service_records for update using (auth.uid() = user_id);
create policy "service_records: delete own" on service_records for delete using (auth.uid() = user_id);

-- documents
alter table documents enable row level security;
create policy "documents: select own" on documents
  for select using (
    exists (select 1 from vehicles where vehicles.id = documents.vehicle_id and vehicles.user_id = auth.uid())
  );
create policy "documents: insert own" on documents
  for insert with check (
    exists (select 1 from vehicles where vehicles.id = documents.vehicle_id and vehicles.user_id = auth.uid())
  );
create policy "documents: delete own" on documents
  for delete using (
    exists (select 1 from vehicles where vehicles.id = documents.vehicle_id and vehicles.user_id = auth.uid())
  );

-- reminders
alter table reminders enable row level security;
create policy "reminders: select own" on reminders for select using (auth.uid() = user_id);
create policy "reminders: insert own" on reminders for insert with check (auth.uid() = user_id);
create policy "reminders: update own" on reminders for update using (auth.uid() = user_id);
create policy "reminders: delete own" on reminders for delete using (auth.uid() = user_id);

-- favorites
alter table favorites enable row level security;
create policy "favorites: select own" on favorites for select using (auth.uid() = user_id);
create policy "favorites: insert own" on favorites for insert with check (auth.uid() = user_id);
create policy "favorites: update own" on favorites for update using (auth.uid() = user_id);
create policy "favorites: delete own" on favorites for delete using (auth.uid() = user_id);

-- search_history
alter table search_history enable row level security;
create policy "search_history: select own" on search_history
  for select using (auth.uid() = user_id or user_id is null);
create policy "search_history: insert own" on search_history
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "search_history: delete own" on search_history
  for delete using (auth.uid() = user_id);

-- push_subscriptions
alter table push_subscriptions enable row level security;
create policy "push_subscriptions: select own" on push_subscriptions for select using (auth.uid() = user_id);
create policy "push_subscriptions: insert own" on push_subscriptions for insert with check (auth.uid() = user_id);
create policy "push_subscriptions: delete own" on push_subscriptions for delete using (auth.uid() = user_id);
```

---

## Indexes

```sql
-- חיפוש מהיר לפי user_id (שימוש כבד בכל טבלה)
create index idx_vehicles_user_id on vehicles(user_id);
create index idx_service_records_vehicle_id on service_records(vehicle_id);
create index idx_service_records_user_id on service_records(user_id);
create index idx_documents_vehicle_id on documents(vehicle_id);
create index idx_reminders_user_id on reminders(user_id);
create index idx_reminders_due_date on reminders(due_date);
create index idx_favorites_user_id on favorites(user_id);
create index idx_search_history_user_id on search_history(user_id);
create index idx_search_history_searched_at on search_history(searched_at desc);
create index idx_push_subscriptions_user_id on push_subscriptions(user_id);

-- חיפוש לפי לוחית רישוי
create index idx_vehicles_license_plate on vehicles(license_plate);
create index idx_favorites_license_plate on favorites(license_plate);
create index idx_search_history_license_plate on search_history(license_plate);
```

---

## Trigger — יצירת profile אוטומטית בהרשמה

```sql
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id, name)
  values (new.id, new.raw_user_meta_data ->> 'name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function handle_new_user();
```

---

## Supabase Storage

### Bucket: `documents`
מסמכי רכב (PDF, תמונות קבלות וכו').

```
documents/
  └── {user_id}/
      └── {vehicle_id}/
          ├── license.pdf
          ├── insurance_2025.pdf
          └── test_receipt.jpg
```

**Storage Policy:**
```sql
-- כל משתמש גישה רק לתיקייה שלו
create policy "documents: user folder only"
  on storage.objects for all
  using (
    bucket_id = 'documents' and
    auth.uid()::text = (storage.foldername(name))[1]
  )
  with check (
    bucket_id = 'documents' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

**הגבלות:**
- גודל קובץ מקסימלי: `5MB` (iOS Storage limit 50MB)
- סוגי קבצים מותרים: `image/jpeg, image/png, image/webp, application/pdf`

### Bucket: `sale-photos`
תמונות לרכבים המוצעים למכירה.

```sql
-- גישה ציבורית לקריאה (מודעות מכירה פומביות)
create policy "sale-photos: public read"
  on storage.objects for select
  using (bucket_id = 'sale-photos');

-- כתיבה רק לבעלים
create policy "sale-photos: owner write"
  on storage.objects for insert
  with check (
    bucket_id = 'sale-photos' and
    auth.uid()::text = (storage.foldername(name))[1]
  );
```

---

## Freemium — אכיפת מגבלות

מגבלות מסלול חינם נאכפות ב-API Routes (לא ב-DB), אך ניתן לוודא גם ב-DB:

| מגבלה | Free | Premium |
|-------|------|---------|
| רכבים | 1 | 3 |
| מסמכים לרכב | 5 | ללא הגבלה |
| מועדפים | 5 | ללא הגבלה |
| היסטוריית חיפוש | 20 אחרונים | ללא הגבלה |
| טיפולים | 10 | ללא הגבלה |

---

## סדר הרצה ב-Supabase SQL Editor

1. הרץ את **SQL Migration** (טבלאות)
2. הרץ את **RLS Policies**
3. הרץ את **Indexes**
4. הרץ את **Trigger**
5. צור את ה-**Storage Buckets** דרך Supabase Dashboard → Storage → New Bucket
6. הרץ את **Storage Policies**
