
const API_BASE = "http://127.0.0.1:8080";

async function scoreEmail(text) {
  const res = await fetch(`${API_BASE}/scoreEmail`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ text })
  });
  return res.json();
}

async function scoreUrl(url) {
  const res = await fetch(`${API_BASE}/scoreUrl`, {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({ url })
  });
  return res.json();
}

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  (async () => {
    if (msg.type === "SCORE_EMAIL") sendResponse(await scoreEmail(msg.text));
    if (msg.type === "SCORE_URL")   sendResponse(await scoreUrl(msg.url));
  })();
  return true;
});
