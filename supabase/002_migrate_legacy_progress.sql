-- LinguaAI 002: eski ilerlemeyi yeni hesaplara taşır
--
-- Ne zaman: Yeni sürüm yayınlandıktan ve eski kullanıcıların her biri AYNI KULLANICI ADIYLA
-- yeniden kayıt olduktan sonra (çalışmaya başlamadan önce). Tekrar çalıştırılabilir.
--
-- Eşleşme: eski users.username  ->  auth.users.email = '<kullaniciadi>@linguaai.app'
-- Yeni sürümün kullanıcı adı kuralları daha dar (küçük harf, rakam, . _ -). Eski kullanıcı adın
-- bunlara uymadığı için başka bir adla kayıt olduysan, aşağıdaki "overrides" satırını doldur:
--   ('eski kullanici adi', 'yeni-kullanici-adi')
--
-- Hedef satırda zaten ilerleme varsa (yeniden kayıttan sonra çalıştıysan) ÜZERİNE YAZILMAZ.

with overrides(old_username, new_username) as (
  values (null::text, null::text)   -- örnek: ('eski ad', 'yeni-ad'), ('baska', 'baska2')
)
insert into public.user_progress (user_id, learned, quiz_correct, quiz_total, updated_at)
select
  a.id,
  coalesce(p.learned::jsonb, '{}'::jsonb),
  coalesce(p.quiz_correct, 0)::integer,
  coalesce(p.quiz_total, 0)::integer,
  coalesce(p.updated_at, now())::timestamptz
from public.users u
join public.progress p on p.user_id = u.id
left join overrides o on o.old_username = lower(u.username)
join auth.users a
  on lower(a.email) = coalesce(o.new_username, lower(u.username)) || '@linguaai.app'
on conflict (user_id) do update
  set learned      = excluded.learned,
      quiz_correct = excluded.quiz_correct,
      quiz_total   = excluded.quiz_total,
      updated_at   = excluded.updated_at
  where public.user_progress.learned = '{}'::jsonb
    and public.user_progress.quiz_total = 0;
