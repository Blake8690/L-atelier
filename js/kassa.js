/* =========================================================
   L'atelier UF – KASSA (panel som glider in från höger)
   Varukorg → uppgifter → leverans → beställ → Swish.
   Panelen finns på alla sidor och öppnas med varukorgsikonen.
   ========================================================= */

const escK = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
let step = 1;
let delivery = "frakt";
let customer = {};
let drawerReturnFocus = null;

/* ---------------- Panelens innehåll ---------------- */
const DRAWER_HTML = `
<div class="drawer" id="drawer" aria-hidden="true">
  <div class="drawer-backdrop" data-drawer-close></div>
  <aside class="drawer-panel" role="dialog" aria-modal="true" aria-labelledby="drawer-title">
    <header class="drawer-head">
      <h2 id="drawer-title" data-i18n="kassa.title">Din beställning</h2>
      <button type="button" class="modal-close drawer-close" data-drawer-close data-i18n-aria="modal.close" aria-label="Stäng">×</button>
    </header>

    <div class="drawer-body">
      <div id="checkout-flow">
        <ol class="steps" id="steps">
          <li class="active"><span data-i18n="kassa.step1">Varukorg</span></li>
          <li><span data-i18n="kassa.step2">Uppgifter</span></li>
          <li><span data-i18n="kassa.step3">Leverans</span></li>
        </ol>

        <!-- Steg 1: Varukorg -->
        <div class="step-panel" data-step="1">
          <ul class="cart-list" id="cart-list"></ul>
          <div class="cart-empty" id="cart-empty" hidden>
            <p data-i18n="kassa.empty">Din varukorg är tom.</p>
            <a class="btn btn-gold" href="tavlor.html"><span data-i18n="kassa.empty.cta">Till tavlorna</span> <span class="arrow">→</span></a>
          </div>
        </div>

        <!-- Steg 2: Uppgifter -->
        <form class="step-panel" data-step="2" id="details-form" novalidate hidden>
          <h3 data-i18n="kassa.details.title">Dina uppgifter</h3>
          <div class="form-grid">
            <div class="field full">
              <label class="field-label" for="f-name" data-i18n="kassa.name">För- och efternamn</label>
              <input class="input" id="f-name" name="namn" autocomplete="name" required>
              <div class="field-error" data-i18n="kassa.required"></div>
            </div>
            <div class="field">
              <label class="field-label" for="f-email" data-i18n="kassa.email">E-post</label>
              <input class="input" id="f-email" name="epost" type="email" autocomplete="email" required>
              <div class="field-error" data-i18n="kassa.invalid.email"></div>
            </div>
            <div class="field">
              <label class="field-label" for="f-phone" data-i18n="kassa.phone">Telefon</label>
              <input class="input" id="f-phone" name="telefon" type="tel" autocomplete="tel" required>
              <div class="field-error" data-i18n="kassa.required"></div>
            </div>
            <div class="field full">
              <label class="field-label" for="f-address" data-i18n="kassa.address">Adress</label>
              <input class="input" id="f-address" name="adress" autocomplete="street-address" required>
              <div class="field-error" data-i18n="kassa.required"></div>
            </div>
            <div class="field">
              <label class="field-label" for="f-zip" data-i18n="kassa.zip">Postnummer</label>
              <input class="input" id="f-zip" name="postnummer" autocomplete="postal-code" inputmode="numeric" required>
              <div class="field-error" data-i18n="kassa.required"></div>
            </div>
            <div class="field">
              <label class="field-label" for="f-city" data-i18n="kassa.city">Ort</label>
              <input class="input" id="f-city" name="ort" autocomplete="address-level2" required>
              <div class="field-error" data-i18n="kassa.required"></div>
            </div>
            <div class="field full">
              <label class="field-label" for="f-message" data-i18n="kassa.message">Meddelande (valfritt)</label>
              <textarea class="textarea" id="f-message" name="meddelande" maxlength="1000"></textarea>
            </div>
          </div>
          <button type="submit" hidden></button>
        </form>

        <!-- Steg 3: Leverans -->
        <div class="step-panel" data-step="3" hidden>
          <h3 data-i18n="kassa.delivery.title">Välj leverans</h3>
          <div class="delivery-options" role="radiogroup">
            <label class="delivery-option">
              <input type="radio" name="leverans" value="frakt" checked>
              <span class="radio" aria-hidden="true"></span>
              <span><strong data-i18n="kassa.delivery.ship">Frakt</strong><span class="desc" data-i18n="kassa.delivery.ship.text"></span></span>
              <span class="cost" id="ship-cost"></span>
            </label>
            <label class="delivery-option">
              <input type="radio" name="leverans" value="mote">
              <span class="radio" aria-hidden="true"></span>
              <span><strong data-i18n="kassa.delivery.meet">Mötas upp</strong><span class="desc" data-i18n="kassa.delivery.meet.text"></span></span>
              <span class="cost" data-i18n="kassa.shipping.free">Gratis</span>
            </label>
          </div>
          <p class="notice" id="image-mail-note" style="margin-top:20px" data-i18n-html="egen.mail" hidden></p>
          <p class="sum-note" data-i18n="kassa.terms"></p>
        </div>
      </div>

      <!-- Bekräftelse -->
      <div class="confirm" id="confirm" hidden tabindex="-1">
        <div class="kicker" data-i18n="confirm.kicker">Tack för din beställning</div>
        <h3 class="confirm-title" data-i18n="confirm.title">Beställningen är mottagen</h3>
        <div class="confirm-facts">
          <div><div class="label" data-i18n="confirm.order">Ordernummer</div><div class="value" id="c-order"></div></div>
          <div><div class="label" data-i18n="confirm.total">Att betala</div><div class="value" id="c-total"></div></div>
        </div>
        <div class="swish-box">
          <h3 data-i18n="confirm.pay">Betala med Swish</h3>
          <div id="swish-ready">
            <div class="only-desktop">
              <div class="qr-wrap" id="qr"></div>
              <p class="swish-meta" data-i18n="confirm.scan"></p>
            </div>
            <div class="only-mobile" style="margin:10px 0 22px">
              <a class="btn btn-gold btn-block" id="swish-btn" href="#"><span data-i18n="confirm.open">Öppna Swish</span> <span class="arrow">→</span></a>
            </div>
            <p style="margin:18px 0 4px"><span class="swish-meta" data-i18n="confirm.number">Swish-nummer</span><br><span class="swish-number" id="c-swish"></span></p>
            <p class="swish-meta"><span data-i18n="confirm.message">Meddelande</span>: <span id="c-msg"></span></p>
          </div>
          <div id="swish-pending" hidden>
            <p class="notice" data-i18n="confirm.pending"></p>
          </div>
        </div>
        <p class="notice" id="c-image" hidden></p>
        <p class="notice" id="c-meet" data-i18n="confirm.meet" hidden></p>
        <p class="notice warn" id="c-mail-error" data-i18n="kassa.mail.error" hidden></p>
        <p class="lead" style="margin:22px auto" data-i18n="confirm.next"></p>
        <button type="button" class="btn btn-ghost" data-drawer-close data-i18n="modal.close">Stäng</button>
      </div>
    </div>

    <!-- Summering + knappar -->
    <footer class="drawer-foot" id="drawer-foot">
      <div class="sum-row"><span data-i18n="kassa.subtotal">Delsumma</span><span id="sum-sub"></span></div>
      <div class="sum-row"><span data-i18n="kassa.shipping">Frakt</span><span id="sum-ship"></span></div>
      <div class="sum-row sum-total"><span data-i18n="kassa.total">Totalt</span><span id="sum-total"></span></div>
      <div class="drawer-actions">
        <button type="button" class="link-line" id="step-back">← <span data-i18n="kassa.back">Tillbaka</span></button>
        <button type="button" class="btn btn-gold" id="step-next"><span id="step-next-label" data-i18n="kassa.next">Fortsätt</span> <span class="arrow">→</span></button>
      </div>
      <p class="form-error" id="order-error" role="alert"></p>
    </footer>
  </aside>
</div>`;

