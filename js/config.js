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
    { id: "stad-gamlastan", bild: "images/gamlastan.jpeg", titel: { sv: "Gamla stan", en: "Stockholm Old Town" } },
    { id: "stad-stockholm1", bild: "images/stockholm1.jpeg", titel: { sv: "Stockholm", en: "Stockholm" } },
    { id: "stad-stockholm-over", bild: "images/stockholm-over.jpeg", titel: { sv: "Stockholm från ovan", en: "Stockholm from above" } },
    { id: "stad-malmo", bild: "images/malmo.jpeg", titel: { sv: "Malmö", en: "Malmö" } },
    { id: "stad-bat", bild: "images/bat.jpeg", titel: { sv: "Segelfartyget i hamnen", en: "Tall ship in the harbour" } },
    { id: "stad-london", bild: "images/london.jpeg", titel: { sv: "London", en: "London" } },
    { id: "stad-london2", bild: "images/london2.jpeg", titel: { sv: "Big Ben", en: "Big Ben" } },
    { id: "stad-paris", bild: "images/paris.jpeg", titel: { sv: "Paris", en: "Paris" } },
    { id: "stad-paris2", bild: "images/paris2.jpeg", titel: { sv: "Eiffeltornet", en: "The Eiffel Tower" } },
    { id: "stad-paris3", bild: "images/paris3.jpeg", titel: { sv: "Paris i solnedgång", en: "Paris at sunset" } },
    { id: "stad-newyork", bild: "images/newyork.jpeg", titel: { sv: "New York", en: "New York" } },
    { id: "stad-houston", bild: "images/houston.jpeg", titel: { sv: "Houston", en: "Houston" } }
  ],
  natur: [
    { id: "natur-norrsken", bild: "images/norrsken.jpeg", titel: { sv: "Norrsken", en: "Northern lights" } },
    { id: "natur-vattenfall", bild: "images/vattenfall.jpeg", titel: { sv: "Vattenfallet", en: "The waterfall" } },
    { id: "natur-svensk-skog", bild: "images/svensk-skog.jpeg", titel: { sv: "Svensk skog", en: "Swedish forest" } },
    { id: "natur-regnskog", bild: "images/regnskog.jpeg", titel: { sv: "Regnskog", en: "Rainforest" } },
    { id: "natur-savann", bild: "images/savann.jpeg", titel: { sv: "Savann i solnedgång", en: "Savanna at sunset" } }
  ],
  religion: [
    { id: "religion-kors", bild: "images/kors.jpeg", titel: { sv: "Tre kors i solnedgång", en: "Three crosses at sunset" } },
    { id: "religion-mecca", bild: "images/mecca.jpeg", titel: { sv: "Mecka", en: "Mecca" } }
  ],
  djur: [
    { id: "djur-elefant", bild: "images/elefant.jpeg", titel: { sv: "Elefanten", en: "The elephant" } },
    { id: "djur-giraff", bild: "images/giraff.jpeg", titel: { sv: "Giraff i solnedgång", en: "Giraffe at sunset" } },
    { id: "djur-groda", bild: "images/groda.jpeg", titel: { sv: "Grodan", en: "The frog" } },
    { id: "djur-orm", bild: "images/orm.jpeg", titel: { sv: "Ormen", en: "The snake" } }
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
