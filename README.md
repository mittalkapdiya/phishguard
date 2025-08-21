
# PhishGuard — AI Phishing Protection (Demo)

This package contains:
- **extension/** — Chrome/Edge Manifest V3 extension
- **backend/** — FastAPI API serving the phishing model

### Quick start

1) **Backend**
```bash
cd backend
pip install -r requirements.txt
# Put the model file here (already included in this zip): phishing_detector_logreg_tfidf.joblib
uvicorn app:app --host 0.0.0.0 --port 8080 --reload
```
API endpoints:
- `POST /scoreEmail` → `{"text": "email content"}`
- `POST /scoreUrl` → `{"url": "https://example.com"}`

> In production, serve over HTTPS and restrict CORS to your extension's ID(s).

2) **Extension**
- Go to `chrome://extensions` → enable Developer Mode → **Load unpacked** → select the `extension/` folder.
- Use the popup to scan text/URLs. The content script will auto-scan a page's first ~10 links and annotate suspicious ones.

### Security & Privacy (important)
- This is a demo. Do not send sensitive emails to third-party servers.
- Tighten CORS, add authentication (e.g., signed tokens), rate limiting, and logging.
- Consider an **on-device model** for privacy, and use cloud checks only for high-risk cases.
