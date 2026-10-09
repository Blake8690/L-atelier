/* =========================================================
   L'atelier UF – KASSA
   Varukorg → uppgifter → leverans → beställ → Swish.
   ========================================================= */

const escK = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let step = 1;
let delivery = FRAKT_AKTIV ? "frakt" : "mote";
let customer = {};

/* ---------------- Beräkningar ---------------- */
function subtotal(cart) { return cart.reduce((s, i) => s + itemPrice(i) * i.antal, 0); }

function shippingFor(cart) {
  if (!FRAKT_AKTIV || !cart.length) return 0;
  if (FRAKT_BERAKNING === "storsta") {
    return Math.max(...cart.map(i => Number(FRAKT[i.storlek]) || 0));
  }
  return cart.reduce((s, i) => s + (Number(FRAKT[i.storlek]) || 0) * i.antal, 0);
}

function shippingChosen(cart) { return delivery === "frakt" ? shippingFor(cart) : 0; }

/* ---------------- Beskrivning av en rad ---------------- */
function itemTitle(item) {
  if (item.typ === "standard") return item.titel[LANG] || item.titel.sv;
  return t("egen.type");
}

function itemDetail(item) {
  if (item.typ === "standard") return t("modal.std");
  if (item.lage === "upload") return `${t("item.upload")}${item.filnamn ? " · " + item.filnamn : ""}`;
  if (item.lage === "quote") return `${t("item.quote")}: "${item.citat}"${item.forfattare ? " " + item.forfattare : ""}`;
  return `${t("item.idea")}: ${item.ide}`;
}

function itemThumb(item) {
  if (item.typ === "standard") {
    return `<div class="cart-thumb"><img src="${escK(item.bild)}" alt="" data-ph="" data-hue="40"></div>`;
  }
  if (item.lage === "upload" && item.thumb) return `<div class="cart-thumb"><img src="${item.thumb}" alt=""></div>`;
  if (item.lage === "quote") {
    return `<div class="cart-thumb quote" style="background:${escK(item.bakgrund)};color:${escK(item.farg)};font-family:${escK(item.fontCss)};font-style:${escK(item.fontStyle)}">${escK(item.citat.slice(0, 40))}</div>`;
  }
  return `<div class="cart-thumb">${placeholderHTML("")}</div>`;
}

/* ---------------- Rendera varukorg ---------------- */
function renderCart() {
  const cart = getCart();
  const list = document.getElementById("cart-list");
  const empty = cart.length === 0;
  document.getElementById("cart-empty").hidden = !empty;
  document.getElementById("cart-nav").hidden = empty;
  list.hidden = empty;

  list.innerHTML = cart.map(item => {
    const opts = STORLEKAR.map(s => `<option value="${s}" ${s === item.storlek ? "selected" : ""}>${sizeLabel(s, item.orient)}</option>`).join("");
    const shipLine = FRAKT_AKTIV ? `<span class="cart-line-ship">+ ${t("kassa.shipping").toLowerCase()} ${formatPrice((Number(FRAKT[item.storlek]) || 0) * item.antal)}</span>` : "";
    return `<li class="cart-item" data-id="${item.id}">
      ${itemThumb(item)}
      <div>
        <div class="cart-name">${escK(itemTitle(item))}</div>
        <div class="cart-sub"><span class="tag">${escK(sizeLabel(item.storlek, item.orient))}</span>${escK(itemDetail(item))}</div>
        ${item.typ === "egen" && item.lage === "upload" ? `<div class="cart-sub">✉ ${escK(t("item.mailimage"))}</div>` : ""}
        <div class="cart-controls">
          <div class="qty" aria-label="${escK(t("kassa.qty"))}">
            <button type="button" data-act="minus" aria-label="−">−</button>
            <span>${item.antal}</span>
            <button type="button" data-act="plus" aria-label="+">+</button>
          </div>
          <label class="sr-only" for="size-${item.id}">${escK(t("kassa.size"))}</label>
          <select class="select" id="size-${item.id}" data-act="size">${opts}</select>
          <button type="button" class="remove-btn" data-act="remove">${escK(t("kassa.remove"))}</button>
        </div>
      </div>
      <div class="cart-line-price">${formatPrice(itemPrice(item) * item.antal)}${shipLine}</div>
    </li>`;
  }).join("");
  initPlaceholders(list);
  renderSummary();

  // Tom varukorg → stanna på steg 1
  if (empty && step !== 1) goTo(1);
}

