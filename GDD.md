# Lanovky Hra — Herný dizajnový dokument (GDD)

*Posledná aktualizácia: podľa priebehu vývoja, priebežne dopĺňať*

---

## 1. Základná koncepcia

Webová manažérska/strategická hra o budovaní a prevádzkovaní lyžiarskeho strediska. Hráč stavia lanovky, ratraky, parkoviská, hotely a ďalšiu infraštruktúru, nastavuje ceny služieb a súťaží s ostatnými hráčmi o prestíž v rámci ligy.

Inšpirácie: Travian (budovanie, dlhodobý rozvoj), Hattrick/Goalunited/Hockeyarena (trvalý svet, ligy s postupom/zostupom, manažérske rozhodovanie), Rail Nation (sezónnosť).

---

## 2. Časový systém

- **Herný čas beží 2× rýchlejšie ako reálny čas.**
- 1 "herný rok" (zima + leto) = **6 reálnych mesiacov**.
  - Zimná sezóna: 3 reálne mesiace
  - Letná sezóna: 3 reálne mesiace
- **Svet je trvalý — žiadny každoročný reset.** Budovy zostávajú navždy, hráč na nich stavia dlhodobo.
- Sezóna = **ligové obdobie**, po ktorom sa vyhodnocuje postup/zostup (nie reset dát).
- Stavebné časy budov sú v hernom čase, prepočítané cez pomer 2:1 na reálny čas (napr. herných 5 mesiacov = 2,5 reálneho mesiaca).

---

## 3. Ligový systém

- Na začiatok: **1 liga, cca 10 hráčov** (test/prototyp).
- Do budúcna: viac líg (pyramída), postup/zostup na konci sezóny — podobne ako Hattrick.
- Plánované (neskôr): rozdelenie sveta na vymyslené regióny/pohoria (vlastné názvy, nie reálne), každý s vlastnou ligovou pyramídou.
- **Aliancie** — samostatná sociálna vrstva, nezávislá od lígy. Rieši sa až neskôr, po doladení individuálnej hry. Plán: spoločné projekty, zdieľané regióny, extra pozemky ako odmena za splnenie aliančných cieľov.

---

## 4. Dve oddelené metriky: Peniaze vs. Prestíž

| | Peniaze | Prestíž (skóre) |
|---|---|---|
| Účel | Bežná mena, minie sa na stavbu/vylepšenia/marketing | Dlhodobé hodnotenie strediska, nedá sa "minúť" |
| Zdroj | Predaj lístkov, parkovné, hotel, bufet | Súčet: úroveň/kvalita budov, spokojnosť turistov, bonus za celoročnú (zimnú aj letnú) ponuku |
| Použitie | Nákup/stavba/vylepšenia | **Poradie v lige**, rebríček, postup/zostup |

Návrh vzorca prestíže (bude sa ladiť):
```
Prestíž = (súčet "prestížnych bodov" všetkých budov)
        + (priemerná spokojnosť turistov × váha)
        + (bonus za súčasnú zimnú AJ letnú ponuku)
```

---

## 5. Štart hry

- Každý hráč začína s **1 000 000 €** štartovacím kapitálom.
- Hráč si musí **vybrať, čo postaviť ako prvé** — žiadna kombinácia nepokryje všetko, treba plánovať aj rezervu na mesačné náklady (údržbu), kým stavba nezačne zarábať.
- Mesačné náklady (údržba) bežia **až keď je budova hotová**, nie počas výstavby.
- Priestor na stavanie je **limitovaný počtom slotov** (rozšíriteľné cez alianciu alebo neskôr za reálne peniaze — pozri sekciu 9).

---

## 6. Katalóg budov

### 6.1 Lanovky — typy (bez "levelov", prestavba = nová budova)

