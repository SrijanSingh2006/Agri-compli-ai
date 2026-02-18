from pathlib import Path
from flask import Flask, request, jsonify, send_from_directory, Response
from flask_cors import CORS
import google.generativeai as genai
import base64
import io
import json
import os
import urllib.request
import urllib.error
from urllib.parse import urljoin
import traceback
import time

BASE_DIR = Path(__file__).resolve().parent
# AgriComply main site first (Dashboard, Growth, Vault, Compliance + Chatbot)
# Then fallback to other frontend builds
DIST_CANDIDATES = [
    BASE_DIR / "AgriComply-AI-main" / "client" / "dist",
    BASE_DIR / "frontend" / "dist",
    BASE_DIR / "frontend" / "frontend" / "dist",
]
NODE_API_URL = os.environ.get("NODE_API_URL", "http://127.0.0.1:5000")
ENV_CANDIDATES = [
    BASE_DIR / ".env",
    BASE_DIR / "AgriComply-AI-main" / "server" / ".env",
]

app = Flask(__name__)
CORS(app)


def load_env_from_files():
    """
    Lightweight .env loader (without adding external dependency).
    """
    for index, env_path in enumerate(ENV_CANDIDATES):
        if not env_path.exists():
            continue
        # Secondary env (Node server env) may include PORT=5000.
        # Do not import PORT from there, or chatbot may bind to 5000 unexpectedly.
        skip_port = index > 0
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            if skip_port and key == "PORT":
                continue
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


load_env_from_files()

# ==========================================
# SET API KEY IN ENV FOR DEPLOYMENT
# Supports both GOOGLE_API_KEY and GEMINI_API_KEY
# ==========================================
API_KEY_SOURCE = None
ACTIVE_API_KEY = os.environ.get("GOOGLE_API_KEY")
if ACTIVE_API_KEY:
    API_KEY_SOURCE = "GOOGLE_API_KEY"
else:
    ACTIVE_API_KEY = os.environ.get("GEMINI_API_KEY")
    if ACTIVE_API_KEY:
        API_KEY_SOURCE = "GEMINI_API_KEY"

if ACTIVE_API_KEY:
    genai.configure(api_key=ACTIVE_API_KEY)
else:
    print("WARNING: GOOGLE_API_KEY/GEMINI_API_KEY is not set. AI model calls will use fallback responses.")

# --- SMART MODEL LIST ---
# The backend will try these models in order.
# If one fails or is busy, it automatically switches to the next.
# NOTE: Older 1.x models are retired for many keys and return 404.
MODELS_TO_TRY = [
    "gemini-2.5-flash",
    "gemini-flash-latest",
    "gemini-2.0-flash",
    "gemini-2.0-flash-lite",
]

def resolve_frontend_dist():
    """
    Resolve frontend dist path even if an extra nested frontend folder exists.
    """
    existing = [p for p in DIST_CANDIDATES if (p / "index.html").exists()]
    if not existing:
        return DIST_CANDIDATES[0]
    return max(existing, key=lambda p: (p / "index.html").stat().st_mtime)


def generate_with_fallback(prompt_parts):
    """
    Tries to generate content using the list of models.
    If one fails (404 or 429), it automatically tries the next.
    """
    last_error = ""

    for model_name in MODELS_TO_TRY:
        try:
            print(f"Trying model: {model_name}...")
            model = genai.GenerativeModel(model_name)

            response = model.generate_content(prompt_parts)
            print(f"   Success with {model_name}")
            return response.text

        except Exception as e:
            error_str = str(e)
            print(f"   Failed with {model_name}: {error_str}")
            last_error = error_str

            # If it is a rate limit (429), wait briefly before trying the next model.
            if "429" in error_str:
                time.sleep(1)
            continue

    # If all models fail, return the specific error for frontend visibility.
    raise Exception(f"All models failed. Last error: {last_error}")