function renderSummary() {
  const cart = getCart();
  const sub = subtotal(cart);
  // I varukorgen och uppgiftssteget visas frakten redan; i leveranssteget efter valt alternativ
  const ship = step === 3 ? shippingChosen(cart) : shippingFor(cart);
  document.getElementById("sum-sub").textContent = formatPrice(sub);
  document.getElementById("sum-ship").textContent = ship === 0 && cart.length && (!FRAKT_AKTIV || (step === 3 && delivery === "mote")) ? t("kassa.shipping.free") : formatPrice(ship);
  document.getElementById("sum-total").textContent = formatPrice(sub + ship);
  document.getElementById("sum-note").hidden = !FRAKT_AKTIV || step === 3;
  document.getElementById("ship-cost").textContent = formatPrice(shippingFor(cart));
  const hasUpload = cart.some(i => i.typ === "egen" && i.lage === "upload");
  document.getElementById("image-mail-note").hidden = !hasUpload;
}

function onCartClick(e) {
  const btn = e.target.closest("[data-act]");
  if (!btn || btn.tagName === "SELECT") return;
  const id = btn.closest(".cart-item").dataset.id;
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  const act = btn.dataset.act;
  if (act === "plus") item.antal = Math.min(99, item.antal + 1);
  if (act === "minus") item.antal -= 1;
  const next = act === "remove" || item.antal < 1 ? cart.filter(i => i.id !== id) : cart;
  saveCart(next);
  renderCart();
}

function onCartChange(e) {
  if (e.target.dataset.act !== "size") return;
  const id = e.target.closest(".cart-item").dataset.id;
  const cart = getCart();
  const item = cart.find(i => i.id === id);
  if (!item) return;
  item.storlek = e.target.value;
  saveCart(cart);
  renderCart();
}

/* ---------------- Steg ---------------- */
function goTo(n) {
  if (n > 1 && getCart().length === 0) n = 1;
  step = n;
  document.querySelectorAll(".step-panel").forEach(p => { p.hidden = Number(p.dataset.step) !== n; });
  document.querySelectorAll("#steps li").forEach((li, i) => {
    li.classList.toggle("active", i + 1 === n);
    li.classList.toggle("done", i + 1 < n);
    if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
  });
  renderSummary();
  const top = document.getElementById("steps").getBoundingClientRect().top + window.scrollY - 110;
  if (window.scrollY > top) window.scrollTo({ top, behavior: REDUCED_MOTION ? "auto" : "smooth" });
}

/* ---------------- Formulär ---------------- */
function validateDetails() {
  const form = document.getElementById("details-form");
  let firstBad = null;
  form.querySelectorAll("[required]").forEach(input => {
    const v = input.value.trim();
    const bad = !v || (input.type === "email" && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v));
    input.closest(".field").classList.toggle("invalid", bad);
    input.setAttribute("aria-invalid", String(bad));
    if (bad && !firstBad) firstBad = input;
  });
  if (firstBad) { firstBad.focus(); return false; }
  customer = Object.fromEntries([...new FormData(form)].map(([k, v]) => [k, String(v).trim()]));
  store.set("latelier-customer", customer);
  return true;
}

function restoreCustomer() {
  const saved = store.get("latelier-customer", null);
  if (!saved) return;
  const form = document.getElementById("details-form");
  Object.entries(saved).forEach(([k, v]) => { if (form.elements[k] && k !== "meddelande") form.elements[k].value = v; });
}

