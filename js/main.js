/* =========================================================
   L'atelier UF – GEMENSAM JAVASCRIPT
   Språk, varukorg, laddningsskärm, effekter.
   ========================================================= */

const REDUCED_MOTION = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const FINE_POINTER = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

/* ---------------- Lagring (tål privat läge) ---------------- */
const store = {
  get(key, fallback) {
    try {
      const v = localStorage.getItem(key);
      return v === null ? fallback : JSON.parse(v);
    } catch (e) { return fallback; }
  },
  set(key, value) {
    try { localStorage.setItem(key, JSON.stringify(value)); } catch (e) { /* ignorera */ }
  }
};

/* ---------------- Språk ---------------- */
let LANG = store.get("latelier-lang", "sv");
if (!I18N[LANG]) LANG = "sv";

function t(key, vars) {
  let s = (I18N[LANG] && I18N[LANG][key]) ?? I18N.sv[key] ?? key;
  if (vars) Object.keys(vars).forEach(k => { s = s.split("{" + k + "}").join(vars[k]); });
  return s;
}

function applyI18n(root = document) {
  document.documentElement.lang = LANG;
  root.querySelectorAll("[data-i18n]").forEach(el => { el.textContent = t(el.dataset.i18n); });
  root.querySelectorAll("[data-i18n-html]").forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  root.querySelectorAll("[data-i18n-placeholder]").forEach(el => { el.placeholder = t(el.dataset.i18nPlaceholder); });
  root.querySelectorAll("[data-i18n-aria]").forEach(el => { el.setAttribute("aria-label", t(el.dataset.i18nAria)); });
  const titleKey = document.body.dataset.titleKey;
  if (titleKey) document.title = t(titleKey);
  const desc = document.querySelector('meta[name="description"]');
  if (desc) desc.content = t("meta.desc");

  document.querySelectorAll(".lang-toggle").forEach(btn => {
    btn.querySelector(".lang-flag").textContent = LANG === "sv" ? "🇬🇧" : "🇸🇪";
    btn.querySelector(".lang-code").textContent = LANG === "sv" ? "EN" : "SV";
    btn.setAttribute("aria-label", t("lang.switch"));
    btn.title = t("lang.switch");
  });
}

function setLang(lang) {
  LANG = lang;
  store.set("latelier-lang", lang);
  applyI18n();
  document.dispatchEvent(new CustomEvent("langchange", { detail: { lang } }));
}

/* ---------------- Pris ---------------- */
function formatPrice(n) {
  const num = Math.round(Number(n) || 0).toLocaleString(LANG === "sv" ? "sv-SE" : "en-GB");
  return LANG === "sv" ? num + " kr" : num + " SEK";
}

function sizeLabel(size, orient) {
  const [w, h] = size.split("x");
  return orient === "landscape" ? `${h}×${w} cm` : `${w}×${h} cm`;
}

/* ---------------- Varukorg ---------------- */
const CART_KEY = "latelier-cart";

function getCart() { return store.get(CART_KEY, []); }

function saveCart(cart) {
  store.set(CART_KEY, cart);
  updateCartBadge();
  document.dispatchEvent(new CustomEvent("cartchange"));
}

function itemPrice(item) {
  const table = item.typ === "egen" ? PRISER.egen : PRISER.standard;
  return Number(table[item.storlek]) || 0;
}

function addToCart(item) {
  const cart = getCart();
  // Slå ihop identiska standardtavlor
  if (item.typ === "standard") {
    const same = cart.find(i => i.typ === "standard" && i.motivId === item.motivId && i.storlek === item.storlek);
    if (same) { same.antal += 1; saveCart(cart); return; }
  }
  item.id = "i" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
  item.antal = item.antal || 1;
  cart.push(item);
  saveCart(cart);
}

function cartCount() { return getCart().reduce((s, i) => s + i.antal, 0); }

function updateCartBadge() {
  const n = cartCount();
  document.querySelectorAll(".cart-count").forEach(el => {
    el.textContent = n;
    el.hidden = n === 0;
  });
}

/* ---------------- Platshållarbilder ----------------
   <img data-ph="Titel"> byts mot en snygg platshållare om bilden saknas. */
function placeholderHTML(title, hue = 40) {
  const esc = String(title || "").replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  return `<div class="ph" style="--h:${hue}"><div class="ph-inner"><div class="ph-l">L</div>` +
    (esc ? `<div class="ph-title">${esc}</div>` : "") +
    `<div class="ph-sub" data-i18n="gallery.placeholder">${t("gallery.placeholder")}</div></div></div>`;
}

function initPlaceholders(root = document) {
  root.querySelectorAll("img[data-ph]:not([data-ph-bound])").forEach(img => {
    img.dataset.phBound = "1";
    const swap = () => {
      const wrap = document.createElement("div");
      wrap.innerHTML = placeholderHTML(img.dataset.ph, img.dataset.hue || 40);
      img.replaceWith(wrap.firstChild);
    };
    if (img.complete && img.naturalWidth === 0) swap();
    else img.addEventListener("error", swap, { once: true });
  });
}

/* ---------------- Toast ---------------- */
function showToast(html) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    document.body.appendChild(toast);
  }
  toast.innerHTML = html;
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove("show"), 3800);
}

/* ---------------- Laddningsskärm ----------------
   Visas med full animation bara första gången per besök.
   Vid byte mellan sidor hoppas den över helt. */
