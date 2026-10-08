/* =========================================================
   L'atelier UF – INSTÄLLNINGAR
   Allt som ofta ändras ligger här: priser, frakt, Swish,
   EmailJS och tavlorna i galleriet.
   ========================================================= */

/* ---------- PRISER (kr) ----------
   PLATSHÅLLARE – fyll i riktiga priser.
   standard = färdiga motiv från galleriet
   egen     = egen design (uppladdad bild, citat eller idé) */
const PRISER = {
  standard: {
    "30x40": 299,
    "40x50": 399,
    "50x70": 549,
    "70x100": 849
  },
  egen: {
    "30x40": 349,
    "40x50": 449,
    "50x70": 649,
    "70x100": 949
  }
};

/* ---------- FRAKT (kr per storlek) ----------
   Sätt FRAKT_AKTIV = false för att stänga av frakt helt
   (då finns bara "Mötas upp" i kassan).
   FRAKT_BERAKNING:
     "per_tavla" – fraktpriset räknas för varje tavla i ordern
     "storsta"   – bara den största tavlans fraktpris räknas */
const FRAKT_AKTIV = true;
const FRAKT_BERAKNING = "per_tavla";
const FRAKT = {
  "30x40": 129,
  "40x50": 169,
  "50x70": 189,
  "70x100": 349
};

/* ---------- STORLEKAR (cm, bredd x höjd i stående format) ---------- */
const STORLEKAR = ["30x40", "40x50", "50x70", "70x100"];

/* ---------- SWISH ----------
   Byt "KOMMER" mot företagets Swish-nummer, t.ex. "1231234567". */
const SWISH_NUMMER = "KOMMER";

/* ---------- EMAILJS ----------
   1. Skapa konto på https://www.emailjs.com
   2. Lägg till en e-posttjänst (Gmail) → SERVICE_ID
   3. Skapa en mall (template) → TEMPLATE_ID. Variabler som skickas:
      {{order_nummer}} {{namn}} {{epost}} {{telefon}} {{adress}}
      {{leverans}} {{rader}} {{delsumma}} {{frakt}} {{totalt}}
      {{meddelande}} {{sprak}} {{till_epost}}
   4. Account → Public key → PUBLIC_KEY */
const EMAILJS = {
  PUBLIC_KEY: "DIN_PUBLIC_KEY",
  SERVICE_ID: "DIN_SERVICE_ID",
  TEMPLATE_ID: "DIN_TEMPLATE_ID",
  TILL_EPOST: "latelier2027@gmail.com"
};

/* ---------- KONTAKT ---------- */
const KONTAKT = {
  epost: "latelier2027@gmail.com",
  telefon: "070-249 61 89",
  telefonLank: "+46702496189",
  instagram: "l.atelieruf",
  tiktok: "latelier.uf"
};

/* ---------- TAVLOR I GALLERIET ----------
   Lägg bilderna i /images/tavlor/ med samma filnamn som nedan,
   så byts platshållarna automatiskt ut. Lägg till/ta bort rader fritt.
   titel: { sv, en } */
