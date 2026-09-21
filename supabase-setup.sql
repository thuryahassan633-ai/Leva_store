-- LEVA | Supabase security setup
-- هذا الملف للجداول الموجودة لديك بالفعل: products, orders, store_settings
-- نفّذيه من Supabase > SQL Editor بعد التأكد أن أسماء الجداول مطابقة.

create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'owner',
  created_at timestamptz not null default now()
);

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists(select 1 from public.admins where user_id = auth.uid());
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to anon, authenticated;

alter table public.admins enable row level security;
alter table public.products enable row level security;
alter table public.orders enable row level security;
alter table public.store_settings enable row level security;

-- Remove only policies created by this Leva script, so re-running is safe.
drop policy if exists leva_admins_self on public.admins;
drop policy if exists leva_products_public_read on public.products;
drop policy if exists leva_products_admin_all on public.products;
drop policy if exists leva_orders_public_insert on public.orders;
drop policy if exists leva_orders_admin_read on public.orders;
drop policy if exists leva_orders_admin_update on public.orders;
drop policy if exists leva_settings_public_read on public.store_settings;
drop policy if exists leva_settings_admin_update on public.store_settings;

create policy leva_admins_self on public.admins
for select to authenticated
using (user_id = auth.uid());

create policy leva_products_public_read on public.products
for select to anon, authenticated
using (active = true or public.is_admin());

create policy leva_products_admin_all on public.products
for all to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy leva_orders_public_insert on public.orders
for insert to anon, authenticated
with check (true);

create policy leva_orders_admin_read on public.orders
for select to authenticated
using (public.is_admin());

create policy leva_orders_admin_update on public.orders
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

create policy leva_settings_public_read on public.store_settings
for select to anon, authenticated
using (true);

create policy leva_settings_admin_update on public.store_settings
for update to authenticated
using (public.is_admin())
with check (public.is_admin());

-- Initial Leva settings row. If it already exists, it stays unchanged.
insert into public.store_settings
(id, store_name, arabic_name, tagline, description, primary_color, secondary_color, accent_color, background_color, text_color, whatsapp)
values
(true, 'Leva', 'ليڤـا', 'فرحة عمر، بأنامل ليڤـا تُرسم', 'توزيعات وهدايا وتفاصيل مميزة للمناسبات السعيدة.', '#9B7EDE', '#F4C7D8', '#D9B86C', '#FFF9F5', '#3E3348', '966533817655')
on conflict (id) do nothing;
