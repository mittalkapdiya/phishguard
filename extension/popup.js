
const $ = (s) => document.querySelector(s);

$("#checkUrl").onclick = async () => {
  const url = $("#url").value.trim();
  $("#urlResult").textContent = "Scanning...";
  try {
    const res = await chrome.runtime.sendMessage({ type: "SCORE_URL", url });
    $("#urlResult").innerHTML = renderResult(res);
  } catch (e) {
    $("#urlResult").textContent = "Error contacting API.";
  }
}

$("#checkEmail").onclick = async () => {
  const text = $("#emailText").value;
  $("#emailResult").textContent = "Scanning...";
  try {
    const res = await chrome.runtime.sendMessage({ type: "SCORE_EMAIL", text });
    $("#emailResult").innerHTML = renderResult(res);
  } catch (e) {
    $("#emailResult").textContent = "Error contacting API.";
  }
}

function renderResult(res) {
  const label = res.label === "phish" ? `<span class="warn">PHISH</span>` : `<span class="ok">${(res.label||'SAFE').toUpperCase()}</span>`;
  const score = (res.score ?? 0).toFixed(2);
  const reasons = (res.reasons || []).map(r => `<span class="pill">${r}</span>`).join("");
  return `<div class="score">Result: ${label} — score ${score}</div><div class="reasons">${reasons}</div>`;
}
