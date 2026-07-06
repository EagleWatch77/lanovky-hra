alter table stanice add column if not exists plat_multiplikator numeric not null default 1;
alter table stanice add column if not exists efektivita_bonus numeric not null default 1;
alter table stanice add column if not exists efektivita_bonus_do timestamptz not null default now();
alter table stanice add column if not exists vyjednavany_rok integer not null default extract(year from now())::int;