/* ---------------- Beräkningar ---------------- */
function subtotal(cart) { return cart.reduce((s, i) => s + itemPrice(i) * i.antal, 0); }
function shippingFor(cart) { return cart.length ? Number(FRAKT) || 0 : 0; }
function shippingChosen(cart) { return delivery === "frakt" ? shippingFor(cart) : 0; }
function shipText(n) { return n === 0 ? t("kassa.shipping.free") : formatPrice(n); }

/* ---------------- Beskrivning av en rad ---------------- */
function itemTitle(item) {
  if (item.typ === "standard") return item.titel[LANG] || item.titel.sv;
  return t("egen.type");
}

function itemDetail(item) {
  if (item.typ === "standard") return "";
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
  list.hidden = empty;

  list.innerHTML = cart.map(item => {
    // Byt produkt och storlek i samma lista, t.ex. "Canvas 30×40 cm"
    const opts = PRODUKTER.flatMap(p => sizesFor(p).map(s => {
      const val = `${p}|${s}`;
      const sel = p === item.produkt && s === item.storlek ? "selected" : "";
      return `<option value="${val}" ${sel}>${t("product." + p)} ${sizeLabel(s, item.orient)}</option>`;
    })).join("");
    const detail = itemDetail(item);
    return `<li class="cart-item" data-id="${item.id}">
      ${itemThumb(item)}
      <div>
        <div class="cart-name">${escK(itemTitle(item))}</div>
        <div class="cart-sub"><span class="tag">${escK(t("product." + item.produkt))} ${escK(sizeLabel(item.storlek, item.orient))}</span>${escK(detail)}</div>
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
      <div class="cart-line-price">${formatPrice(itemPrice(item) * item.antal)}</div>
    </li>`;
  }).join("");
  initPlaceholders(list);
  if (empty && step !== 1) goTo(1);
  renderSummary();
}

