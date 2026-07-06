# Návod — verzia 3 (lanovky s výstavbou na čas)

## Krok 1: Spusti SQL migráciu v Supabase

1. Choď do Supabase → **SQL Editor** → **New query**
2. Otvor súbor `MIGRACIA_v3.sql` (je súčasťou tohto balíka), skopíruj celý jeho obsah
3. Vlož do SQL Editora a klikni **Run**

⚠️ Táto migrácia **vymaže starú tabuľku `budovy`** (tú s parkoviskom/hotelom/lístkom z predchádzajúcej verzie) a nahradí ju novou štruktúrou pre lanovky. Je to v poriadku, keďže sme len testovali.

## Krok 2: Vystav novú tabuľku cez Data API (rovnaký krok ako predtým)

1. Supabase → **Project Settings** → **Data API** → **Exposed tables** (alebo Exposed schemas)
2. Uisti sa, že `budovy` je znova zapnutá/vystavená (keďže sme tabuľku vytvorili nanovo)

## Krok 3: Nahraj zmenené/nové súbory na GitHub

Zmenili/pridali sa tieto súbory:
- `app/page.js` — **nahraď obsah** existujúceho súboru (Edit → vlož nový obsah → Commit)
- `lib/katalog.js` — **nový súbor**, vytvor cez "Add file" → "Create new file", cesta `lib/katalog.js`
- `MIGRACIA_v3.sql` — nový súbor, len pre referenciu (nemusí byť na GitHube, ale môžeš ho tam nahrať tiež)

## Krok 4: Redeploy na Verceli

1. Vercel → projekt → **Deployments**
2. Malo by sa spustiť automaticky po commite, ak nie: tri bodky **⋯** → **Redeploy**

## Čo je nové v tejto verzii

- Namiesto pevných 3 budov (parkovisko/hotel/lístok) teraz staviaš **lanovky** — vyber si typ (vlek až po 3S systém) a značku (Alpinor/Montera/Nordtech)
- Stavba **trvá reálny čas** (dni), aj keď nie si online — po prihlásení uvidíš, čo sa medzičasom dokončilo
- Pribudla **Prestíž** (⭐) — oddelené skóre od peňazí, počíta sa z hotových lanoviek
- Cenu lístka si nastavíš sám, turisti reagujú na cenu rovnako ako predtým

## Ďalšie kroky (pripravené v GDD.md, budeme pridávať postupne)

Parkoviská, pokladne, hotely, ratraky, zasnežovanie, bary, obchod, servis/požičovňa — všetko už je navrhnuté v `GDD.md`, pridáme to v ďalších krokoch podobným spôsobom ako lanovky.
