/* =========================================================
   L'atelier UF – INSTÄLLNINGAR
   Allt som ofta ändras ligger här: priser, frakt, Swish,
   ordermejl, tavlorna i galleriet och teamet.
   ========================================================= */

/* ---------- PRISER (kr) ----------
   Två produkter: canvastavla och poster. Storlekarna som finns för
   varje produkt styrs av listan nedan – lägg till/ta bort fritt.
   Samma priser gäller för galleriets motiv och egen design. */
const PRISER = {
  canvas: {
    "30x40": 410,
    "40x50": 530,
    "50x70": 650
  },
  poster: {
    "50x70": 280,
    "70x100": 410
  }
};

/* ---------- FRAKT (kr per beställning) ----------
   0 = gratis frakt. Skriv t.ex. 99 om frakten ska kosta något. */
const FRAKT = 0;

/* ---------- SWISH ----------
   Byt "KOMMER" mot företagets Swish-nummer, t.ex. "1231234567". */
const SWISH_NUMMER = "KOMMER";

/* ---------- ORDERMEJL ----------
   Beställningar skickas till den här adressen via FormSubmit (formsubmit.co).
   Inget konto eller lösenord behövs. Första gången någon beställer får
   adressen ett mejl från FormSubmit – klicka "Activate Form" en gång,
   sedan kommer alla ordrar fram. */
const ORDER_EPOST = "latelier2027@gmail.com";

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
    { id: "stad-bat", bild: "images/bat.jpeg", titel: { sv: "Fartyg i Göteborgs hamn", en: "Ship in Gothenburg harbour" } },
    { id: "stad-london", bild: "images/london.jpeg", titel: { sv: "London", en: "London" } },
    { id: "stad-london2", bild: "images/london2.jpeg", titel: { sv: "Big Ben", en: "Big Ben" } },
    { id: "stad-paris", bild: "images/paris.jpeg", titel: { sv: "Paris", en: "Paris" } },
    { id: "stad-paris2", bild: "images/paris2.jpeg", titel: { sv: "Eiffeltornet", en: "The Eiffel Tower" } },
    { id: "stad-paris3", bild: "images/paris3.jpeg", titel: { sv: "Paris i solnedgång", en: "Paris at sunset" } },
    { id: "stad-newyork", bild: "images/newyork.jpeg", titel: { sv: "New York", en: "New York" } },
    { id: "stad-houston", bild: "images/houston.jpeg", titel: { sv: "New York om natten", en: "New York by night" } }
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
