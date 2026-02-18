# AgriComply Unified Website

Single website combining:
- **AgriComply AI** (Dashboard, Growth, Vault, Compliance, Loan Calculator)
- **Chatbot** (Gemini AI assistant)
- **AI/ML features** (scheme recommendations, loan eligibility)

## Quick Run

```powershell
.\run.ps1
```

Then open **http://localhost:5001**

## Manual Run

1. **Terminal 1 – Node backend** (auth, vault, growth, compliance):
   ```powershell
   cd AgriComply-AI-main\server
   npm install
   node app.js
   ```
   Runs on port 5000.

2. **Terminal 2 – Flask** (chat, AI, frontend):
   ```powershell
   .\.venv\Scripts\Activate.ps1
   pip install -r requirements.txt
   python app.py
   ```
   Runs on port 5001.

3. Open **http://localhost:5001**

## Requirements

- **Node.js** – for AgriComply backend (MySQL required for auth/vault)
- **Python 3** with venv – for chatbot + AI
- **`.env`** in project root or `AgriComply-AI-main/server/`:
  - `GOOGLE_API_KEY` or `GEMINI_API_KEY` – for AI features
  - Node server: `DB_HOST`, `DB_USER`, `DB_PASSWORD`, `DB_NAME`, `JWT_SECRET`

## Architecture

| Port | Service          | Role                                          |
|------|------------------|-----------------------------------------------|
| 5001 | Flask            | Serves AgriComply frontend, `/chat`, `/recommend`, `/growth/advanced-check`, proxies `/api` to Node |
| 5000 | Node (Express)   | Auth, Vault, Compliance, Growth (calls Flask for AI) |

## Adding a Custom ML Model

To add your own ML model (e.g. crop prediction, disease detection):

1. Add a new route in `app.py`:
   ```python
   @app.route("/predict", methods=["POST"])
   def predict():
       # Load your model, run inference, return JSON
       pass
   ```

2. Call `/predict` from the frontend or chatbot.