function renderSummary() {
  const cart = getCart();
  const sub = subtotal(cart);
  const ship = step === 3 ? shippingChosen(cart) : shippingFor(cart);
  document.getElementById("sum-sub").textContent = formatPrice(sub);
  document.getElementById("sum-ship").textContent = shipText(ship);
  document.getElementById("sum-total").textContent = formatPrice(sub + ship);
  document.getElementById("ship-cost").textContent = shipText(shippingFor(cart));
  document.getElementById("image-mail-note").hidden = !cart.some(i => i.typ === "egen" && i.lage === "upload");

  const empty = cart.length === 0;
  document.getElementById("drawer-foot").hidden = empty;
  document.getElementById("step-back").style.visibility = step === 1 ? "hidden" : "visible";
  const label = document.getElementById("step-next-label");
  label.dataset.i18n = step === 3 ? "kassa.order" : "kassa.next";
  label.textContent = t(label.dataset.i18n);
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
  const [produkt, storlek] = e.target.value.split("|");
  item.produkt = produkt;
  item.storlek = storlek;
  saveCart(cart);
  renderCart();
}

/* ---------------- Steg ---------------- */
function goTo(n) {
  if (n > 1 && getCart().length === 0) n = 1;
  step = n;
  document.querySelectorAll("#drawer .step-panel").forEach(p => { p.hidden = Number(p.dataset.step) !== n; });
  document.querySelectorAll("#steps li").forEach((li, i) => {
    li.classList.toggle("active", i + 1 === n);
    li.classList.toggle("done", i + 1 < n);
    if (i + 1 === n) li.setAttribute("aria-current", "step"); else li.removeAttribute("aria-current");
  });
  document.getElementById("order-error").textContent = "";
  document.querySelector("#drawer .drawer-body").scrollTop = 0;
  renderSummary();
}

