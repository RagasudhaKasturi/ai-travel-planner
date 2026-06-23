# Trao — AI Travel Planner

> A full-stack, multi-user AI travel planning app that generates day-by-day itineraries, estimates budgets, suggests hotels, and lets you edit everything live — plus a custom **Weather-Aware Packing Assistant**.

---

## Table of Contents
1. [Project Overview](#1-project-overview)
2. [Tech Stack & Justification](#2-tech-stack--justification)
3. [Project Structure](#3-project-structure)
4. [Local Setup Instructions](#4-local-setup-instructions)
5. [High-Level Architecture](#5-high-level-architecture)
6. [Authentication & Authorization](#6-authentication--authorization)
7. [AI Agent Design & Purpose](#7-ai-agent-design--purpose)
8. [Creative Feature: Weather-Aware Packing Assistant](#8-creative-feature-weather-aware-packing-assistant)
9. [Key Design Decisions & Trade-offs](#9-key-design-decisions--trade-offs)
10. [Known Limitations](#10-known-limitations)
11. [Deployment (Live URLs)](#11-deployment-live-urls)
12. [API Reference](#12-api-reference)
13. [Manual Verification Checklist](#13-manual-verification-checklist)

---

## 1. Project Overview

**Trao** is a multi-user AI travel planner where each user gets a personalized, isolated dashboard to plan and manage trips.

The flow is simple:

1. User registers / logs in
2. Fills a trip form: destination, number of days, budget tier, interests
3. The AI agent (Google Gemini) generates a **structured day-by-day itinerary**, a **cost breakdown**, **3 hotel recommendations**, and a **weather-aware packing checklist** — in one call
4. User can then:
   - **Add** a new activity to any day
   - **Remove** any activity
   - **Regenerate** a specific day with natural-language feedback (e.g. "more outdoor activities")
   - **Check off** packing items — state is persisted to the database
5. All data is strictly isolated per user — no user can see or modify another user's trips

---

## 2. Tech Stack & Justification

| Layer | Technology | Why |
|---|---|---|
| Frontend | React 18 (Vite) + JavaScript | Client-side SPA is ideal here — no SEO/SSR requirement, one clean REST boundary with Express |
| Styling | Tailwind CSS | Utility-first, responsive by default, no runtime CSS overhead |
| Routing | React Router v6 | Industry standard for React SPAs |
| Backend | Node.js + Express | Lightweight, fast, excellent ecosystem for REST APIs |
| Database | MongoDB Atlas + Mongoose | Flexible schema for nested itinerary/activity/packing subdocuments |
| Auth | JWT + bcryptjs | Stateless, scales horizontally, no session store needed |
| AI Agent | Google Gemini (`gemini-2.5-flash`) | Fast, free tier, excellent JSON-mode structured output |

### Why React (Vite) instead of Next.js?
The assessment allows equivalent stacks with justification. This application is a **single authenticated dashboard** — there are no public pages that need server-side rendering or SEO. A Vite SPA gives the same user experience with a simpler mental model: no server components, no Next.js API routes duplicating the Express layer, and one clear client↔server boundary. Express owns the entire API; Next.js's API routes would have been redundant.

### Why JavaScript instead of TypeScript?
JavaScript was chosen per project preference. Runtime type safety is compensated by: Mongoose schema validation on every DB write, explicit `enum` constraints on string fields, and centralized error handling middleware that normalizes all shape mismatches into safe JSON responses.

---

## 3. Project Structure

```
ai-travel-planner/
│
├── backend/
│   ├── config/
│   │   └── db.js                  # MongoDB connection via Mongoose
│   ├── middleware/
│   │   ├── auth.js                # JWT verification — protects all /api/trips/* routes
│   │   └── errorHandler.js        # Centralized error + 404 handling
│   ├── models/
│   │   ├── User.js                # User schema (email, hashed password)
│   │   └── Trip.js                # Trip schema (itinerary, budget, hotels, packing)
│   ├── controllers/
│   │   ├── authController.js      # register / login / getMe
│   │   └── tripController.js      # generate, CRUD, addActivity, removeActivity,
│   │                              #   regenerateDay, togglePacking
│   ├── routes/
│   │   ├── authRoutes.js          # POST /register, POST /login, GET /me
│   │   └── tripRoutes.js          # All /api/trips/* routes (protected)
│   ├── utils/
│   │   ├── geminiClient.js        # Gemini API caller with exponential backoff
│   │   └── promptTemplates.js     # Prompt engineering — isolated from controllers
│   ├── .env.example
│   ├── .gitignore
│   ├── package.json
│   └── server.js                  # Express entry point
│
└── frontend/
    ├── src/
    │   ├── pages/
    │   │   ├── Landing.jsx         # Marketing / hero page
    │   │   ├── Login.jsx           # Login form
    │   │   ├── Register.jsx        # Registration form
    │   │   └── Dashboard.jsx       # Main app: trip list + itinerary editor
    │   ├── components/
    │   │   ├── Navbar.jsx          # Top nav with auth state
    │   │   ├── ProtectedRoute.jsx  # Route guard (redirects to /login if no token)
    │   │   ├── CreateTripForm.jsx  # Trip creation form (destination, days, budget, interests)
    │   │   ├── TripSidebar.jsx     # List of user's trips (boarding-pass style)
    │   │   ├── ItineraryDay.jsx    # Day card: activities, add/remove, regenerate
    │   │   ├── BudgetSummary.jsx   # Receipt-style cost breakdown
    │   │   ├── HotelList.jsx       # Hotel suggestions
    │   │   └── PackingList.jsx     # Creative feature: interactive packing checklist
    │   ├── context/
    │   │   └── AuthContext.jsx     # Global auth state (user, login, logout, register)
    │   ├── utils/
    │   │   └── api.js              # Centralized fetch client — injects JWT on every call
    │   ├── App.jsx                 # Route definitions
    │   ├── main.jsx                # React entry point
    │   └── index.css               # Tailwind layers + custom stamp/ticket styles
    ├── .env.example
    ├── .gitignore
    ├── index.html
    ├── tailwind.config.js
    ├── postcss.config.js
    └── vite.config.js
```

---

## 4. Local Setup Instructions

### Prerequisites
- **Node.js** 18.x or 20.x — [Download](https://nodejs.org)
- **Git** — [Download](https://git-scm.com)
- A free **MongoDB Atlas** cluster — [Sign up](https://www.mongodb.com/cloud/atlas/register)
- A free **Gemini API key** — [Get one](https://aistudio.google.com/)

---

### Step 1 — Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/ai-travel-planner.git
cd ai-travel-planner
```

---

### Step 2 — Set up the Backend

```bash
cd backend
npm install
```

Copy the environment template:
```bash
cp .env.example .env
```

Open `backend/.env` and fill in your values:
```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb+srv://<user>:<password>@<cluster>.mongodb.net/ai-travel-planner
JWT_SECRET=any_long_random_string_here
JWT_EXPIRES_IN=7d
GEMINI_API_KEY=your_key_from_aistudio
GEMINI_MODEL=gemini-2.5-flash
CLIENT_ORIGIN=http://localhost:5173
```

> **MongoDB URI:** In Atlas → your cluster → Connect → "Connect your application" → copy the connection string and replace `<password>`.

> **Gemini key:** Go to [Google AI Studio](https://aistudio.google.com/), click "Get API Key", create a key, copy it.

Start the backend:
```bash
npm run dev
```
You should see: `API server running on port 5000` and `MongoDB connected: ...`

---

### Step 3 — Set up the Frontend

Open a **new terminal** (keep the backend running):
```bash
cd frontend
npm install
```

Copy the environment template:
```bash
cp .env.example .env
```

The default `frontend/.env` value is already correct for local dev:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Open **http://localhost:5173** in your browser.

---

### Step 4 — Test the app locally

1. Click **Get Started** → Register a new account
2. On the dashboard, click **+ Plan a new trip**
3. Enter a destination (e.g. "Tokyo, Japan"), 5 days, Medium budget, select interests → **Generate itinerary**
4. Wait ~10–15 seconds for Gemini to respond
5. You should see the day-by-day itinerary, budget ledger, hotel suggestions, and packing list
6. Try adding an activity, removing one, regenerating a day, and checking off a packing item

---

## 5. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│              React SPA (Vite, port 5173)            │
│  AuthContext · api.js (JWT injection) · React Router│
└───────────────┬─────────────────────────▲───────────┘
                │ REST (Authorization: Bearer <token>) │
                │                         │ JSON       │
┌───────────────▼─────────────────────────┴───────────┐
│           Express API Server (port 5000)             │
│  ┌─────────────────────────────────────────────┐    │
│  │   auth middleware → req.user = { id, email }│    │
│  └───────────────┬─────────────────────────────┘    │
│                  │                                   │
│     ┌────────────┴────────────┐                      │
│     ▼                         ▼                      │
│  /api/auth              /api/trips (protected)       │
│  register/login         generate · CRUD · edit       │
└──────┬───────────────────────┬──────────────────────┘
       │                       │
       ▼                       ├────────────────────────▶ Google Gemini API
  MongoDB (Users)         MongoDB (Trips)                (gemini-2.5-flash)
  hashed passwords        userId-scoped docs             JSON-mode output
```

**Data flow for trip generation:**
1. React sends `POST /api/trips/generate` with `{destination, durationDays, budgetTier, interests}` + JWT
2. Auth middleware verifies the JWT, attaches `req.user.id`
3. `tripController.generateTrip` builds a structured prompt via `promptTemplates.js`
4. `geminiClient.callGeminiJSON` calls Gemini with `responseMimeType: "application/json"`, retrying up to 5 times on failure
5. The parsed JSON is saved to MongoDB as a new `Trip` document with `userId: req.user.id`
6. The saved document is returned to React and rendered

---

## 6. Authentication & Authorization

### Registration
- Password is hashed with **bcryptjs** (salt rounds: 10) before being stored
- The `password` field on the User schema has `select: false` — it is **never returned** in queries by default, even accidentally
- Duplicate email detection returns `409 Conflict` before reaching the hash step

### Login
- `bcrypt.compare(plaintext, hash)` — the hash is never reversed, only compared
- On success, a **JWT** is signed with `{ id, email }` and a configurable expiry (default 7 days)

### Authorization middleware (`middleware/auth.js`)
- Every `/api/trips/*` route passes through `protect` before the controller runs
- Reads the `Authorization: Bearer <token>` header, verifies with `jwt.verify(token, JWT_SECRET)`
- Attaches `req.user = { id, email }` to the request — this is the **only** identity source downstream controllers trust
- Returns `401` for missing/malformed tokens, `401` for expired/invalid tokens

### Per-user data isolation
Enforced **at the query level**, not just the route level:
```js
// Every find/update/delete uses BOTH _id AND userId
Trip.findOne({ _id: req.params.id, userId: req.user.id })
```
A valid JWT for User B holding a guessed `_id` of User A's trip returns `404` — not a data leak, not a 403, just not found. This is by design.

---

## 7. AI Agent Design & Purpose

### Purpose
The agent's job is to act as an expert travel consultant: given a destination, duration, budget tier, and interests, it returns a complete, structured, realistic travel plan in one action — not a chatbot conversation.

### Implementation

**Trip generation (`POST /api/trips/generate`):**
The prompt (`promptTemplates.js`) specifies:
- Exactly the JSON schema the response must follow (mirrors the Mongoose `TripSchema`)
- Budget-tier context (Low = hostels/street food, Medium = mid-range comfort, High = upscale)
- Activity spread rules (2–4 per day, across Morning/Afternoon/Evening)
- Realistic local pricing for the destination
- Hotel tier requirements (exactly one Budget, one Mid-range, one Luxury)
- Packing list informed by planned activities and destination climate

The Gemini call uses `responseMimeType: "application/json"` to force structured output — the model cannot return markdown fences or commentary, only parseable JSON.

**Day regeneration (`POST /api/trips/:id/regenerate-day`):**
A narrower prompt that sends: destination, preferences, the **full current itinerary** as context (so the regenerated day doesn't duplicate activities already planned for other days), the specific day number, and the user's natural-language feedback. Returns only the single day object — cheaper and more reliable than full re-generation.

**Resilience (`utils/geminiClient.js`):**
Wraps every call in exponential backoff:
```
Attempt 1 → fail → wait 1s
Attempt 2 → fail → wait 2s
Attempt 3 → fail → wait 4s
Attempt 4 → fail → wait 8s
Attempt 5 → fail → wait 16s → throw clean error
```
Retries on HTTP 429 (rate limit) and 5xx (server errors). Network errors also trigger retry. After 5 failed attempts, returns a user-friendly JSON error — the server never crashes.

### Prompt engineering decisions
- Prompts live in **`utils/promptTemplates.js`** — completely separated from request-handling logic. This means prompts can be tuned, A/B tested, or versioned without touching the controller.
- The schema in the prompt is written as inline JSON with comments — making it easy to update the prompt when the Mongoose schema changes.
- Temperature is set to `0.8` — high enough for creative, varied itineraries, low enough to stay on the structured output contract.

---

## 8. Creative Feature: Weather-Aware Packing Assistant

### Problem it solves
Every travel planning tool generates an itinerary. Almost none of them tell you **what to pack for the specific things you planned to do**. A generic "packing list for Japan" doesn't know you have a mountain hike on Day 3, a tea ceremony on Day 4, and a sushi omakase on Day 5. Those need different gear.

### What it does
The packing list is generated **in the same Gemini call** as the itinerary — meaning the model sees the activities it just planned and packs for them, not for the destination in the abstract. The prompt asks for items categorized as:

- **Documents** — passport, visas, insurance
- **Clothing** — informed by the destination's climate and season
- **Gear** — activity-specific (hiking boots if a hike is planned, swimwear if beach, nice shoes if a fancy restaurant)
- **Other** — medications, adapters, etc.

### Why it's good engineering, not just a nice idea
1. **No extra API call** — generated together with the itinerary, so there's zero additional latency or cost
2. **Contextually consistent** — the packing list matches the actual itinerary, not a generic "activities in [destination]" inference
3. **Fully interactive** — each item has an `_id`, and checking it off fires `PATCH /api/trips/:id/packing/:itemId` which toggles `isPacked` on just that subdocument. No full-document replacement needed
4. **Persisted** — the checked state survives page refresh and is scoped to the trip, not a local checkbox

---

## 9. Key Design Decisions & Trade-offs

| Decision | What was chosen | Trade-off |
|---|---|---|
| **Single AI call vs. multiple** | One call for itinerary + hotels + budget + packing | Larger prompt, but one user action, one wait, one result. Simpler UX and fewer rate-limit exposures |
| **Granular endpoints vs. generic PUT** | Both — granular for UI, generic `PUT` for bulk updates | Granular endpoints prevent one UI action from accidentally overwriting concurrent changes in another field |
| **Prompt in separate file** | `promptTemplates.js` isolated from controller | Slightly more files, but prompts can be read, reviewed, and tuned without reading HTTP logic |
| **JWT (stateless) vs. session** | JWT | No session store to manage, scales horizontally, works across CORS origins cleanly |
| **Data isolation at query level** | `findOne({ _id, userId })` everywhere | More verbose queries, but isolation survives refactoring — you can't accidentally add a new route and forget an ownership check |
| **React Vite SPA vs. Next.js** | Vite SPA | Simpler mental model for a dashboard app, no SSR needed, avoids duplicating the Express API layer |
| **No server-side caching** | Not implemented | Acceptable for an assessment; production would cache Gemini responses by `{destination+days+budget+interests}` hash |

---

## 10. Known Limitations

- **No password reset / email verification** — a production requirement but out of scope for this assessment
- **Budget arithmetic not server-validated** — Gemini is prompted to ensure `total = sum(line items)`, but this isn't independently re-computed server-side. Occasionally off by a few dollars
- **No automated tests** — manual verification only (see checklist below). Unit tests for `geminiClient.js` backoff logic and integration tests for auth isolation would be the first additions
- **No API-level rate limiting** — outbound Gemini calls are protected by backoff, but there's no `express-rate-limit` middleware on inbound requests. Would be added before public launch
- **Interests are free-form strings** — the frontend constrains to a fixed list, but the backend accepts any strings. No input sanitization beyond Mongoose's `trim`
- **Single-region deployment** — no CDN or multi-region setup; fine for an assessment

---

## 11. Deployment (Live URLs)

| Component | Platform | URL |
|---|---|---|
| Backend API | Render | `https://YOUR_APP.onrender.com` |
| Frontend | Vercel | `https://YOUR_APP.vercel.app` |

> Update these URLs after deploying. Full deployment steps are in the [VSCode Setup & Deployment Guide](./VSCODE_SETUP_GUIDE.md).

---

## 12. API Reference

All `/api/trips/*` routes require `Authorization: Bearer <token>` header.

| Method | Path | Body / Params | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | `{name, email, password}` | Create account, returns JWT |
| `POST` | `/api/auth/login` | `{email, password}` | Login, returns JWT |
| `GET` | `/api/auth/me` | — | Get current user (protected) |
| `POST` | `/api/trips/generate` | `{destination, durationDays, budgetTier, interests[]}` | AI generates full trip |
| `GET` | `/api/trips` | — | Get all trips for logged-in user |
| `GET` | `/api/trips/:id` | — | Get single trip |
| `PUT` | `/api/trips/:id` | `{itinerary?, hotels?, estimatedBudget?, packingList?}` | Partial update |
| `DELETE` | `/api/trips/:id` | — | Delete trip |
| `POST` | `/api/trips/:id/activities` | `{dayNumber, title, description?, estimatedCostUSD?, timeOfDay?}` | Add activity to a day |
| `DELETE` | `/api/trips/:id/activities/:activityId` | — | Remove activity |
| `POST` | `/api/trips/:id/regenerate-day` | `{dayNumber, feedback}` | AI regenerates one day |
| `PATCH` | `/api/trips/:id/packing/:itemId` | — | Toggle packing item checked state |

---

## 13. Manual Verification Checklist

| Test | Steps | Expected result |
|---|---|---|
| Auth required | `GET /api/trips` with no `Authorization` header | `401 Access denied` |
| Data isolation | Register User A, create a trip. Register User B, call `GET /api/trips` | User B gets `[]` — cannot see User A's trip |
| Wrong ID isolation | User B calls `GET /api/trips/<User A's trip ID>` | `404 Trip not found` — not a leak |
| AI generation | Fill the trip form and submit | Itinerary, budget, hotels, and packing list all appear |
| Add activity | Click "+ Add an activity" on any day, fill the form | New activity appears under that day immediately |
| Remove activity | Click ✕ on any activity | Activity removed from that day |
| Regenerate day | Click "↻ Regenerate day", enter feedback, submit | That day's activities are replaced; other days unchanged |
| Packing checklist | Click any packing item | Item toggles checked state, persists after page refresh |
| AI resilience | Set invalid `GEMINI_API_KEY` in `.env`, restart, try generating | Server logs show retry attempts; user sees a clean error message |
| Responsive | Resize browser to 375px width | Sidebar stacks above content, all UI remains usable |
