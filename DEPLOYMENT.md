# Deploy AgriComply

This guide covers deploying the full AgriComply site (Node + Flask + MySQL) to **Render**.

## Prerequisites

- GitHub/GitLab/Bitbucket repo with your code
- [Render](https://render.com) account (free tier works)
- [PlanetScale](https://planetscale.com) account (free MySQL) OR Render MySQL

---

## Step 1: Set Up MySQL Database

### Option A: PlanetScale (Free)

1. Go to [PlanetScale](https://planetscale.com) → Create database `agricomply_db`
2. Get connection details: Host, Username, Password (create a password in Settings)
3. Run the schema: Connect via MySQL client or PlanetScale console, run `AgriComply-AI-main/server/schema.sql`

### Option B: Render MySQL

1. In Render Dashboard → New → MySQL
2. Create database, note `Internal Database URL` or host/user/password
3. Run `schema.sql` to create tables

---

## Step 2: Build Frontend for Production

Run before pushing to Git (so `dist` is committed with correct API URLs):

```powershell
.\build-for-deploy.ps1
```

Or manually:

```powershell
cd AgriComply-AI-main\client
$env:VITE_API_BASE_URL="/api"
$env:VITE_CHATBOT_API_URL="/chat"
npm run build
cd ..\..
```

Commit the updated `AgriComply-AI-main/client/dist` folder.

---

## Step 3: Deploy to Render

### Via Blueprint (Recommended)

1. Go to [Render Dashboard](https://dashboard.render.com) → **New** → **Blueprint**
2. Connect your Git repo
3. Render will detect `render.yaml` — click **Apply**
4. You’ll get **2 Web Services**: `agricomply-node` and `agricomply-web`

### Environment Variables (Required)

Set these in each service's **Environment** tab:

**agricomply-node**

| Key | Value |
|-----|-------|
| DB_HOST | Your MySQL host |
| DB_USER | MySQL username |
| DB_PASSWORD | MySQL password |
| PYTHON_URL | `https://agricomply-web-XXXX.onrender.com` (your Flask URL) |
| GOOGLE_API_KEY | Your Gemini API key |

**agricomply-web** (Flask)

| Key | Value |
|-----|-------|
| NODE_API_URL | `https://agricomply-node-XXXX.onrender.com` (your Node URL) |
| GOOGLE_API_KEY | Your Gemini API key |

> **Important:** Replace ` agricomply-web-XXXX` and `agricomply-node-XXXX` with your actual Render service URLs. After first deploy, copy each service’s URL into the other service’s env vars.

---

## Step 4: CORS and Domain

The Node server uses `cors()` (all origins). For production, consider restricting:

```javascript
// AgriComply-AI-main/server/app.js
app.use(cors({ origin: 'https://agricomply-web-XXXX.onrender.com' }));
```

---

## Your Live URLs

- **Main site:** `https://agricomply-web-XXXX.onrender.com` ← Use this
- Node API: `https://agricomply-node-XXXX.onrender.com` (for env vars only)

---

## Alternative: Railway

1. Create [Railway](https://railway.app) project
2. Add **MySQL** (or connect PlanetScale)
3. Add **Node** service → root: `AgriComply-AI-main/server`
4. Add **Python** service → root: repo root, start: `gunicorn app:app --bind 0.0.0.0:$PORT`
5. Set env vars for both services (same as above)
6. Set Flask as the public service and use its URL

---

## Notes

- **File uploads (Vault):** Render’s disk is ephemeral. For persistent storage, use S3 or similar.
- **Free tier:** Render free services sleep after ~15 min idle; first request may be slow.
- **API key:** Get a Gemini API key from [Google AI Studio](https://aistudio.google.com/).
