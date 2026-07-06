-- === MIGRÁCIA v3: nová univerzálna štruktúra budov (lanovky ako prvá kategória) ===
-- POZOR: toto vymaže starú tabuľku "budovy" (parkovisko/hotel/listok test dáta) a nahradí ju novou.
-- Spusti v Supabase → SQL Editor → New query → Run

drop table if exists budovy;

create table budovy (
  id uuid primary key default gen_random_uuid(),
  stanica_id uuid references stanice(id) not null,
  kategoria text not null,        -- napr. 'lanovka' (neskôr 'parkovisko', 'hotel', ...)
  typ text not null,              -- napr. 'vlek', 'sedacka_pevna', 'kabinka_8', ...
  znacka text not null,           -- 'alpinor' | 'montera' | 'nordtech'
  stav text not null default 'vo_vystavbe',  -- 'vo_vystavbe' | 'hotovo'
  cena numeric,                    -- cena lístka, ktorú si hráč nastaví (až keď je hotovo)
  zaciatok_vystavby timestamptz not null default now(),
  koniec_vystavby timestamptz not null,
  created_at timestamptz not null default now()
);

alter table budovy enable row level security;

create policy "Hráč vidí len svoje budovy"
  on budovy for select
  using (auth.uid() = (select user_id from stanice where stanice.id = budovy.stanica_id));

create policy "Hráč vytvára len svoje budovy"
  on budovy for insert
  with check (auth.uid() = (select user_id from stanice where stanice.id = budovy.stanica_id));

create policy "Hráč upravuje len svoje budovy"
  on budovy for update
  using (auth.uid() = (select user_id from stanice where stanice.id = budovy.stanica_id));

grant select, insert, update on budovy to authenticated;

-- Pridáme aj prestíž do stanice, nech ju vieme zobraziť (zatiaľ počítaná na strane webu, ale sem si ju priebežne ukladáme)
alter table stanice add column if not exists prestiz numeric not null default 0;