/* ---------------- Order ---------------- */
function orderNumber() {
  const d = new Date();
  const ymd = String(d.getFullYear()).slice(2) + String(d.getMonth() + 1).padStart(2, "0") + String(d.getDate()).padStart(2, "0");
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let r = "";
  const rnd = new Uint32Array(4);
  (window.crypto || window.msCrypto).getRandomValues(rnd);
  rnd.forEach(n => { r += chars[n % chars.length]; });
  return `LA${ymd}-${r}`;
}

// En rad per tavla i klartext (alltid på svenska, så att mejlet blir lätt att läsa)
function orderLines(cart) {
  return cart.map(item => {
    const size = sizeLabel(item.storlek, item.orient);
    const price = itemPrice(item) * item.antal;
    let line;
    if (item.typ === "standard") {
      line = `Standardtavla: ${item.titel.sv} (${item.kategori}, id ${item.motivId})`;
    } else if (item.lage === "upload") {
      line = `Egen design – uppladdad bild: ${item.filnamn || "-"} (${item.pixlar || "?"} px)` +
        `${item.lagUpplosning ? " [VARNING: låg upplösning]" : ""} – kunden mejlar bilden. Rättigheter bekräftade: ja`;
    } else if (item.lage === "quote") {
      line = `Egen design – citat: "${item.citat}"${item.forfattare ? " " + item.forfattare : ""} | Typsnitt: ${item.font} | Textfärg: ${item.farg} | Bakgrund: ${item.bakgrund}`;
    } else {
      line = `Egen design – idé: ${item.ide}`;
    }
    return `${line} | Storlek: ${size} | Antal: ${item.antal} | Pris: ${price} kr`;
  });
}

/* Ordern skickas via FormSubmit (formsubmit.co) till ORDER_EPOST.
   Första gången skickar FormSubmit ett aktiveringsmejl till den adressen –
   klicka på "Activate Form" i det mejlet, sedan kommer alla ordrar fram. */
