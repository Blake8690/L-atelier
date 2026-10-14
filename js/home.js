/* =========================================================
   L'atelier UF – STARTSIDAN
   Infoflikar, priskort och teamet byggs från config.js.
   ========================================================= */

const INFO_TABS = ["om-oss", "sa-funkar", "priser", "faq", "kontakt"];

/* ---------------- Infoflikar ---------------- */
function selectInfo(name, opts = {}) {
  if (!INFO_TABS.includes(name)) name = "om-oss";
  document.querySelectorAll(".info-tabs .tab").forEach(tab => {
    const on = tab.dataset.info === name;
    tab.setAttribute("aria-selected", String(on));
    tab.tabIndex = on ? 0 : -1;
    if (on && opts.focus) tab.focus();
  });
  INFO_TABS.forEach(n => { document.getElementById("ipanel-" + n).hidden = n !== name; });
  if (opts.scroll) {
    document.getElementById("info").scrollIntoView({ behavior: REDUCED_MOTION ? "auto" : "smooth" });
  }
}

function initInfoTabs() {
  const tabs = [...document.querySelectorAll(".info-tabs .tab")];
  tabs.forEach((tab, i) => {
    tab.addEventListener("click", () => {
      selectInfo(tab.dataset.info);
      history.replaceState(null, "", "#" + tab.dataset.info);
    });
    tab.addEventListener("keydown", e => {
      let j = null;
      if (e.key === "ArrowRight") j = (i + 1) % tabs.length;
      if (e.key === "ArrowLeft") j = (i - 1 + tabs.length) % tabs.length;
      if (j !== null) { e.preventDefault(); selectInfo(tabs[j].dataset.info, { focus: true }); }
    });
  });
  // Länkar som index.html#kontakt öppnar rätt flik
  const fromHash = () => {
    const h = location.hash.replace("#", "");
    if (INFO_TABS.includes(h)) selectInfo(h, { scroll: true });
  };
  window.addEventListener("hashchange", fromHash);
  // Klick på menyn när man redan står på samma flik
  document.querySelectorAll('a[href^="index.html#"], a[href^="#"]').forEach(a => {
    const h = a.getAttribute("href").split("#")[1];
    if (INFO_TABS.includes(h)) a.addEventListener("click", () => setTimeout(() => selectInfo(h, { scroll: true }), 0));
  });
  fromHash();
}

/* ---------------- Priser ---------------- */
function renderHome() {
  const cards = document.getElementById("price-cards");
  if (cards) {
    cards.innerHTML = PRODUKTER.map(p => `
      <div class="price-card">
        <h3>${t("product." + p)}</h3>
        <p class="muted">${t("product." + p + ".text")}</p>
        <ul class="price-list">
          ${sizesFor(p).map(s => {
            const [w, h] = s.split("x");
            return `<li><span class="price-frame" style="--w:${w};--h:${h}"></span><span class="price-size">${w}×${h} cm</span><span class="price-val">${formatPrice(priceFor(p, s))}</span></li>`;
          }).join("")}
        </ul>
      </div>`).join("");
  }

  const team = document.getElementById("team");
  if (team) {
    team.innerHTML = TEAM.map(m => {
      const initials = m.namn.split(" ").map(p => p[0] || "").join("").slice(0, 2);
      return `<div class="member">
        <div class="member-photo">
          <img src="${m.bild}" alt="${m.namn}" loading="lazy" data-avatar="${initials}">
        </div>
        <div class="member-name">${m.namn}</div>
        <div class="member-role">${m.roll[LANG] || m.roll.sv}</div>
      </div>`;
    }).join("");
    // Saknad teambild → rund platshållare med initialer
    team.querySelectorAll("img[data-avatar]").forEach(img => {
      const swap = () => {
        const d = document.createElement("div");
        d.className = "avatar-ph";
        d.setAttribute("aria-hidden", "true");
        d.textContent = img.dataset.avatar;
        img.replaceWith(d);
      };
      if (img.complete && img.naturalWidth === 0) swap();
      else img.addEventListener("error", swap, { once: true });
    });
  }
}

document.addEventListener("DOMContentLoaded", () => {
  renderHome();
  initInfoTabs();
});
document.addEventListener("langchange", renderHome);