| Typ | Cena (základ) | Výstavba (herný čas) | Kapacita/hod | Prestíž |
|---|---|---|---|---|
| Vlek | 150 000 € | 1 mesiac | 15 | +20 |
| Pevná sedačková lanovka | 400 000 € | 2 mesiace | 25 | +40 |
| Odpojiteľná 4-sedačka | 900 000 € | 3 mesiace | 45 | +70 |
| Odpojiteľná 6-sedačka | 1 300 000 € | 3,5 mesiaca | 65 | +90 |
| Odpojiteľná 8-sedačka | 1 800 000 € | 4 mesiace | 90 | +110 |
| Kabínková 8-miestna | 2 500 000 € | 5 mesiacov | 110 | +140 |
| Kabínková 10-miestna | 3 200 000 € | 5,5 mesiaca | 140 | +160 |
| Kabínková 15-miestna | 4 200 000 € | 6 mesiacov | 190 | +190 |
| Funitel | 5 500 000 € | 7 mesiacov | 220 | +220 |
| 3S systém | 8 000 000 € | 9 mesiacov | 280 | +280 |

**Prestavba/výmena** = cena novej lanovky + cena demolácie starej.

### 6.2 Výrobné značky lanoviek (modifikátory nad základnú cenu z tabuľky vyššie)

| Značka | Charakter | Cena | Údržba | Poruchovosť | Prestíž |
|---|---|---|---|---|---|
| **Alpinor** | Prémiová, najspoľahlivejšia | +20% | Nižšia | Veľmi nízka | +25% |
| **Montera** | Vyvážená, "bezpečná voľba" | Základ | Priemerná | Priemerná | Základ |
| **Nordtech** | Lacnejšia, riskantnejšia | −15% | Vyššia | Vyššia (občasné poruchy) | −10% |

### 6.3 Ratraky (úprava zjazdoviek) — 2 značky × 3 veľkosti + prémiová

| Model | Značka | Cena | Kapacita | Údržba/mes | Spoľahlivosť |
|---|---|---|---|---|---|
| Kompakt | Snowtrac | 150 000 € | 5 km/noc | 900 € | Priemerná |
| Kompakt | Pistenwolf | 190 000 € | 5 km/noc | 700 € | Vysoká |
| Štandard | Snowtrac | 300 000 € | 12 km/noc | 1 700 € | Priemerná |
| Štandard | Pistenwolf | 380 000 € | 12 km/noc | 1 300 € | Vysoká |
| Výkonný | Snowtrac | 520 000 € | 25 km/noc | 2 900 € | Priemerná |
| Výkonný | Pistenwolf | 650 000 € | 25 km/noc | 2 200 € | Vysoká |
| **Pistenwolf Elite** (💎 reálne peniaze) | Pistenwolf | reálne peniaze | 30 km/noc | 1 800 € | Najvyššia |

Rovnaký výkon v rámci veľkosti, značky sa líšia cenou/údržbou/spoľahlivosťou (rovnaký princíp ako pri lanovkách).

### 6.4 Parkoviská — typy + umiestnenie

| Typ | Cena | Výstavba | Kapacita | Údržba/mes | Prestíž |
|---|---|---|---|---|---|
| Štrkové parkovisko | 80 000 € | 2 týždne | 40 áut | 400 € | +5 |
| Asfaltové parkovisko | 250 000 € | 1 mesiac | 60 áut | 900 € | +15 |
| Luxusné asfaltové | 500 000 € | 1,5 mesiaca | 80 áut | 1 500 € | +35 |
| Parkovací dom (viacposchodový) | 1 400 000 € | 4 mesiace | 200 áut | 4 000 € | +70 |

**Umiestnenie (plánované, ladiť neskôr):**
- Pri lanovke: drahšie, menšia kapacita (obmedzený priestor), vyššia spokojnosť turistov
- Ďalej od lanovky: lacnejšie, väčšia kapacita, nižšia spokojnosť (kompenzovateľné napr. budúcou kyvadlovou dopravou)

**Viacero lanoviek/vlekov a vzťah k parkovisku:**
- Hráč môže postaviť viac vlekov/lanoviek, ale **parkovisko obsluhuje len tie, čo sú v jeho blízkosti**.
- Prvý vlek (pri jedinom parkovisku) = najvyššia spokojnosť turistov.
- Ďalšie vleky **ďalej od parkoviska** (bez vlastného blízkeho parkoviska) = nižšia spokojnosť → ťahá dole celkovú prestíž strediska.
- Rieši sa buď stavbou **ďalšieho parkoviska bližšie** k vzdialenejším vlekom, alebo (neskôr) kyvadlovou dopravou ako lacnejšou alternatívou.

