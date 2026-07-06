# Návod – prvé spustenie

## Krok 1: Vytvor databázovú tabuľku v Supabase

1. Choď do svojho Supabase projektu
2. V ľavom menu klikni na **"SQL Editor"**
3. Klikni **"New query"**
4. Vlož tento kód a klikni **"Run"**:

```sql
create table stanice (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) not null,
  nazov text not null,
  level integer not null default 1,
  created_at timestamp with time zone default now()
);

alter table stanice enable row level security;

create policy "Hráč vidí len svoju stanicu"
  on stanice for select
  using (auth.uid() = user_id);

create policy "Hráč vytvára len svoju stanicu"
  on stanice for insert
  with check (auth.uid() = user_id);

create policy "Hráč upravuje len svoju stanicu"
  on stanice for update
  using (auth.uid() = user_id);
```

Toto vytvorí tabuľku `stanice` a zabezpečí, že každý hráč vidí a upravuje len svoje vlastné dáta.

## Krok 2: Nahraj tento kód na GitHub

1. Choď na github.com, klikni **"New repository"**
2. Daj mu názov napr. `lanovky-hra`, nechaj ho **Public** alebo **Private** (obe fungujú), klikni **Create repository**
3. Na stránke repozitára klikni **"uploading an existing file"**
4. Presuň (drag & drop) tam všetky súbory a priečinky z tohto projektu
5. Klikni **Commit changes**

## Krok 3: Nasaď na Vercel

1. Choď na vercel.com, klikni **"Add New" → "Project"**
2. Vyber svoj práve nahraný repozitár `lanovky-hra`
3. Predtým než klikneš Deploy, rozklikni **"Environment Variables"** a pridaj:
   - `NEXT_PUBLIC_SUPABASE_URL` = (Project URL zo Supabase)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = (anon public key zo Supabase)
4. Klikni **Deploy**

Po chvíli dostaneš odkaz (napr. `lanovky-hra.vercel.app`), kde uvidíš svoju stránku živú na webe.

## Čo táto prvá verzia vie

- Registrácia a prihlásenie hráča (email + heslo)
- Po prihlásení sa hráčovi automaticky vytvorí jeho prvá "stanica"
- Tlačidlo "Vylepšiť stanicu" zvýši jej level a uloží to do databázy natrvalo

Toto je základ, na ktorý budeme postupne nabaľovať ďalšie herné mechaniky (suroviny, budovy, aliancie, sezóny).
