# Návod — verzia 4 (pridané parkoviská a pokladne)

## Krok 1: Spusti malú SQL úpravu v Supabase

1. Supabase → **SQL Editor** → **New query**
2. Vlož a spusti:

```sql
alter table budovy alter column znacka drop not null;
```

(Toto len umožní, aby parkoviská a pokladne nemuseli mať vyplnenú "značku" — tú majú zatiaľ len lanovky.)

## Krok 2: Nahraď 2 súbory na GitHube

**`lib/katalog.js`** — kompletne nový obsah (pribudli parkoviská, pokladne, univerzálne funkcie)
**`app/page.js`** — kompletne nový obsah (podpora viacerých kategórií budov)

Postup pre každý:
1. Choď na GitHub do súboru → klikni ceruzku (Edit)
2. Označ všetko (Ctrl+A), vymaž
3. Vlož nový obsah zo stiahnutého balíka
4. Commit changes

## Krok 3: Redeploy na Verceli

Deployments → tri bodky ⋯ → Redeploy (odporúčam znova vypnúť "Use existing Build Cache", nech je istota čerstvého buildu).

## Čo je nové

- Pri stavaní teraz najprv vyberieš **kategóriu** (Lanovky / Parkoviská / Pokladne), potom typ, a pri lanovkách aj značku
- Parkoviská majú tiež nastaviteľnú cenu a generujú príjem
- Pokladne zatiaľ negenerujú vlastný príjem (len prestíž) — v budúcnosti budú podporovať kapacitu ostatných budov

## Ďalej v pláne (podľa GDD.md)

Hotely, ratraky, zasnežovanie, bary, obchod, servis/požičovňa — pridáme postupne rovnakým spôsobom.
