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
    "30x40": 549,
    "40x50": 699,
    "50x70": 899,
    "70x100": 1049
  },
  poster: {
    "50x70": 349,
    "70x100": 549
  }
};

/* ---------- FRAKT (kr per beställning) ----------
   0 = gratis frakt. Skriv t.ex. 99 om frakten ska kosta något. */
const FRAKT = 0;

/* ---------- SWISH ----------
   Företagets Swish-nummer. Mellanslag går bra – de tas bort automatiskt
   i QR-koden och i Swish-knappen. */
const SWISH_NUMMER = "123 717 06 99";

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

/* ---------- SÄSONGSFLIK (tillfällig) ----------
   En extra flik först i galleriet för t.ex. jul, nyår eller alla hjärtans dag.
   – aktiv: true visar fliken, false döljer den.
   – visaFran / visaTill (valfritt, "ÅÅÅÅ-MM-DD"): fliken syns bara mellan
     de datumen. Lämna "" för att visa den hela tiden medan aktiv är true.
   – Byt namn, ikon och bilder inför nästa högtid. Lägg bilderna i
     /images/sasong/ och skriv in filnamnen nedan. */
const SASONG = {
  aktiv: true,
  visaFran: "",
  visaTill: "",
  ikon: "❄",
  namn: { sv: "Jul", en: "Christmas" },
  tavlor: [
    { id: "sasong-1", bild: "images/sasong/jul-1.jpg", titel: { sv: "Julmotiv 1", en: "Christmas motif 1" } },
    { id: "sasong-2", bild: "images/sasong/jul-2.jpg", titel: { sv: "Julmotiv 2", en: "Christmas motif 2" } },
    { id: "sasong-3", bild: "images/sasong/jul-3.jpg", titel: { sv: "Julmotiv 3", en: "Christmas motif 3" } }
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
