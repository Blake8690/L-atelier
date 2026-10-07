/* =========================================================
   L'atelier UF – TAVLOR
   Flikar, galleri, storleksval och "Skapa egen"-verktyget.
   ========================================================= */

const CAT_HUE = { stad: 30, natur: 110, portratt: 15, religion: 45, djur: 60, film: 260 };
const TABS = ["stad", "natur", "portratt", "religion", "djur", "film", "egen"];
let currentTab = "stad";

const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const minStd = () => Math.min(...STORLEKAR.map(s => Number(PRISER.standard[s]) || Infinity));

/* ---------------- Flikar ---------------- */
function selectTab(name, focus) {
  if (!TABS.includes(name)) name = "stad";
  currentTab = name;
  document.querySelectorAll(".tab").forEach(tab => {
    const on = tab.dataset.tab === name;
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
    if (on && focus) tab.focus();
    if (on) tab.scrollIntoView({ block: "nearest", inline: "nearest", behavior: REDUCED_MOTION ? "auto" : "smooth" });
  });
  const isEgen = name === "egen";
  document.getElementById("panel-egen").hidden = !isEgen;
  const gp = document.getElementById("panel-gallery");
  gp.hidden = isEgen;
  if (!isEgen) {
    gp.setAttribute("aria-labelledby", "tab-" + name);
    renderGallery();
  } else {
    studio.update();
  }
  history.replaceState(null, "", "#" + name);
}

function initTabs() {
  const tabs = [...document.querySelectorAll(".tab")];
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => selectTab(tab.dataset.tab));
    tab.addEventListener("keydown", e => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      if (e.key === "Home") j = 0;
      if (e.key === "End") j = tabs.length - 1;
      if (j !== null) { e.preventDefault(); selectTab(tabs[j].dataset.tab, true); }
    });
  });
  const fromHash = location.hash.replace("#", "");
  selectTab(TABS.includes(fromHash) ? fromHash : "stad");
  window.addEventListener("hashchange", () => {
    const h = location.hash.replace("#", "");
    if (TABS.includes(h) && h !== currentTab) selectTab(h);
  });
}

/* ---------------- Galleri ---------------- */
function renderGallery() {
  const g = document.getElementById("gallery");
  const list = TAVLOR[currentTab] || [];
  g.innerHTML = list.map((item, i) => {
    const title = item.titel[LANG] || item.titel.sv;
    return `<button type="button" class="gallery-item reveal" style="--d:${(i % 3) * 0.12}s" data-id="${esc(item.id)}">
      <span class="art" data-tilt="7">
        <img src="${esc(item.bild)}" alt="${esc(title)}" loading="lazy" data-ph="${esc(title)}" data-hue="${CAT_HUE[currentTab]}">
        <span class="gallery-cta">${esc(t("gallery.choose"))}</span>
      </span>
      <span class="gallery-meta">
        <span class="gallery-title">${esc(title)}</span>
        <span class="gallery-price">${esc(t("from"))} ${formatPrice(minStd())}</span>
      </span>
    </button>`;
  }).join("");
  initPlaceholders(g);
  initTilt(g);
  if (document.body.classList.contains("loaded")) initReveal(g);
  g.querySelectorAll(".gallery-item").forEach(btn =>
    btn.addEventListener("click", () => openModal(btn.dataset.id, btn))
  );
}

/* ---------------- Modal ---------------- */
const modal = {
  el: null, item: null, size: STORLEKAR[0], returnFocus: null
};

function findItem(id) {
  for (const cat of Object.keys(TAVLOR)) {
    const it = TAVLOR[cat].find(x => x.id === id);
    if (it) return { ...it, kategori: cat };
  }
  return null;
}

