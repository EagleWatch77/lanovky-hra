-- === MIGRÁCIA v5: rebríček hráčov ===
-- Vytvorí "view" (pohľad), ktorý ukazuje LEN názov strediska a prestíž — nie peniaze.
-- Beží s právami vlastníka (nie hráča), takže obíde bežné pravidlo "vidíš len svoje dáta" — presne pre tento jeden účel.

create or replace view rebricek as
select id, nazov, prestiz, created_at
from stanice
order by prestiz desc;

grant select on rebricek to authenticated;
