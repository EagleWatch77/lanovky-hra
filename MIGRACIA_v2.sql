-- === MIGRÁCIA v2: peniaze + budovy s nastaviteľnými cenami ===
-- Spusti toto v Supabase → SQL Editor → New query → Run

-- 1) Pridáme peniaze a čas poslednej aktualizácie do existujúcej tabuľky stanice
alter table stanice add column if not exists peniaze numeric not null default 1000;
alter table stanice add column if not exists last_update timestamptz not null default now();

-- 2) Nová tabuľka pre budovy (parkovisko, hotel, lístok na lanovku)
create table if not exists budovy (
  id uuid primary key default gen_random_uuid(),
  stanica_id uuid references stanice(id) not null,
  typ text not null check (typ in ('parkovisko', 'hotel', 'listok')),
  level integer not null default 1,
  cena numeric not null default 10,
  unique (stanica_id, typ)
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