function nextStep() {
  if (step === 1) goTo(2);
  else if (step === 2) { if (validateDetails()) goTo(3); }
  else placeOrder();
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
    const prod = item.produkt === "poster" ? "Poster" : "Canvastavla";
    const size = sizeLabel(item.storlek, item.orient);
    const price = itemPrice(item) * item.antal;
    let line;
    if (item.typ === "standard") {
      line = `${prod}: ${item.titel.sv} (${item.kategori}, id ${item.motivId})`;
    } else if (item.lage === "upload") {
      line = `${prod}, egen design – uppladdad bild: ${item.filnamn || "-"} (${item.pixlar || "?"} px)` +
        `${item.lagUpplosning ? " [VARNING: låg upplösning]" : ""} – kunden mejlar bilden. Rättigheter bekräftade: ja`;
    } else if (item.lage === "quote") {
      line = `${prod}, egen design – citat: "${item.citat}"${item.forfattare ? " " + item.forfattare : ""} | Typsnitt: ${item.font} | Textfärg: ${item.farg} | Bakgrund: ${item.bakgrund}`;
    } else {
      line = `${prod}, egen design – idé: ${item.ide}`;
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

  const btn = document.getElementById("step-next");
  btn.disabled = true;
  document.getElementById("step-next-label").textContent = t("kassa.sending");

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
    "Leverans": delivery === "frakt" ? `Frakt (${ship ? ship + " kr" : "gratis"})` : "Mötas upp – kontakta kunden om plats"
  };
  orderLines(cart).forEach((line, i) => { fields[`Tavla ${i + 1}`] = line; });
  Object.assign(fields, {
    "Delsumma": `${sub} kr`,
    "Frakt": ship ? `${ship} kr` : "Gratis",
    "Totalt att betala": `${total} kr`,
    "Meddelande": customer.meddelande || "-",
    "Bild mejlas separat": hasUpload ? "JA – kunden mejlar sin bild med ordernumret" : "Nej",
    "Språk på sidan": LANG
  });

  const ok = await sendOrderEmail(fields);
  btn.disabled = false;
  saveCart([]);
  showConfirmation({ nr, total, hasUpload, mailFailed: !ok });
}

/* ---------------- Bekräftelse + Swish ---------------- */
// QR-biblioteket laddas bara när det behövs
function loadQrLib() {
  if (typeof QRCode !== "undefined") return Promise.resolve();
  return new Promise(resolve => {
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
    s.onload = resolve;
    s.onerror = resolve;
    document.head.appendChild(s);
  });
}

function showConfirmation({ nr, total, hasUpload, mailFailed }) {
  document.getElementById("checkout-flow").hidden = true;
  document.getElementById("drawer-foot").hidden = true;
  const box = document.getElementById("confirm");
  box.hidden = false;
  document.getElementById("c-order").textContent = nr;
  document.getElementById("c-total").textContent = formatPrice(total);

  const swishMsg = `Order ${nr}`;
  const ready = SWISH_NUMMER && SWISH_NUMMER !== "KOMMER";
  document.getElementById("swish-ready").hidden = !ready;
  document.getElementById("swish-pending").hidden = ready;

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
    loadQrLib().then(() => {
      if (typeof QRCode !== "undefined") {
        new QRCode(qr, { text: `C${number};${total};${swishMsg};0`, width: 200, height: 200, colorDark: "#0b0b0b", colorLight: "#ffffff", correctLevel: QRCode.CorrectLevel.M });
      }
    });
  }

  const img = document.getElementById("c-image");
  img.hidden = !hasUpload;
  if (hasUpload) img.innerHTML = t("confirm.image", { order: escK(nr) });
  document.getElementById("c-meet").hidden = delivery !== "mote";
  document.getElementById("c-mail-error").hidden = !mailFailed;

  showConfirmation.last = { nr, total, hasUpload };
  document.querySelector("#drawer .drawer-body").scrollTop = 0;
  box.focus({ preventScroll: true });
}