### 6.5 Pokladne (predaj lístkov/informácie)

| Typ | Cena | Kapacita (odbavení/hod) | Prestíž |
|---|---|---|---|
| Malá pokladňa | 40 000 € | 30 | +5 |
| Veľká pokladňa | 150 000 € | 80 | +15 |

Umiestňujú sa pri vleku aj pri parkovisku (podobný princíp vzdialenosti ako pri parkoviskách — pozri 6.4).

### 6.6 Hotely (progresia od penziónu po grand hotel)

| Typ | Cena | Výstavba (herný čas) | Kapacita (izby) | Prestíž |
|---|---|---|---|---|
| Penzión | 300 000 € | 4 mesiace | 10 | +30 |
| Malý hotel | 900 000 € | 8 mesiacov | 25 | +70 |
| Hotel | 2 000 000 € | 14 mesiacov | 50 | +130 |
| Grand hotel | 4 500 000 € | 22 mesiacov | 100 | +250 |

### 6.7 Bary na zjazdovke

| Typ | Cena | Kapacita | Prestíž |
|---|---|---|---|
| Bar na zjazdovke | 180 000 € | 40 zákazníkov/hod | +10 |

### 6.8 Servis a požičovňa vybavenia

Sezónne prepínanie ponuky — lyže/snowboardy v zime, bicykle v lete (rovnaká budova, iný sortiment podľa sezóny).

| Typ | Cena | Kapacita | Prestíž |
|---|---|---|---|
| Servis a požičovňa | 250 000 € | 25 kusov vybavenia/deň | +15 |

### 6.9 Obchod (oblečenie, potraviny, suveníry — bez detailného rozlišovania sortimentu)

| Typ | Cena | Výstavba | Kapacita | Prestíž |
|---|---|---|---|---|
| Obchod | 200 000 € | 2 mesiace | 60 zákazníkov/deň | +15 |

### 6.10 Bufet
- Lacný, rýchly, nižšia prestíž (presné čísla doladiť neskôr — podobná kategória ako bar/obchod)

### 6.11 Zasnežovanie (progresia od potoka po veľkú umelú nádrž)

| Typ | Cena | Výstavba (herný čas) | Pokrytie (km zjazdovky) | Údržba/mes | Prestíž |
|---|---|---|---|---|---|
| Čerpanie z potoka (základné delá) | 250 000 € | 2 mesiace | 3 km | 1 200 € | +10 |
| Malá nádrž + delá | 700 000 € | 5 mesiacov | 8 km | 3 000 € | +30 |
| Stredná nádrž + automatický systém | 1 800 000 € | 9 mesiacov | 18 km | 6 500 € | +60 |
| Veľká umelá nádrž + plne automatický systém | 3 500 000 € | 14 mesiacov | 35 km | 11 000 € | +110 |

Prepojenie s počasím (plánované, neimplementované): bez dostatočného zasnežovania klesá spokojnosť/kapacita v sezónach s málo prírodným snehom. Lepšie zasnežovanie = menšia závislosť od počasia.

---

## 6.12 Zamestnanci

Každá budova potrebuje na plnú prevádzku určitý počet zamestnancov (napr. Vlek 3, Pevná sedačková lanovka 5, Ratrak Kompakt 1, Malé parkovisko 1, Bar 2 — presné čísla v `lib/katalog.js`).

- Hráč najíma zamestnancov za jednorazový poplatok (3 000 € / osoba), platí im plat priebežne (3 €/hod na osobu, herný čas).
- Ak má hráč menej najatých ľudí, než súčet vyžadujú jeho hotové budovy, všetky budovy s vlastným príjmom bežia na **zníženú efektivitu** (pomer najatí/potrební, max. 100 %).
- Zamestnancov možno kedykoľvek prepustiť (bez poplatku).

