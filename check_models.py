import os
from pathlib import Path
import google.generativeai as genai

BASE_DIR = Path(__file__).resolve().parent
ENV_CANDIDATES = [
    BASE_DIR / ".env",
    BASE_DIR / "AgriComply-AI-main" / "server" / ".env",
]


def load_env_from_files():
    for env_path in ENV_CANDIDATES:
        if not env_path.exists():
            continue
        for raw_line in env_path.read_text(encoding="utf-8").splitlines():
            line = raw_line.strip()
            if not line or line.startswith("#") or "=" not in line:
                continue
            key, value = line.split("=", 1)
            key = key.strip()
            value = value.strip().strip('"').strip("'")
            if key and key not in os.environ:
                os.environ[key] = value


load_env_from_files()
ACTIVE_API_KEY = os.getenv("GOOGLE_API_KEY") or os.getenv("GEMINI_API_KEY")
if not ACTIVE_API_KEY:
    raise ValueError("GOOGLE_API_KEY/GEMINI_API_KEY is missing. Add it to your .env before running this check.")

genai.configure(api_key=ACTIVE_API_KEY)

print("Checking available models...")
try:
    for m in genai.list_models():
        if "generateContent" in m.supported_generation_methods:
            print(f"FOUND: {m.name}")
except Exception as e:
    print(f"Error: {e}")