def local_fallback_response(user_message, selected_language):
    """
    Fallback reply when Gemini is unavailable (rate limit, outage, model errors).
    Keeps the app functional instead of returning a hard system error.
    """
    text = (user_message or "").lower()

    if "scheme" in text or "yojana" in text:
        return (
            "I could not fetch live AI data right now. Please verify current schemes on official portals: "
            "PM-KISAN, PMFBY, and your state agriculture department website."
        )
    if "loan" in text:
        return (
            "AI service is temporarily unavailable. For loans, check KCC eligibility, PMEGP, "
            "and your nearest bank branch with Aadhaar, land proof, and bank passbook."
        )
    if "document" in text or "aadhaar" in text or "land" in text:
        return (
            "AI service is temporarily unavailable. Keep Aadhaar, land record, and bank details ready. "
            "I can process them once the AI service is back."
        )

    if selected_language == "Hindi":
        return "AI service abhi temporarily unavailable hai. Kripya kuch der baad phir se try karein."
    if selected_language == "Tamil":
        return "AI service தற்காலிகமாக கிடைக்கவில்லை. தயவுசெய்து சிறிது நேரம் கழித்து மீண்டும் முயற்சிக்கவும்."
    if selected_language == "Telugu":
        return "AI service తాత్కాలికంగా అందుబాటులో లేదు. దయచేసి కొంతసేపటి తర్వాత మళ్లీ ప్రయత్నించండి."
    if selected_language == "Bengali":
        return "AI service আপাতত উপলব্ধ নয়। কিছুক্ষণ পরে আবার চেষ্টা করুন।"
    if selected_language == "Bhojpuri":
        return "AI service अभी उपलब्ध नइखे। थोड़ा देर बाद फेर कोशिश करीं।"

    return "AI service is temporarily unavailable. Please try again in a few minutes."


def parse_json_response(text):
    """
    Safely parse JSON coming from Gemini (handles fenced markdown blocks).
    """
    if not text:
        return {}

    cleaned = text.replace("```json", "").replace("```", "").strip()
    return json.loads(cleaned)


def normalize_required_docs(value):
    """
    Normalize required_docs to a clean list of strings.
    Accepts list or free-form comma/newline separated string.
    """
    if isinstance(value, list):
        return [str(v).strip() for v in value if str(v).strip()]

    if isinstance(value, str):
        text = value.replace("\r", "\n")
        if "," in text:
            raw_parts = [p.strip() for p in text.split(",")]
        else:
            raw_parts = [p.strip() for p in text.split("\n")]

        cleaned = []
        for part in raw_parts:
            part = part.lstrip("-•* ").strip()
            if part:
                cleaned.append(part)
        return cleaned

    return []


def compute_missing_and_score(item, user_tags):
    required = normalize_required_docs(item.get("required_docs", []) or [])
    item["required_docs"] = required
    missing = [doc for doc in required if doc not in user_tags]
    if required:
        score = int(round(((len(required) - len(missing)) / len(required)) * 100))
    else:
        score = 80
    item["missing_docs"] = missing
    item["match_score"] = score
    item["is_eligible"] = len(missing) == 0
    return item


@app.route("/chat", methods=["POST"])
def chat():
    try:
        data = request.json or {}
        user_message = data.get("message", "")
        image_data = data.get("image")

        # 1. GET LANGUAGE FROM FRONTEND
        language_code = data.get("language", "en")

        # 2. MAP CODES TO FULL NAMES
        lang_map = {
            "en": "English",
            "hi": "Hindi",
            "ta": "Tamil",
            "te": "Telugu",
            "bn": "Bengali",
            "bho": "Bhojpuri",
        }
        selected_language = lang_map.get(language_code, "English")

        # 3. CREATE SYSTEM INSTRUCTION
        system_instruction = f"""
        You are AgriComply AI, a helpful assistant for Indian farmers.

        CRITICAL INSTRUCTION: You MUST reply in {selected_language} language ONLY.

        - If the user asks in English but the setting is {selected_language}, reply in {selected_language}.
        - If the user uploads a document, summarize it in {selected_language}.
        - Keep answers short, simple, and helpful for farmers.
        """

        # Prepare content for Gemini
        prompt_parts = [system_instruction, f"\nUser Question: {user_message}"]

        if image_data:
            try:
                # Handle image string format
                if "," in image_data:
                    image_data = image_data.split(",", 1)[1]
                image_bytes = base64.b64decode(image_data)
                img = Image.open(io.BytesIO(image_bytes))
                prompt_parts.append(img)
            except Exception as img_error:
                print(f"Image processing error: {img_error}")
                return jsonify({"reply": "Error processing your image. Please try uploading again."})

        # Call Gemini with model fallback. If all models fail, return local fallback text.
        try:
            bot_reply = generate_with_fallback(prompt_parts)
        except Exception as model_error:
            print(f"MODEL FAILURE (using local fallback): {model_error}")
            bot_reply = local_fallback_response(user_message, selected_language)

        return jsonify({"reply": bot_reply})

    except Exception as e:
        error_message = str(e)
        print(f"CRITICAL FAILURE: {error_message}")
        traceback.print_exc()
        return jsonify({"reply": f"System error: {error_message}"})


