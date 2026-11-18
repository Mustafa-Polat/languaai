-- LinguaAI 001: ilerleme tablosu ve satır düzeyi güvenlik (RLS)
--
-- Güvenli ve eklemelidir: mevcut tablolara dokunmaz, bu yüzden yayındaki eski sürüm çalışmaya
-- devam eder. Yeni kodu yayınlamadan ÖNCE çalıştır. Tekrar çalıştırılabilir.

create table if not exists public.user_progress (
  user_id      uuid primary key references auth.users (id) on delete cascade,
  learned      jsonb       not null default '{}'::jsonb,
  quiz_correct integer     not null default 0 check (quiz_correct >= 0),
  quiz_total   integer     not null default 0 check (quiz_total >= 0),
  updated_at   timestamptz not null default now(),
  -- Tek bir kullanıcının tabloyu şişirmesini engeller (tüm kelimeler öğrenilmiş olsa bile ~130 KB)
  constraint user_progress_learned_object check (jsonb_typeof(learned) = 'object'),
  constraint user_progress_learned_size   check (pg_column_size(learned) < 1000000)
);

alter table public.user_progress enable row level security;

-- Varsayılan yetkileri sıfırla, sonra yalnızca giriş yapmış kullanıcıya gerekeni ver.
-- Silme yetkisi bilerek verilmiyor: uygulama satır silmez ("sıfırla" boş veriyle günceller);
-- hesap silinince satır on delete cascade ile gider.
revoke all on table public.user_progress from public, anon, authenticated;
grant select, insert, update on table public.user_progress to authenticated;

drop policy if exists "user_progress_select_own" on public.user_progress;
drop policy if exists "user_progress_insert_own" on public.user_progress;
drop policy if exists "user_progress_update_own" on public.user_progress;

-- (select auth.uid()) biçimi, her satır için yeniden hesaplanmasın diye bilerek yazıldı
create policy "user_progress_select_own" on public.user_progress
  for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "user_progress_insert_own" on public.user_progress
  for insert to authenticated
  with check ((select auth.uid()) = user_id);

create policy "user_progress_update_own" on public.user_progress
  for update to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);