// Efter en avslutad order: nästa gång panelen öppnas börjar den om från varukorgen
function resetAfterOrder() {
  if (!showConfirmation.last) return;
  showConfirmation.last = null;
  document.getElementById("confirm").hidden = true;
  document.getElementById("checkout-flow").hidden = false;
  renderCart();
  goTo(1);
}

/* ---------------- Öppna / stäng panelen ---------------- */
function openCart() {
  const drawer = document.getElementById("drawer");
  if (!drawer) return;
  resetAfterOrder();
  renderCart();
  drawerReturnFocus = document.activeElement;
  drawer.classList.add("open");
  drawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => drawer.querySelector(".drawer-close").focus(), 60);
}

function closeCart() {
  const drawer = document.getElementById("drawer");
  if (!drawer || !drawer.classList.contains("open")) return;
  drawer.classList.remove("open");
  drawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (drawerReturnFocus && drawerReturnFocus.focus) drawerReturnFocus.focus();
}

/* ---------------- Start ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  document.body.insertAdjacentHTML("beforeend", DRAWER_HTML);
  const drawer = document.getElementById("drawer");
  applyI18n(drawer);
  restoreCustomer();
  renderCart();
  goTo(1);

  const list = document.getElementById("cart-list");
  list.addEventListener("click", onCartClick);
  list.addEventListener("change", onCartChange);

  document.getElementById("step-next").addEventListener("click", nextStep);
  document.getElementById("step-back").addEventListener("click", () => goTo(Math.max(1, step - 1)));
  const form = document.getElementById("details-form");
  form.addEventListener("submit", e => { e.preventDefault(); nextStep(); });
  form.addEventListener("input", e => {
    const f = e.target.closest(".field");
    if (f && f.classList.contains("invalid")) { f.classList.remove("invalid"); e.target.removeAttribute("aria-invalid"); }
  });
  drawer.querySelectorAll('input[name="leverans"]').forEach(r => r.addEventListener("change", () => {
    delivery = r.value;
    renderSummary();
  }));

  // Allt som pekar på kassan öppnar panelen: varukorgsikonen, "Till kassan" i notisen m.m.
  document.addEventListener("click", e => {
    const opener = e.target.closest('[data-open-cart], a[href="#kassa"]');
    if (opener) { e.preventDefault(); closeMenuIfOpen(); openCart(); return; }
    if (e.target.closest("[data-drawer-close]")) closeCart();
  });
  document.addEventListener("keydown", e => {
    if (!drawer.classList.contains("open")) return;
    if (e.key === "Escape") closeCart();
    if (e.key === "Tab") {
      // Håll fokus inne i panelen
      const f = [...drawer.querySelectorAll("button, [href], input, select, textarea")].filter(x => x.offsetParent !== null && !x.disabled);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Länk som tavlor.html#kassa eller index.html#kassa öppnar panelen direkt
  if (location.hash === "#kassa") openCart();
});

function closeMenuIfOpen() {
  document.body.classList.remove("menu-open");
  const b = document.querySelector(".burger");
  if (b) b.setAttribute("aria-expanded", "false");
}

document.addEventListener("cartchange", () => {
  const drawer = document.getElementById("drawer");
  if (drawer && !showConfirmation.last) renderCart();
});

document.addEventListener("langchange", () => {
  if (!document.getElementById("drawer")) return;
  if (showConfirmation.last) {
    const { nr, total, hasUpload } = showConfirmation.last;
    document.getElementById("c-total").textContent = formatPrice(total);
    if (hasUpload) document.getElementById("c-image").innerHTML = t("confirm.image", { order: escK(nr) });
  } else {
    renderCart();
  }
});
window.addEventListener("storage", e => { if (e.key === CART_KEY && !showConfirmation.last) renderCart(); });