function renderModal() {
  const it = modal.item;
  if (!it) return;
  const title = it.titel[LANG] || it.titel.sv;
  document.getElementById("modal-cat").textContent = t("tab." + it.kategori);
  document.getElementById("modal-title").textContent = title;
  const art = document.getElementById("modal-art");
  art.innerHTML = `<img src="${esc(it.bild)}" alt="${esc(title)}" data-ph="${esc(title)}" data-hue="${CAT_HUE[it.kategori]}">`;
  initPlaceholders(art);
  const sizes = document.getElementById("modal-sizes");
  sizes.innerHTML = STORLEKAR.map(s => `<button type="button" class="chip" role="radio" data-size="${s}" aria-checked="${s === modal.size}">${sizeLabel(s)}<small>${formatPrice(PRISER.standard[s])}</small></button>`).join("");
  sizes.querySelectorAll(".chip").forEach(c => c.addEventListener("click", () => {
    modal.size = c.dataset.size;
    sizes.querySelectorAll(".chip").forEach(x => x.setAttribute("aria-checked", String(x === c)));
    document.getElementById("modal-price").textContent = formatPrice(PRISER.standard[modal.size]);
  }));
  document.getElementById("modal-price").textContent = formatPrice(PRISER.standard[modal.size]);
}

function openModal(id, trigger) {
  modal.item = findItem(id);
  if (!modal.item) return;
  modal.size = STORLEKAR[0];
  modal.returnFocus = trigger;
  renderModal();
  modal.el.classList.add("open");
  modal.el.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
  setTimeout(() => modal.el.querySelector(".modal-close").focus(), 50);
}

function closeModal() {
  if (!modal.el.classList.contains("open")) return;
  modal.el.classList.remove("open");
  modal.el.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
  if (modal.returnFocus) modal.returnFocus.focus();
}

function addedToast() {
  showToast(`<span>✦ ${esc(t("added"))}</span><a href="kassa.html">${esc(t("added.go"))} →</a>`);
}