**Ročné vyjednávanie o plat (kalendárne, spoločné pre všetkých hráčov):**
- Okno na vyjednávanie: **23.–31. december** každého roka.
- Zamestnanci žiadajú zvýšenie o 5 %. Hráč má 3 možnosti:
  - Prijať celé (+5 % k platu trvalo, 100 % výkon)
  - Ponúknuť polovicu (+2,5 % k platu, 90 % výkon počas trestu)
  - Odmietnuť (plat sa nemení, 80 % výkon počas trestu)
- Nový plat platí od **1. januára**. Znížený výkon (ak nebolo prijaté celé zvýšenie) trvá **do 31. januára**, potom sa automaticky vráti na 100 % bez ohľadu na to, či bolo pridané.
- Znížený výkon ovplyvňuje **rovnako príjem aj prestíž** (turisti si všímajú horšiu prevádzku).

---

## 7. Ekonomický model (dopyt/ponuka)


- Hráč si **sám nastavuje cenu** každej služby (parkovné, ubytovanie, lístok).
- Počet turistov reaguje na cenu: **nižšia cena → viac turistov** (do limitu kapacity budovy), **vyššia cena → menej turistov, ale vyšší zisk z každého**.
- Príjem sa počíta priebežne (aj keď hráč nie je online) na základe uplynutého času od posledného prihlásenia.

---

## 8. Denná zábava / dôvod vracať sa (zatiaľ v návrhu, neimplementované)

Problém: dlhé stavebné časy (mesiace) samy o sebe nedávajú dôvod prihlasovať sa denne. Možné riešenia do budúcna (netreba hneď v MVP):

1. Denný/ranný "report" strediska (turisti, tržby, počasie) — podobne ako výsledok zápasu v Hockeyarena
2. Počasie ovplyvňujúce denný dopyt
3. Ceny/akcie konkurencie v lige
4. Náhodné krátkodobé udalosti/incidenty (porucha, sťažnosti, žiadosť o zľavu)
5. Marketingové kampane/dočasné boosty
6. Priebeh výstavby viditeľný ako % hotovosti (dôvod občas skontrolovať aj počas dlhej stavby)

**Rozhodnutie:** Toto sa nebude riešiť v prvej verzii. Najprv sa dokončí a otestuje základná ekonomika s malou skupinou hráčov (cieľ ~100 aktívnych hráčov, nie desaťtisíce), a tieto mechaniky sa pridajú podľa reálnej spätnej väzby.

---

## 9. Monetizácia (naznačené, riešiť až neskôr)

- Možnosť dokúpiť **1 extra slot** každého typu budovy (parkovisko/hotel/lanovka) za reálne peniaze.
- Prémiové vybavenie (napr. Pistenwolf Elite ratrak) za reálne peniaze — malá výhoda (pohodlie), **nie pay-to-win**.
- Dôležité pravidlo: monetizácia nesmie dať platiacim hráčom drvivú výhodu — max. stropy na nákupy, len mierne lepšie parametre.

---

## 10. Prehľad technického stacku (pre referenciu)

- Frontend + backend: Next.js (App Router)
- Databáza: Supabase (PostgreSQL) + Supabase Auth
- Hosting: Vercel
- Tabuľky zatiaľ: `stanice` (hráč, peniaze, level, last_update), `budovy` (typ, level, cena, stanica_id)
- Plánované rozšírenie: samostatné tabuľky pre typy lanoviek/ratrakov/parkovísk s cenami, výrobnými značkami a stavom výstavby (dátum dokončenia namiesto okamžitého efektu)

---

## 11. Otvorené otázky / na doladenie neskôr

- Presný vzorec prestíže (váhy jednotlivých zložiek)
- Ako presne funguje vzdialenosť parkoviska od lanovky (mapa/súradnice, alebo len "blízko/ďaleko" kategória?)
- Detailné čísla pre hotel a bufet
- Koľko slotov na budovy má hráč na začiatok a ako sa dá priestor rozširovať
- Presné podmienky postupu/zostupu v lige a frekvencia vyhodnocovania
- Aliančný systém (spoločné projekty, extra priestor, rebríček aliancií)
