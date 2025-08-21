
from fastapi import FastAPI
from pydantic import BaseModel
from starlette.middleware.cors import CORSMiddleware
import joblib, re, tldextract, validators

app = FastAPI(title="PhishGuard API", version="0.1.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten in production
    allow_methods=["*"], allow_headers=["*"]
)

# Load model (place the joblib file in the same folder)
pipe = joblib.load("phishing_detector_logreg_tfidf.joblib")

class EmailIn(BaseModel):
    text: str

class UrlIn(BaseModel):
    url: str

def heuristic_reasons(text: str):
    reasons = []
    if re.search(r'\\b(urgent|suspend|verify|24\\s*hours|final notice|immediately|password)\\b', text.lower()):
        reasons.append("Urgent/coercive language")
    if re.search(r'http[s]?://[^\\s]+', text.lower()):
        reasons.append("Contains link(s)")
    if re.search(r'attachment|invoice|billing|reward|verify|login', text.lower()):
        reasons.append("Sensitive keywords")
    return reasons

@app.post("/scoreEmail")
def score_email(inp: EmailIn):
    prob = float(pipe.predict_proba([inp.text])[:,1][0])
    label = "phish" if prob >= 0.5 else "ham"
    return {"score": prob, "label": label, "reasons": heuristic_reasons(inp.text)}

@app.post("/scoreUrl")
def score_url(inp: UrlIn):
    u = inp.url.strip()
    verdict = "invalid"
    score = 0.0
    reasons = []
    if validators.url(u):
        ext = tldextract.extract(u)
        # Simple red flags
        if "-" in ext.domain or ext.suffix in {"biz","top","icu"}:
            score += 0.25; reasons.append("Suspicious domain pattern/TLD")
        if re.search(r'(login|secure|verify|bill|pay)', u.lower()):
            score += 0.25; reasons.append("Sensitive keywords in URL path")
        if len(ext.subdomain.split(".")) >= 3:
            score += 0.25; reasons.append("Deep subdomain nesting")
        verdict = "phish" if score >= 0.5 else "unknown/safe"
    return {"score": score, "label": verdict, "reasons": reasons}