@app.route("/health", methods=["GET"])
def health():
    return jsonify(
        {
            "status": "ok",
            "models": MODELS_TO_TRY,
            "primary_model": MODELS_TO_TRY[0],
            "api_key_configured": bool(ACTIVE_API_KEY),
            "api_key_source": API_KEY_SOURCE,
        }
    )


@app.route("/recommend", methods=["POST"])
def recommend():
    """
    Supports Growth feature in Node backend with Gemini + fallback.
    """
    data = request.json or {}
    user_docs = data.get("user_docs", []) or []
    profile = data.get("profile", {}) or {}
    role = profile.get("role", "Farmer")
    location = profile.get("location", "India")

    fallback = {
        "schemes": [
            {
                "name": "PM-KISAN",
                "type": "Central Govt",
                "description": "Income support for eligible landholding farmers.",
                "required_docs": ["Aadhaar", "LandRecord", "BankStatement"],
            },
            {
                "name": "PMFBY",
                "type": "Insurance",
                "description": "Crop insurance support against natural losses.",
                "required_docs": ["Aadhaar", "LandRecord"],
            },
        ],
        "loans": [
            {
                "name": "SBI Kisan Credit Card",
                "bank": "State Bank of India",
                "interest_rate": "7% p.a.",
                "description": "Short-term crop working capital.",
                "required_docs": ["Aadhaar", "PAN", "LandRecord"],
            },
            {
                "name": "Agri Term Loan",
                "bank": "Public Sector Banks",
                "interest_rate": "9.5% p.a.",
                "description": "Loan support for farm growth and equipment.",
                "required_docs": ["Aadhaar", "PAN", "BankStatement"],
            },
        ],
    }

    prompt = f"""
    You are an Indian agriculture finance assistant.
    Return STRICT JSON with keys "schemes" and "loans".

    User role: {role}
    Location: {location}
    Uploaded docs: {user_docs}

    Each scheme/loan object must include:
    - name
    - description
    - type (for schemes) OR bank and interest_rate (for loans)
    - required_docs (array)

    Return 2-4 schemes and 2-4 loans.
    """

    try:
        raw = generate_with_fallback([prompt])
        parsed = parse_json_response(raw)
        schemes = parsed.get("schemes", []) if isinstance(parsed, dict) else []
        loans = parsed.get("loans", []) if isinstance(parsed, dict) else []

        if not schemes:
            schemes = fallback["schemes"]
        if not loans:
            loans = fallback["loans"]
    except Exception as e:
        print(f"RECOMMEND FAILURE (using fallback): {e}")
        schemes = fallback["schemes"]
        loans = fallback["loans"]

    schemes = [compute_missing_and_score(item, user_docs) for item in schemes]
    loans = [compute_missing_and_score(item, user_docs) for item in loans]

    return jsonify({"schemes": schemes, "loans": loans})


