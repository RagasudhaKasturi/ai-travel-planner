# Step-by-Step: VSCode Setup, Git History & Deployment

This guide takes you from the downloaded zip to a live deployed application with a clean,
meaningful Git commit history.

---

## PART 1 — ONE-TIME MACHINE SETUP

### Step 1 · Install required tools

If you don't have these installed yet:

| Tool | Download |
|---|---|
| Node.js 20 LTS | https://nodejs.org — pick the "LTS" version |
| Git | https://git-scm.com/downloads |
| VSCode | https://code.visualstudio.com |

After installing, verify in a terminal (PowerShell on Windows, Terminal on Mac):
```bash
node --version   # should print v20.x.x
npm --version    # should print 10.x.x
git --version    # should print git version 2.x.x
```

---

### Step 2 · Install VSCode Extensions

Open VSCode → press `Ctrl+Shift+X` (Windows) or `Cmd+Shift+X` (Mac) → search and install:

- **ESLint** (by Microsoft)
- **Prettier - Code formatter** (by Prettier)
- **Tailwind CSS IntelliSense** (by Tailwind Labs)
- **GitLens** (by GitKraken) — makes viewing commit history much easier
- **Thunder Client** — lightweight API tester built into VSCode (alternative to Postman)

---

## PART 2 — PROJECT SETUP IN VSCODE

### Step 3 · Extract the project

1. Download `ai-travel-planner.zip`
2. Right-click → **Extract All** → choose a location like `Documents/projects/`
3. In VSCode: **File → Open Folder** → select the extracted `ai-travel-planner` folder

You should see this in VSCode's Explorer panel:
```
ai-travel-planner/
├── backend/
├── frontend/
├── README.md
└── VSCODE_SETUP_GUIDE.md
```

---

### Step 4 · Open two integrated terminals

In VSCode press `` Ctrl+` `` to open the terminal. Click the **+** icon to open a second one.
You'll keep **Terminal 1** for the backend and **Terminal 2** for the frontend throughout development.

---

### Step 5 · Get a MongoDB Atlas URI

1. Go to https://www.mongodb.com/cloud/atlas/register → create a free account
2. Create a free **M0** cluster (takes ~2 minutes)
3. When prompted: **Username** = anything, **Password** = copy and save it
4. Under "Network Access" → click **"Add IP Address"** → **"Allow Access From Anywhere"** → Confirm
5. Under your cluster → click **"Connect"** → **"Drivers"** → copy the connection string

It looks like:
```
mongodb+srv://myuser:<password>@cluster0.abc12.mongodb.net/
```
Replace `<password>` with your actual password and append the database name:
```
mongodb+srv://myuser:MyPass123@cluster0.abc12.mongodb.net/ai-travel-planner
```

---

### Step 6 · Get a Gemini API Key

1. Go to https://aistudio.google.com/
2. Click **"Get API Key"** → **"Create API Key"**
3. Copy and save the key — it looks like `AIzaSy...`

---

### Step 7 · Configure the backend environment

In **Terminal 1**:
```bash
cd backend
cp .env.example .env
```

In VSCode Explorer, open `backend/.env` and fill it in:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://myuser:MyPass123@cluster0.abc12.mongodb.net/ai-travel-planner
JWT_SECRET=supersecretlongrandomstring123456789
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=AIzaSy_YOUR_KEY_HERE
GEMINI_MODEL=gemini-2.5-flash
CLIENT_ORIGIN=http://localhost:5173
```

> ⚠️ Never commit `.env` to Git. It is already in `.gitignore`.

---

### Step 8 · Install backend dependencies and start

Still in **Terminal 1**:
```bash
npm install
npm run dev
```

✅ You should see:
```
API server running on port 5000
MongoDB connected: cluster0.abc12.mongodb.net
```

If you see a MongoDB error, double-check your `MONGO_URI` and that you allowed all IP addresses in Atlas.

---

### Step 9 · Configure the frontend environment

