# L'atelier UF – hemsida

Ren HTML, CSS och JavaScript. Inga byggsteg – öppna `index.html` eller lägg upp mappen på valfritt webbhotell (t.ex. GitHub Pages, Netlify).

## Sidor
| Fil | Innehåll |
|---|---|
| `index.html` | Hem, Om oss (team), FAQ, Kontakt |
| `tavlor.html` | Flikar med galleri + **Skapa egen** (live-mockup på vägg) |
| `kassa.html` | Varukorg → uppgifter → leverans → beställ → Swish |

## Det här ändrar du i `js/config.js`
- `PRISER` – priser för standardtavlor och egen design (platshållare nu)
- `FRAKT`, `FRAKT_AKTIV`, `FRAKT_BERAKNING` – frakt per storlek, stäng av, eller räkna bara största tavlan
- `SWISH_NUMMER` – byt `"KOMMER"` mot riktigt nummer (då visas QR-kod/Swish-knapp)
- `EMAILJS` – `PUBLIC_KEY`, `SERVICE_ID`, `TEMPLATE_ID` (variablerna till mallen står i filen)
- `TAVLOR` – motiv per flik (titel på svenska/engelska + bildväg)
- `TEAM` – namn, roller och bilder

Alla texter (svenska + engelska) ligger i `js/i18n.js`.

## Bilder (`/images`)
Saknas en bild visas automatiskt en snygg platshållare. Lägg in:
- `images/logo.png` – loggan (ersätter SVG-loggan i menyn)
- `images/hero.jpg` – tavlan på startsidan
- `images/tavlor/stad-1.jpg` … `film-4.jpg` – se filnamnen i `TAVLOR`
- `images/team/emil.jpg`, `jonathan.jpg`, `sixten.jpg`, `shaghaeq.jpg`, `hugo.jpg`, `baraa.jpg` – kvadratiska porträtt