function initLoader() {
  const loader = document.querySelector(".loader");
  let seen = false;
  try { seen = sessionStorage.getItem("latelier-loaded") === "1"; } catch (e) { /* */ }
  try { sessionStorage.setItem("latelier-loaded", "1"); } catch (e) { /* */ }

  if (!loader || seen || REDUCED_MOTION) {
    if (loader) loader.remove();
    document.body.classList.add("loaded");
    return Promise.resolve();
  }
  return new Promise(resolve => {
    setTimeout(() => {
      loader.classList.add("done");
      document.body.classList.add("loaded");
      setTimeout(() => loader.remove(), 1000);
      resolve();
    }, 1900);
  });
}

/* ---------------- Hero: ord för ord ---------------- */
function splitHeroTitle() {
  const el = document.querySelector(".hero-title");
  if (!el) return;
  const words = t("hero.title").split(" ");
  el.setAttribute("aria-label", t("hero.title"));
  el.innerHTML = words.map((w, i) =>
    `<span class="word" aria-hidden="true"><span style="--i:${i}">${w}</span></span>`
  ).join(" ");
}

/* ---------------- Header & meny ---------------- */
function initHeader() {
  const header = document.querySelector(".site-header");
  const onScroll = () => header && header.classList.toggle("scrolled", window.scrollY > 30);
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const burger = document.querySelector(".burger");
  const nav = document.querySelector(".main-nav");
  if (burger && nav) {
    const close = () => {
      document.body.classList.remove("menu-open");
      burger.setAttribute("aria-expanded", "false");
    };
    burger.addEventListener("click", () => {
      const open = document.body.classList.toggle("menu-open");
      burger.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach(a => a.addEventListener("click", close));
    document.addEventListener("keydown", e => { if (e.key === "Escape") close(); });
  }

  document.querySelectorAll(".lang-toggle").forEach(btn =>
    btn.addEventListener("click", () => setLang(LANG === "sv" ? "en" : "sv"))
  );

  // Logga: använd images/logo.png om den finns, annars SVG-platshållaren
  document.querySelectorAll(".logo-img").forEach(img => {
    img.addEventListener("load", () => img.closest(".logo-mark").classList.add("has-img"));
    img.addEventListener("error", () => img.remove());
    if (img.complete && img.naturalWidth) img.closest(".logo-mark").classList.add("has-img");
  });

  const year = document.querySelector(".year");
  if (year) year.textContent = new Date().getFullYear();
}

/* ---------------- Spotlight-muspekare ----------------
   Ljuset flyttas med transform, vilket är billigt för webbläsaren. */
function initSpotlight() {
  const light = document.querySelector(".spotlight");
  if (!light || !FINE_POINTER || REDUCED_MOTION) return;
  document.body.classList.add("has-spotlight");
  let x = innerWidth / 2, y = innerHeight * 0.4, cx = x, cy = y, raf = null;
  const paint = () => { light.style.transform = `translate3d(${cx}px, ${cy}px, 0)`; };
  paint();
  window.addEventListener("pointermove", e => {
    x = e.clientX; y = e.clientY;
    if (!raf) raf = requestAnimationFrame(loop);
  }, { passive: true });
  // Ljuset följer mjukt efter
  function loop() {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    paint();
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.5 ? requestAnimationFrame(loop) : null;
  }
}

/* ---------------- Tavlor som lutar + lokalt ljus ---------------- */
function bindTilt(el) {
  if (!FINE_POINTER || REDUCED_MOTION || el.dataset.tiltBound) return;
  el.dataset.tiltBound = "1";
  const max = Number(el.dataset.tilt || 7);
  el.addEventListener("pointermove", e => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    el.style.setProperty("--rx", ((0.5 - py) * max).toFixed(2) + "deg");
    el.style.setProperty("--ry", ((px - 0.5) * max).toFixed(2) + "deg");
    el.style.setProperty("--lx", (px * 100).toFixed(1) + "%");
    el.style.setProperty("--ly", (py * 100).toFixed(1) + "%");
    el.classList.add("lit");
  });
  el.addEventListener("pointerleave", () => {
    el.style.setProperty("--rx", "0deg");
    el.style.setProperty("--ry", "0deg");
    el.classList.remove("lit");
  });
}
function initTilt(root = document) { root.querySelectorAll("[data-tilt]").forEach(bindTilt); }

/* ---------------- Visa vid skroll ---------------- */
let revealObserver;
function initReveal(root = document) {
  const els = root.querySelectorAll(".reveal:not(.in)");
  if (REDUCED_MOTION || !("IntersectionObserver" in window)) {
    els.forEach(el => el.classList.add("in"));
    return;
  }
  if (!revealObserver) {
    revealObserver = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.classList.add("in"); revealObserver.unobserve(en.target); }
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -6% 0px" });
  }
  els.forEach(el => revealObserver.observe(el));
}

/* ---------------- FAQ ---------------- */
function initFaq() {
  document.querySelectorAll(".faq-item").forEach(item => {
    const btn = item.querySelector(".faq-q");
    btn.addEventListener("click", () => {
      const open = item.classList.toggle("open");
      btn.setAttribute("aria-expanded", String(open));
    });
  });
}

/* ---------------- Start ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  if (REDUCED_MOTION) document.documentElement.classList.add("reduced-motion");
  applyI18n();
  initPlaceholders();
  splitHeroTitle();
  updateCartBadge();
  initHeader();
  initSpotlight();
  initTilt();
  initFaq();
  initLoader().then(() => initReveal());
});

document.addEventListener("langchange", splitHeroTitle);
// Uppdatera räknaren om varukorgen ändras i en annan flik
window.addEventListener("storage", e => { if (e.key === CART_KEY) updateCartBadge(); });