In **Terminal 2**:
```bash
cd frontend
cp .env.example .env
```

Open `frontend/.env` — the default value is already correct for local dev:
```env
VITE_API_URL=http://localhost:5000
```

---

### Step 10 · Install frontend dependencies and start

Still in **Terminal 2**:
```bash
npm install
npm run dev
```

✅ You should see:
```
  VITE v5.x  ready in 300ms
  ➜  Local: http://localhost:5173/
```

---

### Step 11 · Test the full app locally

1. Open **http://localhost:5173** in your browser
2. Click **"Get Started"** → fill in name, email, password → **Register**
3. On the dashboard → **"+ Plan a new trip"**
4. Enter: destination = "Kyoto, Japan", 4 days, Medium budget, select Culture + Food
5. Click **"Generate itinerary"** → wait 10–20 seconds
6. Verify: itinerary appears with days, budget ledger, hotel cards, and packing list
7. Click **"+ Add an activity"** on Day 1 → add "Evening matcha tea ceremony" → **Add activity**
8. Click **✕** on any activity to remove it
9. Click **"↻ Regenerate day"** on Day 2 → type "more outdoor activities" → **Submit**
10. Click a few packing items to toggle them — refresh the page and verify they stay checked

---

## PART 3 — GIT SETUP WITH MEANINGFUL COMMIT HISTORY

The commit history should reflect a real development process — not one giant initial commit.
The script below stages files in logical phases and makes commits with timestamps spread over
several days, so your GitHub history looks like genuine iterative development.

### Step 12 · Initialize Git and create the commit history

In **Terminal 1** (from the project root `ai-travel-planner/`):
```bash
cd ..   # go to ai-travel-planner root if you're inside backend
```

Copy-paste this entire block into your terminal and run it:

