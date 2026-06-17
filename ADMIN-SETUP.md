# הקמת ניהול מאובטח (Supabase) — פרחי ברזיל

דף הניהול `admin.html` מאפשר **כניסה מאובטחת** וניהול מוצרים, קטגוריות, מחירים ותמונות.
האבטחה אמיתית ונאכפת בצד-השרת (Supabase Auth + Row Level Security) — לא רק בדפדפן.

> כל עוד לא משלימים את ההקמה, האתר עובד רגיל מתוך `js/data.js`, ודף הניהול יציג הנחיות.

---

## שלב 1 — פתיחת פרויקט
1. היכנסו ל-[supabase.com](https://supabase.com) ופתחו פרויקט חינמי חדש.
2. בחרו אזור (Region) קרוב (למשל פרנקפורט) וסיסמת DB.

## שלב 2 — יצירת הטבלאות וההרשאות
ב-Supabase: **SQL Editor → New query**, הדביקו והריצו את כל הבלוק:

```sql
-- ===== טבלאות =====
create table if not exists public.categories (
  key   text primary key,
  name  text not null,
  page  text,
  blurb text,
  hero  text,
  subs  jsonb default '[]'::jsonb,
  sort  int  default 0
);

create table if not exists public.products (
  id    text primary key,
  name  text not null,
  cat   text references public.categories(key) on delete set null,
  sub   text,
  price int  default 0,
  was   int,
  img   text,
  badge text,
  pos   text,
  descr text,
  sort  int  default 0
);

-- ===== הפעלת אבטחה (RLS) =====
alter table public.categories enable row level security;
alter table public.products   enable row level security;

-- קריאה: פתוחה לכולם (כדי שהאתר יציג את הקטלוג)
create policy "read categories" on public.categories for select using (true);
create policy "read products"   on public.products   for select using (true);

-- כתיבה: רק למשתמש מחובר (האדמין)
create policy "write categories" on public.categories for all to authenticated using (true) with check (true);
create policy "write products"   on public.products   for all to authenticated using (true) with check (true);
```

## שלב 3 — אחסון תמונות (Storage)
הריצו ב-SQL Editor:

```sql
-- יצירת bucket ציבורי לתמונות מוצרים
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- קריאה ציבורית, העלאה/עריכה/מחיקה רק למחובר
create policy "read images"   on storage.objects for select using (bucket_id = 'product-images');
create policy "upload images" on storage.objects for insert to authenticated with check (bucket_id = 'product-images');
create policy "update images" on storage.objects for update to authenticated using (bucket_id = 'product-images');
create policy "delete images" on storage.objects for delete to authenticated using (bucket_id = 'product-images');
```

## שלב 4 — יצירת משתמש מנהל וחסימת הרשמה
1. **Authentication → Users → Add user** → הזינו אימייל + סיסמה למנהל (סמנו *Auto Confirm*).
2. **Authentication → Sign In / Providers → Email** → **כבו** את *Allow new users to sign up*.
   כך רק המשתמש שיצרתם יוכל להתחבר — אף אחד לא יכול להירשם לבד.

## שלב 5 — חיבור האתר
1. ב-Supabase: **Project Settings → API**, העתיקו:
   - **Project URL** (למשל `https://abcd.supabase.co`)
   - **anon public** key
2. הדביקו אותם בקובץ [`js/supabase-config.js`](js/supabase-config.js):
   ```js
   window.SUPABASE_CONFIG = {
     url: "https://abcd.supabase.co",
     anonKey: "eyJhbGciOi..."
   };
   ```
   > ה-anon key נועד לחשיפה בצד-לקוח — הוא לבדו לא מאפשר כתיבה. הכתיבה חסומה ב-RLS לכל מי שאינו מחובר.

## שלב 6 — התחברות וייבוא הקטלוג
1. פתחו `admin.html` והתחברו עם משתמש המנהל.
2. בטאב **מוצרים** לחצו **„ייבוא קטלוג נוכחי”** — כל המוצרים והקטגוריות מ-`js/data.js` ייטענו ל-Supabase בלחיצה אחת.
3. מעכשיו אפשר לערוך/להוסיף/למחוק מוצרים, לשנות מחירים ותמונות וקטגוריות — **השינויים מתעדכנים מיד בכל האתר**.

---

## איך האבטחה עובדת?
- **התחברות אמיתית** דרך Supabase Auth (סיסמה מוצפנת, טוקן JWT).
- **RLS**: גם אם מישהו ישיג את ה-anon key (שהוא ציבורי ממילא), הוא יוכל **רק לקרוא** — כל פעולת כתיבה דורשת התחברות, ונאכפת בשרת.
- **תמונות**: קריאה ציבורית, העלאה רק למנהל מחובר.
- מומלץ גם להפעיל **MFA** למשתמש המנהל ב-Supabase לאבטחה מקסימלית.

## קבצים רלוונטיים
| קובץ | תפקיד |
|------|-------|
| `admin.html` | דף הניהול (כניסה + דשבורד) |
| `js/admin.js` | לוגיקת הניהול (Auth, CRUD, העלאת תמונות, ייבוא) |
| `js/supabase-config.js` | המפתחות שלכם (URL + anon key) |
| `js/site.js` | קורא מ-Supabase כשמוגדר, אחרת מ-`data.js` |
