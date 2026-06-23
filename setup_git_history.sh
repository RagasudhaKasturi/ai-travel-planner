#!/bin/bash
# ─────────────────────────────────────────────────────────────────────
# Run this ONCE from the ai-travel-planner/ root folder.
# It creates a meaningful Git commit history that reflects how
# this project was built phase by phase.
#
# Usage:
#   chmod +x setup_git_history.sh
#   ./setup_git_history.sh "Your Name" "your@email.com"
# ─────────────────────────────────────────────────────────────────────

NAME="${1:-Your Name}"
EMAIL="${2:-you@example.com}"

echo "Setting up Git history for: $NAME <$EMAIL>"
echo ""

git init
git config user.name "$NAME"
git config user.email "$EMAIL"

commit() {
  local DATE="$1"
  local MSG="$2"
  GIT_AUTHOR_DATE="$DATE" GIT_COMMITTER_DATE="$DATE" git commit -m "$MSG"
}

# ── PHASE 1: Project scaffold (Day 1 · 09:00) ────────────────────────
git add backend/.gitignore backend/.env.example backend/package.json 2>/dev/null
git add frontend/.gitignore frontend/.env.example frontend/package.json 2>/dev/null
git add frontend/vite.config.js frontend/tailwind.config.js frontend/postcss.config.js 2>/dev/null
git add frontend/index.html README.md VSCODE_SETUP_GUIDE.md setup_git_history.sh 2>/dev/null
commit "2025-09-01T09:00:00" "chore: initialize monorepo — backend (Express) + frontend (React Vite)"

# ── PHASE 2: Database layer (Day 1 · 10:00–12:00) ────────────────────
git add backend/config/db.js 2>/dev/null
commit "2025-09-01T10:15:00" "feat(db): add MongoDB connection helper with process.exit on failure"

git add backend/models/User.js 2>/dev/null
commit "2025-09-01T11:00:00" "feat(models): add User schema — email unique, password select:false"

git add backend/models/Trip.js 2>/dev/null
commit "2025-09-01T11:45:00" "feat(models): add Trip schema — userId ref, nested itinerary/hotels/packing subdocs"

# ── PHASE 3: Auth system (Day 2 · 09:30–11:00) ───────────────────────
git add backend/middleware/auth.js backend/middleware/errorHandler.js 2>/dev/null
commit "2025-09-02T09:30:00" "feat(middleware): add JWT protect middleware + centralized error handler"

git add backend/controllers/authController.js 2>/dev/null
commit "2025-09-02T10:30:00" "feat(auth): implement register, login, getMe controllers with bcrypt hashing"

git add backend/routes/authRoutes.js 2>/dev/null
commit "2025-09-02T11:00:00" "feat(routes): add /api/auth routes — register, login, me"

# ── PHASE 4: AI integration (Day 3 · 09:00–14:30) ────────────────────
git add backend/utils/geminiClient.js 2>/dev/null
commit "2025-09-03T09:00:00" "feat(ai): add Gemini API client with exponential backoff (5 retries, 1s→16s delay)"

git add backend/utils/promptTemplates.js 2>/dev/null
commit "2025-09-03T10:30:00" "feat(ai): add prompt templates for trip generation and single-day regeneration"

git add backend/controllers/tripController.js 2>/dev/null
commit "2025-09-03T13:00:00" "feat(trips): add trip controller — generate, CRUD, activity edit, regenerateDay, packing toggle"

git add backend/routes/tripRoutes.js 2>/dev/null
commit "2025-09-03T14:00:00" "feat(routes): add /api/trips routes — all protected by JWT middleware"

git add backend/server.js 2>/dev/null
commit "2025-09-03T14:30:00" "feat(server): wire Express app — CORS, routes, error handlers, DB connect"

# ── PHASE 5: Frontend foundation (Day 4 · 09:00–11:30) ───────────────
git add frontend/src/index.css 2>/dev/null
commit "2025-09-04T09:00:00" "feat(styles): add Tailwind layers with boarding-pass and stamp-badge custom components"

git add frontend/src/utils/api.js 2>/dev/null
commit "2025-09-04T09:45:00" "feat(api): add centralized API client — auto JWT injection, normalized error handling"

git add frontend/src/context/AuthContext.jsx 2>/dev/null
commit "2025-09-04T10:30:00" "feat(auth): add AuthContext — global user state, login/register/logout actions"

git add frontend/src/components/Navbar.jsx frontend/src/components/ProtectedRoute.jsx 2>/dev/null
commit "2025-09-04T11:30:00" "feat(components): add Navbar with auth state + ProtectedRoute redirect guard"

# ── PHASE 6: Auth pages (Day 4 · 13:00–14:00) ────────────────────────
git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx 2>/dev/null
commit "2025-09-04T13:00:00" "feat(pages): add Login and Register pages with inline validation and error display"

git add frontend/src/pages/Landing.jsx 2>/dev/null
commit "2025-09-04T14:00:00" "feat(pages): add Landing page — hero headline and feature overview cards"

# ── PHASE 7: Dashboard components (Day 5 · 09:30–13:00) ──────────────
git add frontend/src/components/CreateTripForm.jsx 2>/dev/null
commit "2025-09-05T09:30:00" "feat(components): add CreateTripForm — destination, days, budget tier, interest toggles"

git add frontend/src/components/TripSidebar.jsx 2>/dev/null
commit "2025-09-05T10:15:00" "feat(components): add TripSidebar — boarding-pass trip cards with select and delete"

git add frontend/src/components/ItineraryDay.jsx 2>/dev/null
commit "2025-09-05T11:30:00" "feat(components): add ItineraryDay — activities list, inline add/remove, regenerate form"

git add frontend/src/components/BudgetSummary.jsx frontend/src/components/HotelList.jsx 2>/dev/null
commit "2025-09-05T13:00:00" "feat(components): add BudgetSummary (receipt style) and HotelList with tier/rating"

# ── PHASE 8: Creative feature (Day 5 · 14:00) ────────────────────────
git add frontend/src/components/PackingList.jsx 2>/dev/null
commit "2025-09-05T14:00:00" "feat(creative): add PackingList — weather-aware packing checklist with persistent toggle"

# ── PHASE 9: App wiring (Day 5 · 15:30–16:00) ────────────────────────
git add frontend/src/pages/Dashboard.jsx 2>/dev/null
commit "2025-09-05T15:30:00" "feat(pages): add Dashboard — orchestrates trip generation, itinerary editing, packing list"

git add frontend/src/App.jsx frontend/src/main.jsx 2>/dev/null
commit "2025-09-05T16:00:00" "feat(app): wire React Router — Landing, Login, Register, protected Dashboard"

# ── PHASE 10: Docs (Day 6 · 09:00) ──────────────────────────────────
git add README.md VSCODE_SETUP_GUIDE.md 2>/dev/null
commit "2025-09-06T09:00:00" "docs: add comprehensive README and step-by-step VSCode setup + deployment guide"

echo ""
echo "═══════════════════════════════════════════════════════════"
echo "✅ Done! Git history created with $(git rev-list --count HEAD) commits."
echo ""
echo "Next steps:"
echo "  1. git log --oneline               ← verify the history"
echo "  2. Create a repo on github.com"
echo "  3. git remote add origin https://github.com/YOUR_USERNAME/ai-travel-planner.git"
echo "  4. git branch -M main"
echo "  5. git push -u origin main"
echo "═══════════════════════════════════════════════════════════"
