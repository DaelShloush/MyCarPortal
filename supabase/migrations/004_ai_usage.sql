-- ============================================================
-- AI usage cap — תקרה יומית גלובלית לזיהוי לוחית (OCR)
-- מגן מפני התפרצות עלויות: גם אם רבים סורקים, יש תקרה קשיחה ליום.
-- ============================================================

create table if not exists ai_usage (
  day date primary key,
  ocr_count integer not null default 0
);

-- אין policies → רק service_role (שעוקף RLS) ניגש. הקליינט לעולם לא קורא ישירות.
alter table ai_usage enable row level security;

-- increment אטומי עם בדיקת תקרה: מחזיר את הספירה החדשה אם מותר, או -1 אם עברנו את התקרה.
-- ה-FOR UPDATE נועל את השורה כך שאין race בין קריאות מקבילות.
create or replace function bump_ocr_usage(p_max integer)
returns integer
language plpgsql
security definer
as $$
declare
  cur integer;
begin
  insert into ai_usage (day, ocr_count)
  values (current_date, 0)
  on conflict (day) do nothing;

  select ocr_count into cur from ai_usage where day = current_date for update;

  if cur >= p_max then
    return -1;  -- עברנו את התקרה — לא מגדילים, לא קוראים ל-AI
  end if;

  update ai_usage set ocr_count = ocr_count + 1 where day = current_date;
  return cur + 1;
end;
$$;
