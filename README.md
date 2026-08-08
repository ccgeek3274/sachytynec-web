# Web šachového oddílu TJ JAWA Brodce

Statický web pro **www.sachytynec.cz**. Postavený na [Astro](https://astro.build),
texty jsou v Markdownu a dají se editovat v prohlížeči přes
[Pages CMS](https://pagescms.org) — bez znalosti gitu a bez instalace čehokoli.

Web nemá blog ani redakční systém. Obsahuje jen informace, které se mění párkrát
do roka. **Výsledky, tabulky ani soupisky se sem nepřepisují** — odkazuje se
na databázi Šachového svazu ČR (db.chess.cz), kde jsou vždy aktuální.

Součást rodiny aplikací pod sachytynec.cz:
rozcestník [app.sachytynec.cz](https://app.sachytynec.cz),
prohlížeč partií [pgn.sachytynec.cz](https://pgn.sachytynec.cz).

---

## Obsah

- [Lokální spuštění](#lokální-spuštění)
- [Kde se edituje obsah](#kde-se-edituje-obsah)
- [Nasazení na Cloudflare Pages](#nasazení-na-cloudflare-pages)
- [Napojení Pages CMS](#napojení-pages-cms)
- [Doména www.sachytynec.cz](#doména-wwwsachytyneccz)
- [Jak přidat novou stránku](#jak-přidat-novou-stránku)

---

## Lokální spuštění

Potřebujete [Node.js](https://nodejs.org) 22.12 nebo novější (vyžaduje ho Astro).

```bash
npm install     # jednorázově, stáhne závislosti
npm run dev     # spustí web na http://localhost:4321
```

Změny v souborech se projeví hned, stačí přepnout do prohlížeče.

Další příkazy:

```bash
npm run build     # vygeneruje hotový web do složky dist/
npm run preview   # ukáže, jak bude vypadat výsledek z dist/
npm run check     # zkontroluje, jestli v obsahu nechybí povinné pole
```

---

## Kde se edituje obsah

| Co chcete změnit | Soubor |
| --- | --- |
| Text stránek (Domů, O oddíle, Trénink, Družstva, Kontakt) | `src/content/stranky/*.md` |
| Družstva a odkazy na jejich výsledky | `src/content/druzstva/*.md` |
| Kontaktní osoby | `src/content/kontakty/*.md` |
| Adresa herny, e-mail, odkazy v patičce | `src/data/nastaveni.json` |
| Logo a favicona | `public/logo.svg`, `public/favicon.svg` |
| Obrázek při sdílení odkazu | `public/nahled.png` (1200 × 630 px) |
| Barvy, písma, vzhled | `src/styles/global.css` |

Každý soubor v `src/content/stranky/` má nahoře mezi `---` takzvaný frontmatter —
pole, která řídí titulek, adresu a pozici v menu. Pod ním je normální text
v Markdownu. Adresu stránky určuje pole `slug`, ne název souboru.

Struktura polí je popsaná dvakrát a obě musí souhlasit:

- `src/content.config.ts` — kontrola při buildu (chybějící povinné pole shodí build)
- `.pages.yml` — jak pole vypadají v editoru Pages CMS

Když přidáváte nové pole, doplňte ho do obou souborů.

---

## Nasazení na Cloudflare Pages

Předpoklad: repozitář je nahraný na GitHubu.

**Hotovo, nic nastavovat nemusíte.** Projekt už na Cloudflare Pages existuje
a je napojený na tento repozitář:

| Položka | Hodnota |
| --- | --- |
| Projekt | `sachytynec-web` |
| Zkušební adresa | https://sachytynec-web.pages.dev |
| Produkční větev | `main` |
| Build command | `npm run build` |
| Build output directory | `dist` |
| Verze Node | z `.node-version` (22) |

Web se sestaví sám při každém commitu do `main` — tedy i po každé úpravě
z Pages CMS. Nasazení trvá zhruba minutu. Commity do jiných větví vytvoří
náhledovou adresu, produkci neovlivní.

Stav nasazení uvidíte v Cloudflare dashboardu ve **Workers & Pages →
sachytynec-web → Deployments**.

Web je čistě statický, **žádné serverové funkce (Workers/Functions) nepotřebuje.**

---

## Napojení Pages CMS

Pages CMS je editor, který se tváří jako běžný redakční systém, ale ve
skutečnosti jen commituje do gitu. Co v repu popisuje `.pages.yml`, to jde
editovat.

1. Otevřete [app.pagescms.org](https://app.pagescms.org) a přihlaste se
   **účtem GitHub**.
2. Povolte Pages CMS přístup k tomuto repozitáři
   (**Only select repositories** → vyberte jen tento).
3. V seznamu vyberte repozitář a větev `main`.
4. Pages CMS si sám načte `.pages.yml` a nabídne čtyři sekce:
   **Stránky**, **Družstva**, **Kontaktní osoby**, **Nastavení webu**.

Uložení v CMS = commit do `main` = automatický redeploy na Cloudflare Pages.
Změna je na webu vidět zhruba do minuty.

Editorům stačí dát na GitHubu roli **Write** k tomuto repozitáři, nic víc.

> **Pozor:** pole `slug` u stránky je její adresa. Když ho změníte,
> stará adresa přestane fungovat. U pěti stávajících stránek ho neměňte.
> Hodnota `domu` je vyhrazená pro úvodní stránku.

---

## Doména www.sachytynec.cz

Zatím web běží jen na zkušební adrese `sachytynec-web.pages.dev`.
Ostrou doménu přidáte takto:

1. V projektu `sachytynec-web` otevřete **Custom domains → Set up a custom
   domain** a zadejte `www.sachytynec.cz`.
2. Pokud je doména `sachytynec.cz` spravovaná ve stejném účtu Cloudflare,
   DNS záznam (CNAME na `<projekt>.pages.dev`) se vytvoří automaticky.
   Jinak ho přidejte ručně u svého DNS poskytovatele.
3. Certifikát se vystaví sám, obvykle do pár minut.

**Přesměrování z holé domény** (`sachytynec.cz` → `www.sachytynec.cz`) se
nastavuje v Cloudflare v **Rules → Redirect Rules**: nové pravidlo,
*If* hostname equals `sachytynec.cz`, *Then* dynamic redirect 301 na
`concat("https://www.sachytynec.cz", http.request.uri.path)`.

Adresa webu je zadrátovaná v `astro.config.mjs` (`site`) — používá se pro
sitemapu a kanonické odkazy. Při změně domény upravte i ji a `public/robots.txt`.

---

## Jak přidat novou stránku

Přes Pages CMS: **Stránky → Add entry**. Vyplňte titulek, adresu (`slug`,
malá písmena bez diakritiky), název a pořadí v menu. Stránka se sama objeví
v navigaci i na rozcestníku na úvodní stránce.

Ručně: nový soubor v `src/content/stranky/`, například:

```markdown
---
titulek: Turnaje
slug: turnaje
nazev_v_menu: Turnaje
poradi_v_menu: 6
zobrazit_v_menu: true
perex: Jednodenní turnaje, které v Týnci pořádáme.
sekce: zadna
---

Text stránky v Markdownu.
```

Pole `sekce` umí pod text připojit generovaný blok: `druzstva` (přehled týmů)
nebo `kontakty` (lidé a adresa). Většina stránek má `zadna`.

---

## Poznámky k technickému stavu

Ověřeno při vzniku webu:

- build i `npm run check` procházejí bez chyb a varování,
- automatický audit přístupnosti (axe-core, WCAG 2.1 AA) nehlásí na žádné
  stránce nic — v šířce 1280 px i 390 px,
- layout nepřetéká ani na 320 px,
- `prefers-reduced-motion: reduce` vypne přechody i plynulé posouvání,
- chybný zápis pole `slug` shodí build s českou hláškou, takže se špatná
  adresa nedostane na web.

Hotový web má kolem 200 kB včetně náhledového obrázku a neobsahuje žádný
JavaScript. Jediná externí závislost za běhu jsou písma z Google Fonts.

Údaje o oddíle se do hlavičky stránek vypisují i strukturovaně
(schema.org `SportsOrganization`) — berou se z `nastaveni.json`, takže se
o ně není potřeba starat zvlášť.
