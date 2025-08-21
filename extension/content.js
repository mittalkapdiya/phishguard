
const bannerCss = `
.pg-banner { position: fixed; right: 16px; bottom: 16px; background:#222; color:#fff;
  padding:10px 12px; border-radius:8px; font: 13px system-ui; box-shadow:0 4px 16px rgba(0,0,0,.25); z-index: 2147483647;}
.pg-badge { display:inline-block; margin-left:8px; padding:2px 6px; border-radius:10px; background:#ffdfdf; color:#900; font-weight:600;}
`;
const style = document.createElement("style"); style.textContent = bannerCss; document.head.appendChild(style);

function showBanner(text) {
  let el = document.querySelector(".pg-banner");
  if (!el) { el = document.createElement("div"); el.className = "pg-banner"; document.body.appendChild(el); }
  el.innerHTML = text;
  setTimeout(()=> el.remove(), 8000);
}

async function scanLinks() {
  const anchors = Array.from(document.querySelectorAll("a[href^='http']"));
  const sample = anchors.slice(0, 10);
  let flagged = 0;
  for (const a of sample) {
    try {
      const res = await chrome.runtime.sendMessage({ type: "SCORE_URL", url: a.href });
      if (res.label === "phish") {
        flagged++;
        a.style.outline = "2px solid #b00020";
        a.title = `PhishGuard: Suspicious (${(res.score||0).toFixed(2)})`;
        const badge = document.createElement("span");
        badge.className = "pg-badge"; badge.textContent = "⚠ suspicious";
        a.appendChild(badge);
      }
    } catch {}
  }
  if (flagged > 0) showBanner(`PhishGuard found ${flagged} suspicious link(s) on this page.`);
}

if (document.readyState === "complete") scanLinks();
else window.addEventListener("load", scanLinks);