function initModal() {
  modal.el = document.getElementById("modal");
  modal.el.querySelectorAll("[data-close]").forEach(b => b.addEventListener("click", closeModal));
  document.addEventListener("keydown", e => {
    if (!modal.el.classList.contains("open")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "Tab") {
      // Håll fokus inne i dialogen
      const f = [...modal.el.querySelectorAll("button, [href], input")].filter(x => x.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
  document.getElementById("modal-add").addEventListener("click", () => {
    const it = modal.item;
    addToCart({
      typ: "standard",
      motivId: it.id,
      kategori: it.kategori,
      titel: it.titel,
      bild: it.bild,
      storlek: modal.size
    });
    closeModal();
    addedToast();
  });
}

/* =========================================================
   SKAPA EGEN – live-mockup i webbläsaren
   ========================================================= */
const FONTS = [
  { name: "Cormorant Garamond", css: "'Cormorant Garamond', serif", style: "italic" },
  { name: "Playfair Display", css: "'Playfair Display', serif" },
  { name: "Libre Baskerville", css: "'Libre Baskerville', serif" },
  { name: "Great Vibes", css: "'Great Vibes', cursive" },
  { name: "Dancing Script", css: "'Dancing Script', cursive" },
  { name: "Montserrat", css: "'Montserrat', sans-serif", weight: 300 }
];
const TEXT_COLORS = ["#f3efe6", "#0b0b0b", "#c9a961", "#6b4e2e", "#2f3e46"];
const BG_COLORS = ["#0b0b0b", "#f3efe6", "#e4d9c3", "#1f2a24", "#c9a961"];

// Rumsdata: var tavlan hänger (cm över golvet i bilden) och skalnotis
const ROOMS = {
  living: { bottom: 126, note: "egen.scale.living" },
  bedroom: { bottom: 131, note: "egen.scale.bedroom" },
  hall: { bottom: 137, note: "egen.scale.hall" }
};
const ROOM_WIDTH_CM = 340;
const DPI_GOOD = 150;
const DPI_MIN = 100;

const studio = {
  mode: "upload",
  size: STORLEKAR[0],
  orient: "portrait",
  room: "living",
  image: null,       // { url, w, h, name, thumb }
  font: 0,
  color: TEXT_COLORS[0],
  bg: BG_COLORS[0],

  dims() {
    const [w, h] = this.size.split("x").map(Number);
    return this.orient === "landscape" ? { w: h, h: w } : { w, h };
  },

  update() {
    const room = document.getElementById("room");
    if (!room) return;
    const { w, h } = this.dims();
    const canvas = document.getElementById("wall-canvas");
    room.dataset.room = this.room;
    canvas.style.setProperty("--cw", w);
    canvas.style.setProperty("--ch", h);
    canvas.style.setProperty("--cb", ROOMS[this.room].bottom);
    document.getElementById("room-dims").textContent = `${w}×${h} cm`;
    const label = document.getElementById("room-label");
    label.dataset.i18n = "egen.room." + this.room;
    label.textContent = t(label.dataset.i18n);
    const note = document.getElementById("scale-note");
    note.dataset.i18n = ROOMS[this.room].note;
    note.textContent = t(note.dataset.i18n);
    room.querySelectorAll(".furniture").forEach(f => { f.hidden = f.dataset.for !== this.room; });
    document.getElementById("egen-price").textContent = formatPrice(PRISER.egen[this.size]);
    this.renderCanvas();
    this.checkResolution();
  },

  renderCanvas() {
    const box = document.getElementById("wall-canvas");
    const old = box.querySelector("#canvas-content");
    let html = "";
    box.style.background = "";
    if (this.mode === "upload" && this.image) {
      html = `<img id="canvas-content" class="canvas-img" src="${this.image.url}" alt="">`;
    } else if (this.mode === "quote") {
      const q = document.getElementById("quote-text").value.trim() || t("egen.quote.default");
      const a = document.getElementById("quote-author").value.trim();
      const f = FONTS[this.font];
      box.style.background = this.bg;
      html = `<div id="canvas-content" class="canvas-quote" style="font-family:${f.css};font-style:${f.style || "normal"};font-weight:${f.weight || 400};color:${this.color}">${esc(q)}${a ? `<span class="author">${esc(a)}</span>` : ""}</div>`;
    } else if (this.mode === "idea") {
      html = `<div id="canvas-content" class="canvas-empty"><span class="l">L</span>${esc(t("egen.idea.canvas"))}</div>`;
    } else {
      html = `<div id="canvas-content" class="canvas-empty"><span class="l">L</span></div>`;
    }
    if (old) old.outerHTML = html; else box.insertAdjacentHTML("afterbegin", html);
    // Anpassa citatets storlek efter textlängd
    const qEl = box.querySelector(".canvas-quote");
    if (qEl) {
      const len = qEl.textContent.length;
      const size = Math.max(4.2, Math.min(11, 60 / Math.sqrt(len + 4)));
      qEl.style.fontSize = size + "cqw";
    }
  },

  checkResolution() {
    const msg = document.getElementById("res-msg");
    if (this.mode !== "upload" || !this.image) { msg.innerHTML = ""; return; }
    const { w, h } = this.dims();
    const win = w / 2.54, hin = h / 2.54;
    const dpi = Math.min(this.image.w / win, this.image.h / hin);
    if (dpi >= DPI_GOOD) {
      msg.innerHTML = `<p class="notice good">✓ ${esc(t("egen.res.good"))}</p>`;
    } else if (dpi >= DPI_MIN) {
      msg.innerHTML = `<p class="notice">${esc(t("egen.res.ok"))}</p>`;
    } else {
      const px = `${Math.ceil(win * DPI_MIN)}×${Math.ceil(hin * DPI_MIN)}`;
      msg.innerHTML = `<p class="notice warn">⚠ ${esc(t("egen.res.low", { size: `${w}×${h}`, px }))}</p>`;
    }
  }
};

function radioGroup(container, attr, onPick) {
  container.querySelectorAll(".chip, .swatch:not(.swatch-custom)").forEach(btn => {
    if (btn.dataset.bound) return;
    btn.dataset.bound = "1";
    btn.addEventListener("click", () => {
      container.querySelectorAll("[role=radio]").forEach(b => b.setAttribute("aria-checked", String(b === btn)));
      onPick(btn.dataset[attr], btn);
    });
  });
}

function renderSizeChips() {
  const c = document.getElementById("size-chips");
  c.innerHTML = STORLEKAR.map(s =>
    `<button type="button" class="chip" role="radio" data-size="${s}" aria-checked="${s === studio.size}">${s.replace("x", "×")}<small>${formatPrice(PRISER.egen[s])}</small></button>`
  ).join("");
  radioGroup(c, "size", v => { studio.size = v; studio.update(); });
}

function renderFontChips() {
  const c = document.getElementById("font-chips");
  c.innerHTML = FONTS.map((f, i) =>
    `<button type="button" class="chip" role="radio" data-font="${i}" aria-checked="${i === studio.font}" aria-label="${f.name}" title="${f.name}" style="font-family:${f.css};font-style:${f.style || "normal"};font-weight:${f.weight || 400}">Aa</button>`
  ).join("");
  radioGroup(c, "font", v => { studio.font = Number(v); studio.renderCanvas(); });
}

function renderSwatches(id, colors, key) {
  const c = document.getElementById(id);
  c.innerHTML = colors.map(col =>
    `<button type="button" class="swatch" role="radio" data-color="${col}" aria-checked="${col === studio[key]}" aria-label="${col}" style="--c:${col}"></button>`
  ).join("") +
    `<label class="swatch swatch-custom" role="radio" aria-checked="false" title="+"><input type="color" value="${studio[key]}" aria-label="${key === "color" ? t("egen.color") : t("egen.bg")}"></label>`;
  radioGroup(c, "color", v => { studio[key] = v; studio.renderCanvas(); });
  const custom = c.querySelector(".swatch-custom");
  custom.querySelector("input").addEventListener("input", e => {
    studio[key] = e.target.value;
    c.querySelectorAll("[role=radio]").forEach(b => b.setAttribute("aria-checked", String(b === custom)));
    studio.renderCanvas();
  });
}

function setMode(mode) {
  studio.mode = mode;
  document.querySelectorAll(".mode-panel").forEach(p => { p.hidden = p.dataset.panel !== mode; });
  document.getElementById("egen-error").textContent = "";
  studio.update();
}

function renderUploadInfo() {
  const info = document.getElementById("upload-info");
  const im = studio.image;
  if (!im) return;
  info.hidden = false;
  info.innerHTML = `<img src="${im.url}" alt=""><span><strong style="color:var(--text);font-weight:400">${esc(im.name)}</strong><br>${im.w} × ${im.h} ${esc(t("egen.upload.pixels"))}</span>`;
}

/* Bilduppladdning – allt sker lokalt i webbläsaren */
function handleFile(file) {
  if (!file || !file.type.startsWith("image/")) return;
  if (studio.image) URL.revokeObjectURL(studio.image.url);
  const url = URL.createObjectURL(file);
  const img = new Image();
  img.onload = () => {
    // Liten miniatyr till varukorgen (själva bilden mailas separat)
    const max = 160;
    const scale = Math.min(1, max / Math.max(img.naturalWidth, img.naturalHeight));
    const cv = document.createElement("canvas");
    cv.width = Math.round(img.naturalWidth * scale);
    cv.height = Math.round(img.naturalHeight * scale);
    let thumb = "";
    try {
      cv.getContext("2d").drawImage(img, 0, 0, cv.width, cv.height);
      thumb = cv.toDataURL("image/jpeg", 0.7);
    } catch (e) { /* ignorera */ }

    studio.image = { url, w: img.naturalWidth, h: img.naturalHeight, name: file.name, thumb };
    // Välj automatiskt stående/liggande efter bilden
    studio.orient = img.naturalWidth > img.naturalHeight ? "landscape" : "portrait";
    document.querySelectorAll("#orient-chips .chip").forEach(c => c.setAttribute("aria-checked", String(c.dataset.orient === studio.orient)));

    renderUploadInfo();
    document.getElementById("egen-error").textContent = "";
    studio.update();
  };
  img.src = url;
}

function initStudio() {
  renderSizeChips();
  renderFontChips();
  renderSwatches("text-swatches", TEXT_COLORS, "color");
  renderSwatches("bg-swatches", BG_COLORS, "bg");

  radioGroup(document.getElementById("mode-chips"), "mode", setMode);
  radioGroup(document.getElementById("orient-chips"), "orient", v => { studio.orient = v; studio.update(); });
  radioGroup(document.getElementById("room-chips"), "room", v => { studio.room = v; studio.update(); });

  ["quote-text", "quote-author"].forEach(id =>
    document.getElementById(id).addEventListener("input", () => studio.renderCanvas())
  );

  const input = document.getElementById("file-input");
  const dz = document.getElementById("dropzone");
  input.addEventListener("change", () => handleFile(input.files[0]));
  ["dragenter", "dragover"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add("drag"); }));
  ["dragleave", "drop"].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove("drag"); }));
  dz.addEventListener("drop", e => handleFile(e.dataTransfer.files[0]));

  document.getElementById("rights").addEventListener("change", e => {
    document.getElementById("rights-check").classList.toggle("invalid", false);
    if (e.target.checked) document.getElementById("egen-error").textContent = "";
  });

  // Skala: 1 cm i rummet = rummets bredd / 340
  const room = document.getElementById("room");
  const setScale = () => room.style.setProperty("--cm", (room.clientWidth / ROOM_WIDTH_CM) + "px");
  setScale();
  if ("ResizeObserver" in window) new ResizeObserver(setScale).observe(room);
  else window.addEventListener("resize", setScale);

  document.getElementById("egen-add").addEventListener("click", addCustomToCart);
  studio.update();
}