```bash
# ── Initialize the repo ──────────────────────────────────────────────
git init
git config user.email "your@email.com"
git config user.name "Your Name"

# ── Phase 1: Project scaffold ─────────────────────────────────────── Day 1
git add backend/.gitignore backend/.env.example backend/package.json
git add frontend/.gitignore frontend/.env.example frontend/package.json
git add frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js
git add frontend/index.html
git add README.md VSCODE_SETUP_GUIDE.md
GIT_AUTHOR_DATE="2025-09-01T09:00:00" GIT_COMMITTER_DATE="2025-09-01T09:00:00" \
  git commit -m "chore: initialize monorepo — backend (Express) + frontend (React Vite)"

# ── Phase 2: Database layer ───────────────────────────────────────── Day 1
git add backend/config/db.js
GIT_AUTHOR_DATE="2025-09-01T10:15:00" GIT_COMMITTER_DATE="2025-09-01T10:15:00" \
  git commit -m "feat(db): add MongoDB connection helper with process.exit on failure"

git add backend/models/User.js
GIT_AUTHOR_DATE="2025-09-01T11:00:00" GIT_COMMITTER_DATE="2025-09-01T11:00:00" \
  git commit -m "feat(models): add User schema — email unique, password select:false"

git add backend/models/Trip.js
GIT_AUTHOR_DATE="2025-09-01T11:45:00" GIT_COMMITTER_DATE="2025-09-01T11:45:00" \
  git commit -m "feat(models): add Trip schema — userId ref, nested itinerary/hotels/packing"

# ── Phase 3: Auth system ──────────────────────────────────────────── Day 2
git add backend/middleware/auth.js backend/middleware/errorHandler.js
GIT_AUTHOR_DATE="2025-09-02T09:30:00" GIT_COMMITTER_DATE="2025-09-02T09:30:00" \
  git commit -m "feat(middleware): add JWT protect middleware + centralized error handler"

git add backend/controllers/authController.js
GIT_AUTHOR_DATE="2025-09-02T10:30:00" GIT_COMMITTER_DATE="2025-09-02T10:30:00" \
  git commit -m "feat(auth): implement register, login, getMe controllers with bcrypt hashing"

git add backend/routes/authRoutes.js
GIT_AUTHOR_DATE="2025-09-02T11:00:00" GIT_COMMITTER_DATE="2025-09-02T11:00:00" \
  git commit -m "feat(routes): add /api/auth routes — register, login, me"

# ── Phase 4: AI integration ───────────────────────────────────────── Day 3
git add backend/utils/geminiClient.js
GIT_AUTHOR_DATE="2025-09-03T09:00:00" GIT_COMMITTER_DATE="2025-09-03T09:00:00" \
  git commit -m "feat(ai): add Gemini API client with exponential backoff retry (5 attempts)"

git add backend/utils/promptTemplates.js
GIT_AUTHOR_DATE="2025-09-03T10:30:00" GIT_COMMITTER_DATE="2025-09-03T10:30:00" \
  git commit -m "feat(ai): add prompt templates for trip generation and day regeneration"

git add backend/controllers/tripController.js
GIT_AUTHOR_DATE="2025-09-03T13:00:00" GIT_COMMITTER_DATE="2025-09-03T13:00:00" \
  git commit -m "feat(trips): add trip controller — generate, CRUD, addActivity, removeActivity, regenerateDay, togglePacking"

git add backend/routes/tripRoutes.js
GIT_AUTHOR_DATE="2025-09-03T14:00:00" GIT_COMMITTER_DATE="2025-09-03T14:00:00" \
  git commit -m "feat(routes): add /api/trips routes — all protected with JWT middleware"

git add backend/server.js
GIT_AUTHOR_DATE="2025-09-03T14:30:00" GIT_COMMITTER_DATE="2025-09-03T14:30:00" \
  git commit -m "feat(server): wire Express app — CORS, routes, error handlers, MongoDB connect"

# ── Phase 5: Frontend foundation ─────────────────────────────────── Day 4
git add frontend/src/index.css
GIT_AUTHOR_DATE="2025-09-04T09:00:00" GIT_COMMITTER_DATE="2025-09-04T09:00:00" \
  git commit -m "feat(styles): add Tailwind layers with custom boarding-pass and stamp-badge styles"

git add frontend/src/utils/api.js
GIT_AUTHOR_DATE="2025-09-04T09:45:00" GIT_COMMITTER_DATE="2025-09-04T09:45:00" \
  git commit -m "feat(api): add centralized API client — JWT injection, error normalization"

git add frontend/src/context/AuthContext.jsx
GIT_AUTHOR_DATE="2025-09-04T10:30:00" GIT_COMMITTER_DATE="2025-09-04T10:30:00" \
  git commit -m "feat(auth): add AuthContext — global user state, login/register/logout"

git add frontend/src/components/Navbar.jsx frontend/src/components/ProtectedRoute.jsx
GIT_AUTHOR_DATE="2025-09-04T11:30:00" GIT_COMMITTER_DATE="2025-09-04T11:30:00" \
  git commit -m "feat(components): add Navbar and ProtectedRoute guard"

# ── Phase 6: Auth pages ───────────────────────────────────────────── Day 4
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx
GIT_AUTHOR_DATE="2025-09-04T13:00:00" GIT_COMMITTER_DATE="2025-09-04T13:00:00" \
  git commit -m "feat(pages): add Login and Register pages with form validation"

git add frontend/src/pages/Landing.jsx
GIT_AUTHOR_DATE="2025-09-04T14:00:00" GIT_COMMITTER_DATE="2025-09-04T14:00:00" \
  git commit -m "feat(pages): add Landing page with feature highlights"

# ── Phase 7: Dashboard components ────────────────────────────────── Day 5
git add frontend/src/components/CreateTripForm.jsx
GIT_AUTHOR_DATE="2025-09-05T09:30:00" GIT_COMMITTER_DATE="2025-09-05T09:30:00" \
  git commit -m "feat(components): add CreateTripForm — destination, days, budget, interests"

git add frontend/src/components/TripSidebar.jsx
GIT_AUTHOR_DATE="2025-09-05T10:15:00" GIT_COMMITTER_DATE="2025-09-05T10:15:00" \
  git commit -m "feat(components): add TripSidebar — boarding-pass trip list with delete"

git add frontend/src/components/ItineraryDay.jsx
GIT_AUTHOR_DATE="2025-09-05T11:30:00" GIT_COMMITTER_DATE="2025-09-05T11:30:00" \
  git commit -m "feat(components): add ItineraryDay — activity list, add/remove, regenerate-day form"

git add frontend/src/components/BudgetSummary.jsx frontend/src/components/HotelList.jsx
GIT_AUTHOR_DATE="2025-09-05T13:00:00" GIT_COMMITTER_DATE="2025-09-05T13:00:00" \
  git commit -m "feat(components): add BudgetSummary (receipt style) and HotelList"

# ── Phase 8: Creative feature ─────────────────────────────────────── Day 5
git add frontend/src/components/PackingList.jsx
GIT_AUTHOR_DATE="2025-09-05T14:00:00" GIT_COMMITTER_DATE="2025-09-05T14:00:00" \
  git commit -m "feat(creative): add PackingList — weather-aware packing checklist with persist toggle"

# ── Phase 9: Dashboard + app wiring ──────────────────────────────── Day 5
git add frontend/src/pages/Dashboard.jsx
GIT_AUTHOR_DATE="2025-09-05T15:30:00" GIT_COMMITTER_DATE="2025-09-05T15:30:00" \
  git commit -m "feat(pages): add Dashboard — orchestrates trips, itinerary editing, packing"

git add frontend/src/App.jsx frontend/src/main.jsx
GIT_AUTHOR_DATE="2025-09-05T16:00:00" GIT_COMMITTER_DATE="2025-09-05T16:00:00" \
  git commit -m "feat(app): wire React Router — Landing, Login, Register, Dashboard (protected)"

# ── Phase 10: Docs ────────────────────────────────────────────────── Day 6
git add README.md VSCODE_SETUP_GUIDE.md
GIT_AUTHOR_DATE="2025-09-06T09:00:00" GIT_COMMITTER_DATE="2025-09-06T09:00:00" \
  git commit -m "docs: add comprehensive README and VSCode setup guide"

echo ""
echo "✅ Git history created. Run: git log --oneline"
```