@app.route("/growth/advanced-check", methods=["POST"])
def growth_advanced_check():
    """
    Supports Loan Calculator AI check endpoint.
    """
    data = request.json or {}
    amount = data.get("amount", "")
    tenure = data.get("tenure", "")
    bank = data.get("bank", "Any Bank")

    raw_docs = data.get("user_docs", []) or []
    user_docs = []
    for entry in raw_docs:
        if isinstance(entry, dict):
            user_docs.append(entry.get("tag", "Unknown"))
        else:
            user_docs.append(str(entry))

    prompt = f"""
    You are an Indian loan eligibility analyst for farmers.
    Return STRICT JSON with:
    - eligible (boolean)
    - confidence_score (0-100)
    - reasoning (short paragraph)
    - suggestion (actionable next step)

    Loan amount: {amount}
    Tenure years: {tenure}
    Preferred bank: {bank}
    User docs: {user_docs}
    """

    try:
        raw = generate_with_fallback([prompt])
        parsed = parse_json_response(raw)

        if not isinstance(parsed, dict):
            raise ValueError("Parsed response is not an object.")

        parsed.setdefault("eligible", False)
        parsed.setdefault("confidence_score", 60)
        parsed.setdefault("reasoning", "Basic eligibility estimated from provided details.")
        parsed.setdefault("suggestion", "Upload complete documents and compare lender terms.")
        parsed["analyzed_docs_count"] = len(user_docs)
        return jsonify(parsed)
    except Exception as e:
        print(f"ADVANCED CHECK FAILURE (using fallback): {e}")

        must_have = {"Aadhaar", "PAN", "LandRecord", "BankStatement"}
        coverage = len(must_have.intersection(set(user_docs)))
        confidence = max(25, min(95, 45 + coverage * 12))
        eligible = coverage >= 2

        return jsonify(
            {
                "eligible": eligible,
                "confidence_score": confidence,
                "reasoning": "Fallback scoring used because AI response was unavailable.",
                "suggestion": "Improve document coverage to increase approval probability.",
                "analyzed_docs_count": len(user_docs),
            }
        )


def proxy_to_node(path, method="GET", data=None):
    """Forward /api/* requests to the Node backend."""
    qs = request.query_string.decode() if request.query_string else ""
    url = urljoin(NODE_API_URL + "/", f"api/{path}" + ("?" + qs if qs else ""))
    try:
        headers = {}
        if data:
            headers["Content-Type"] = "application/json"
        token = request.headers.get("Authorization")
        if token:
            headers["Authorization"] = token
        req = urllib.request.Request(url, data=data, method=method.upper(), headers=headers)
        with urllib.request.urlopen(req, timeout=30) as resp:
            body = resp.read()
            return Response(body, status=resp.status, mimetype="application/json")
    except urllib.error.HTTPError as e:
        return Response(e.read(), status=e.code, mimetype="application/json")
    except Exception as e:
        print(f"Proxy error: {e}")
        return jsonify({"error": f"Backend unavailable: {e}"}), 502


@app.route("/api/<path:subpath>", methods=["GET", "POST", "PUT", "PATCH", "DELETE"])
def api_proxy(subpath):
    """Proxy API calls to Node server (auth, vault, growth, compliance)."""
    data = None
    if request.method in ("POST", "PUT", "PATCH") and request.get_data():
        data = request.get_data()
    return proxy_to_node(subpath, method=request.method, data=data)


@app.route("/", defaults={"path": ""}, methods=["GET"])
@app.route("/<path:path>", methods=["GET"])
def serve_frontend(path):
    """
    Serve the Vite build so frontend and backend run from one Flask process.
    """
    frontend_dist = resolve_frontend_dist()

    if path:
        requested = frontend_dist / path
        if requested.exists() and requested.is_file():
            return send_from_directory(frontend_dist, path)
        # Missing static asset should return 404 instead of index.html.
        if "." in path:
            return "Not found", 404

    index_file = frontend_dist / "index.html"
    if index_file.exists():
        return send_from_directory(frontend_dist, "index.html")

    return (
        "Frontend build not found. Build it with: "
        "cd frontend && npm install && npm run build",
        404,
    )


if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5001))
    print(f"\n\nSERVER STARTED ON PORT {port}")
    app.run(host="0.0.0.0", debug=False, port=port)