async function sendOrderEmail(fields) {
  try {
    const res = await fetch(`https://formsubmit.co/ajax/${ORDER_EPOST}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "Accept": "application/json" },
      body: JSON.stringify(fields)
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok || String(data.success) !== "true") {
      console.error("[L'atelier] Ordern kunde inte mejlas:", data.message || res.status);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[L'atelier] Ordern kunde inte mejlas:", err);
    return false;
  }
}

async function placeOrder() {
  const cart = getCart();
  if (!cart.length) { goTo(1); return; }
  if (!customer.namn && !validateDetails()) { goTo(2); return; }

  const btn = document.getElementById("place-order");
  btn.disabled = true;
  btn.querySelector("span").textContent = t("kassa.sending");

  const nr = orderNumber();
  const sub = subtotal(cart);
  const ship = shippingChosen(cart);
  const total = sub + ship;
  const hasUpload = cart.some(i => i.typ === "egen" && i.lage === "upload");

  // Fältnamnen blir rubrikerna i mejlet
  const fields = {
    _subject: `Ny beställning ${nr} – ${total} kr`,
    _template: "table",
    _captcha: "false",
    _replyto: customer.epost,
    "Ordernummer": nr,
    "Namn": customer.namn,
    "E-post": customer.epost,
    "Telefon": customer.telefon,
    "Adress": `${customer.adress}, ${customer.postnummer} ${customer.ort}`,
    "Leverans": delivery === "frakt" ? `Frakt (${ship} kr)` : "Mötas upp – kontakta kunden om plats"
  };
  orderLines(cart).forEach((line, i) => { fields[`Tavla ${i + 1}`] = line; });
  Object.assign(fields, {
    "Delsumma": `${sub} kr`,
    "Frakt": `${ship} kr`,
    "Totalt att betala": `${total} kr`,
    "Meddelande": customer.meddelande || "-",
    "Bild mejlas separat": hasUpload ? "JA – kunden mejlar sin bild med ordernumret" : "Nej",
    "Språk på sidan": LANG
  });

  const ok = await sendOrderEmail(fields);
  saveCart([]);
  showConfirmation({ nr, total, hasUpload, mailFailed: !ok });
}

/* ---------------- Bekräftelse + Swish ---------------- */
function showConfirmation({ nr, total, hasUpload, mailFailed }) {
  document.getElementById("checkout-flow").hidden = true;
  const box = document.getElementById("confirm");
  box.hidden = false;
  document.getElementById("c-order").textContent = nr;
  document.getElementById("c-total").textContent = formatPrice(total);

  const swishMsg = `Order ${nr}`;
  const ready = SWISH_NUMMER && SWISH_NUMMER !== "KOMMER";
  document.getElementById("swish-ready").hidden = !ready;
  document.getElementById("swish-pending").hidden = ready;
  document.getElementById("c-swish-pending").textContent = SWISH_NUMMER;

  if (ready) {
    const number = SWISH_NUMMER.replace(/\D/g, "");
    document.getElementById("c-swish").textContent = SWISH_NUMMER;
    document.getElementById("c-msg").textContent = swishMsg;
    // Mobil: förifylld Swish-länk
    document.getElementById("swish-btn").href =
      `https://app.swish.nu/1/p/sw/?sw=${encodeURIComponent(number)}&amt=${total}&cur=SEK&msg=${encodeURIComponent(swishMsg)}&src=qr`;
    // Dator: QR-kod i Swish-format (C<nummer>;<belopp>;<meddelande>;<låsta fält>)
    const qr = document.getElementById("qr");
    qr.innerHTML = "";
    if (typeof QRCode !== "undefined") {
      new QRCode(qr, { text: `C${number};${total};${swishMsg};0`, width: 200, height: 200, colorDark: "#0b0b0b", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
    }
  }

  const img = document.getElementById("c-image");
  img.hidden = !hasUpload;
  if (hasUpload) img.innerHTML = t("confirm.image", { order: escK(nr) });
  document.getElementById("c-meet").hidden = delivery !== "mote";
  document.getElementById("c-mail-error").hidden = !mailFailed;

  // Spara så att texten kan översättas vid språkbyte
  showConfirmation.last = { nr, total, hasUpload, mailFailed };
  window.scrollTo({ top: 0, behavior: REDUCED_MOTION ? "auto" : "smooth" });
  box.focus({ preventScroll: true });
}

/* ---------------- Start ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (!FRAKT_AKTIV) {
    document.getElementById("opt-ship").hidden = true;
    document.querySelector('input[name="leverans"][value="mote"]').checked = true;
  }
  restoreCustomer();
  renderCart();

  const list = document.getElementById("cart-list");
  list.addEventListener("click", onCartClick);
  list.addEventListener("change", onCartChange);

  document.querySelectorAll("[data-goto]").forEach(b => b.addEventListener("click", () => goTo(Number(b.dataset.goto))));

  const form = document.getElementById("details-form");
  form.addEventListener("submit", e => { e.preventDefault(); if (validateDetails()) goTo(3); });
  form.addEventListener("input", e => {
    const f = e.target.closest(".field");
    if (f && f.classList.contains("invalid")) { f.classList.remove("invalid"); e.target.removeAttribute("aria-invalid"); }
  });

  document.querySelectorAll('input[name="leverans"]').forEach(r => r.addEventListener("change", () => {
    delivery = r.value;
    renderSummary();
  }));

  document.getElementById("place-order").addEventListener("click", placeOrder);
  goTo(1);
});

document.addEventListener("langchange", () => {
  if (!document.getElementById("checkout-flow").hidden) renderCart();
  else if (showConfirmation.last) {
    const { nr, hasUpload } = showConfirmation.last;
    document.getElementById("c-total").textContent = formatPrice(showConfirmation.last.total);
    if (hasUpload) document.getElementById("c-image").innerHTML = t("confirm.image", { order: escK(nr) });
  }
});
window.addEventListener("storage", e => { if (e.key === CART_KEY && !document.getElementById("checkout-flow").hidden) renderCart(); });