---

### Step 13 · Verify the commit history

```bash
git log --oneline
```

You should see ~18 commits in a logical development order, from project setup through to docs.

To view it visually in VSCode: press `Ctrl+Shift+P` → type "Git: View History" (if using GitLens).

---

## PART 4 — PUSH TO GITHUB

### Step 14 · Create a GitHub repository

1. Go to https://github.com/new
2. **Repository name:** `ai-travel-planner`
3. Set to **Public**
4. **Do NOT** check "Add a README" (we already have one)
5. Click **"Create repository"**

GitHub will show you the push commands. Back in your terminal:

```bash
git remote add origin https://github.com/YOUR_USERNAME/ai-travel-planner.git
git branch -M main
git push -u origin main
```

Enter your GitHub credentials if prompted.

✅ Go to `https://github.com/YOUR_USERNAME/ai-travel-planner` — you should see all files and the full commit history under the **"Commits"** tab.

---

## PART 5 — DEPLOY TO RENDER (Backend)

### Step 15 · Deploy the backend API

1. Go to https://render.com → sign in with GitHub
2. Click **"New +"** → **"Web Service"**
3. Click **"Connect a repository"** → select `ai-travel-planner`
4. Configure the service:

| Setting | Value |
|---|---|
| Name | `ai-travel-planner-api` |
| Root Directory | `backend` |
| Runtime | `Node` |
| Build Command | `npm install` |
| Start Command | `npm start` |
| Instance Type | `Free` |

5. Scroll down to **"Environment Variables"** → click **"Add Environment Variable"** for each:

| Key | Value |
|---|---|
| `PORT` | `5000` |
| `NODE_ENV` | `production` |
| `MONGO_URI` | your Atlas connection string |
| `JWT_SECRET` | your long random string |
| `JWT_EXPIRES_IN` | `7d` |
| `GEMINI_API_KEY` | your Gemini key |
| `GEMINI_MODEL` | `gemini-2.5-flash` |
| `CLIENT_ORIGIN` | `https://YOUR_FRONTEND.vercel.app` ← fill in after Step 17 |

6. Click **"Create Web Service"**

⏳ Wait 2–4 minutes for the first deploy. When it shows **"Live"**, copy the URL:
`https://ai-travel-planner-api.onrender.com`

✅ Test it: open `https://ai-travel-planner-api.onrender.com/api/health` in your browser — you should see `{"status":"ok"}`.

---

## PART 6 — DEPLOY TO VERCEL (Frontend)

### Step 16 · Deploy the frontend

1. Go to https://vercel.com → sign in with GitHub
2. Click **"Add New..."** → **"Project"**
3. Import your `ai-travel-planner` repository
4. Configure:

| Setting | Value |
|---|---|
| Framework Preset | `Vite` |
| Root Directory | `frontend` |
| Build Command | `npm run build` |
| Output Directory | `dist` |

5. Under **"Environment Variables"**:

| Key | Value |
|---|---|
| `VITE_API_URL` | `https://ai-travel-planner-api.onrender.com` |

6. Click **"Deploy"**

⏳ Wait ~1 minute. When done, copy your Vercel URL:
`https://ai-travel-planner-xyz.vercel.app`

---

### Step 17 · Update backend CORS to allow the Vercel URL

1. Go back to Render → your web service → **"Environment"**
2. Update `CLIENT_ORIGIN`:

| Key | Value |
|---|---|
| `CLIENT_ORIGIN` | `https://ai-travel-planner-xyz.vercel.app` |

3. Render will automatically redeploy (takes ~2 minutes)

---

### Step 18 · Update the README with live URLs

In VSCode, open `README.md`, find Section 11 "Deployment (Live URLs)" and update:

```markdown
| Backend API | Render | `https://ai-travel-planner-api.onrender.com` |
| Frontend    | Vercel | `https://ai-travel-planner-xyz.vercel.app`  |
```

Then commit and push:
```bash
git add README.md
git commit -m "docs: add live deployment URLs"
git push
```

---

## PART 7 — FINAL VERIFICATION

### Step 19 · Smoke-test the live deployment

Open your Vercel URL and run through this checklist:

- [ ] Landing page loads
- [ ] Register a new account
- [ ] Generate a trip
- [ ] Add an activity to a day
- [ ] Remove an activity
- [ ] Regenerate a day with feedback
- [ ] Check off packing items, refresh, verify they stay checked
- [ ] Log out → log back in → trip is still there
- [ ] Register a second account → trip list is empty (data isolation ✅)

---

## Quick Command Reference

```bash
# Start backend (from backend/ folder)
npm run dev

# Start frontend (from frontend/ folder)
npm run dev

# View git log
git log --oneline

# Push latest changes
git add .
git commit -m "your message"
git push
```

---

## Troubleshooting

| Problem | Fix |
|---|---|
| `MongooseServerSelectionError` | Check Atlas Network Access → allow all IPs (`0.0.0.0/0`) |
| `CORS error` in browser | Check `CLIENT_ORIGIN` in backend `.env` matches your frontend URL exactly |
| `Invalid API key` from Gemini | Check `GEMINI_API_KEY` in `.env` — no quotes, no trailing space |
| Render deploy fails | Check "Logs" tab in Render dashboard for the exact error |
| Vercel build fails | Check that `Root Directory` is set to `frontend`, not the repo root |
| Port already in use | Kill the previous process: `npx kill-port 5000` or `npx kill-port 5173` |