function addCustomToCart() {
  const err = document.getElementById("egen-error");
  err.textContent = "";
  const base = { typ: "egen", lage: studio.mode, storlek: studio.size, orient: studio.orient, rum: studio.room };

  if (studio.mode === "upload") {
    if (!studio.image) { err.textContent = t("egen.noimage"); return; }
    if (!document.getElementById("rights").checked) {
      err.textContent = t("egen.rights.error");
      document.getElementById("rights-check").classList.add("invalid");
      return;
    }
    const { w, h } = studio.dims();
    const dpi = Math.min(studio.image.w / (w / 2.54), studio.image.h / (h / 2.54));
    addToCart({
      ...base,
      filnamn: studio.image.name,
      pixlar: `${studio.image.w}×${studio.image.h}`,
      lagUpplosning: dpi < DPI_MIN,
      rattigheter: true,
      thumb: studio.image.thumb
    });
  } else if (studio.mode === "quote") {
    const q = document.getElementById("quote-text").value.trim();
    if (!q) { err.textContent = t("egen.quote.empty"); document.getElementById("quote-text").focus(); return; }
    addToCart({
      ...base,
      citat: q,
      forfattare: document.getElementById("quote-author").value.trim(),
      font: FONTS[studio.font].name,
      fontCss: FONTS[studio.font].css,
      fontStyle: FONTS[studio.font].style || "normal",
      farg: studio.color,
      bakgrund: studio.bg
    });
  } else {
    const idea = document.getElementById("idea-text").value.trim();
    if (!idea) { err.textContent = t("egen.idea.empty"); document.getElementById("idea-text").focus(); return; }
    addToCart({ ...base, ide: idea });
  }
  addedToast();
}

/* ---------------- Start ---------------- */
document.addEventListener("DOMContentLoaded", () => {
  initModal();
  initStudio();
  initTabs();
});

document.addEventListener("langchange", () => {
  if (currentTab !== "egen") renderGallery();
  renderSizeChips();
  studio.update();
  if (modal.el && modal.el.classList.contains("open")) renderModal();
  renderUploadInfo();
});