const TAVLOR = {
  stad: [
    { id: "stad-1", bild: "images/tavlor/stad-1.jpg", titel: { sv: "Gamla stan i skymning", en: "Old Town at dusk" } },
    { id: "stad-2", bild: "images/tavlor/stad-2.jpg", titel: { sv: "New York, svartvitt", en: "New York, black & white" } },
    { id: "stad-3", bild: "images/tavlor/stad-3.jpg", titel: { sv: "Paris om natten", en: "Paris by night" } },
    { id: "stad-4", bild: "images/tavlor/stad-4.jpg", titel: { sv: "Regn i Tokyo", en: "Rain in Tokyo" } },
    { id: "stad-5", bild: "images/tavlor/stad-5.jpg", titel: { sv: "Hamnen", en: "The harbour" } },
    { id: "stad-6", bild: "images/tavlor/stad-6.jpg", titel: { sv: "Gränd i Rom", en: "Alley in Rome" } }
  ],
  natur: [
    { id: "natur-1", bild: "images/tavlor/natur-1.jpg", titel: { sv: "Fjällsjö", en: "Mountain lake" } },
    { id: "natur-2", bild: "images/tavlor/natur-2.jpg", titel: { sv: "Dimmig skog", en: "Misty forest" } },
    { id: "natur-3", bild: "images/tavlor/natur-3.jpg", titel: { sv: "Hav i storm", en: "Stormy sea" } },
    { id: "natur-4", bild: "images/tavlor/natur-4.jpg", titel: { sv: "Torkade blommor", en: "Dried flowers" } },
    { id: "natur-5", bild: "images/tavlor/natur-5.jpg", titel: { sv: "Ökendyner", en: "Desert dunes" } },
    { id: "natur-6", bild: "images/tavlor/natur-6.jpg", titel: { sv: "Norrsken", en: "Northern lights" } }
  ],
  portratt: [
    { id: "portratt-1", bild: "images/tavlor/portratt-1.jpg", titel: { sv: "Kvinna i profil", en: "Woman in profile" } },
    { id: "portratt-2", bild: "images/tavlor/portratt-2.jpg", titel: { sv: "Linjeporträtt", en: "Line portrait" } },
    { id: "portratt-3", bild: "images/tavlor/portratt-3.jpg", titel: { sv: "Klassiskt porträtt", en: "Classic portrait" } },
    { id: "portratt-4", bild: "images/tavlor/portratt-4.jpg", titel: { sv: "Skuggspel", en: "Shadow play" } }
  ],
  religion: [
    { id: "religion-1", bild: "images/tavlor/religion-1.jpg", titel: { sv: "Ljus i kyrkan", en: "Light in the church" } },
    { id: "religion-2", bild: "images/tavlor/religion-2.jpg", titel: { sv: "Kalligrafi", en: "Calligraphy" } },
    { id: "religion-3", bild: "images/tavlor/religion-3.jpg", titel: { sv: "Händer i bön", en: "Praying hands" } },
    { id: "religion-4", bild: "images/tavlor/religion-4.jpg", titel: { sv: "Mosaik", en: "Mosaic" } }
  ],
  djur: [
    { id: "djur-1", bild: "images/tavlor/djur-1.jpg", titel: { sv: "Lejonet", en: "The lion" } },
    { id: "djur-2", bild: "images/tavlor/djur-2.jpg", titel: { sv: "Häst i motljus", en: "Horse in backlight" } },
    { id: "djur-3", bild: "images/tavlor/djur-3.jpg", titel: { sv: "Räv i snö", en: "Fox in snow" } },
    { id: "djur-4", bild: "images/tavlor/djur-4.jpg", titel: { sv: "Örnen", en: "The eagle" } },
    { id: "djur-5", bild: "images/tavlor/djur-5.jpg", titel: { sv: "Elefantfamilj", en: "Elephant family" } }
  ],
  film: [
    { id: "film-1", bild: "images/tavlor/film-1.jpg", titel: { sv: "Klassisk filmaffisch", en: "Classic movie poster" } },
    { id: "film-2", bild: "images/tavlor/film-2.jpg", titel: { sv: "Ikonisk scen", en: "Iconic scene" } },
    { id: "film-3", bild: "images/tavlor/film-3.jpg", titel: { sv: "Seriefigur", en: "Comic character" } },
    { id: "film-4", bild: "images/tavlor/film-4.jpg", titel: { sv: "Minimalistisk affisch", en: "Minimalist poster" } }
  ]
};

/* ---------- TEAMET ----------
   Lägg bilder i /images/team/ (kvadratiska blir bäst). */
const TEAM = [
  { bild: "images/team/emil.jpg",     namn: "Emil Nilsson",              roll: { sv: "VD", en: "CEO" } },
  { bild: "images/team/jonathan.jpg", namn: "Jonathan Lampén Helgesson", roll: { sv: "Vice VD & marknadsansvarig", en: "Deputy CEO & Head of Marketing" } },
  { bild: "images/team/sixten.jpg",   namn: "Sixten Skoog",              roll: { sv: "Ekonomiansvarig", en: "Head of Finance" } },
  { bild: "images/team/shaghaeq.jpg", namn: "Shaghaeq Ahmadi",           roll: { sv: "Försäljnings- & personalansvarig", en: "Head of Sales & HR" } },
  { bild: "images/team/hugo.jpg",     namn: "Hugo Silva",                roll: { sv: "Produktansvarig", en: "Head of Product" } },
  { bild: "images/team/baraa.jpg",    namn: "Baraa Hamid",               roll: { sv: "Administratör & hållbarhetsansvarig", en: "Administrator & Head of Sustainability" } }
];
