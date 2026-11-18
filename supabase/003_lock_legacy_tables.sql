-- LinguaAI 003: eski users ve progress tablolarını kilitler
--
-- Ne zaman: 002 çalıştıktan, ilerlemenin yeni hesapta göründüğünü ve girişin sorunsuz
-- çalıştığını doğruladıktan SONRA. Bundan sonra eski sürüm (önbellekte kalmış bir telefon
-- uygulaması dahil) giriş yapamaz; bu amaçlanan davranıştır.
--
-- Veri silinmez: tablolar durur ama anon/authenticated roller hiçbir satırı göremez.
-- (Şifre özetleri bu tabloda olduğu için asıl açık burada kapanır.)

do $$
declare
  r record;
begin
  -- Eski tablolardaki tüm politikaları kaldır (varsa "herkese açık" olanlar dahil)
  for r in
    select schemaname, tablename, policyname
    from pg_policies
    where schemaname = 'public' and tablename in ('users', 'progress')
  loop
    execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename);
  end loop;

  -- RLS'i aç ve tüm yetkileri geri al
  for r in
    select schemaname, tablename
    from pg_tables
    where schemaname = 'public' and tablename in ('users', 'progress')
  loop
    execute format('alter table %I.%I enable row level security', r.schemaname, r.tablename);
    execute format('revoke all on table %I.%I from public, anon, authenticated', r.schemaname, r.tablename);
  end loop;
end
$$;

-- Birkaç hafta sorun çıkmazsa tamamen silebilirsin (GERİ ALINAMAZ):
-- drop table public.progress;
-- drop table public.users;
