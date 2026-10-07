/* =========================================================
   L'atelier UF – STARTSIDAN
   Storlekar, "från"-priser och teamet byggs från config.js.
   ========================================================= */

function minPrice(table) {
  return Math.min(...STORLEKAR.map(s => Number(table[s]) || Infinity));
}

function renderHome() {
  document.querySelectorAll("[data-price-from]").forEach(el => {
    el.textContent = formatPrice(minPrice(PRISER[el.dataset.priceFrom]));
  });

  const sizes = document.getElementById("sizes");
  if (sizes) {
    sizes.innerHTML = STORLEKAR.map(s => {
      const [w, h] = s.split("x");
      return `<div class="size-item">
        <div class="size-frame" style="--w:${w};--h:${h}"></div>
        <div class="size-name">${w}×${h}</div>
        <div class="size-price">${t("sizes.std")} <b>${formatPrice(PRISER.standard[s])}</b><br>${t("sizes.own")} <b>${formatPrice(PRISER.egen[s])}</b></div>
      </div>`;
    }).join("");
  }

  const team = document.getElementById("team");
  if (team) {
    team.innerHTML = TEAM.map((m, i) => {
      const initials = m.namn.split(" ").map(p => p[0] || "").join("").slice(0, 2);
      return `<div class="member reveal" style="--d:${(i % 3) * 0.12}s">
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
    if (document.body.classList.contains("loaded")) initReveal(team);
  }
}

document.addEventListener("DOMContentLoaded", renderHome);
document.addEventListener("langchange", renderHome);
