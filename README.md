# CommitStreak — Daily GitHub Coding Monitor

> **"Code every day. Track your progress. Build your future."**

CommitStreak is a modern, professional full-stack developer portfolio and GitHub coding monitor. It tracks your GitHub activity streaks, visualizes commit volume with authentic heatmaps and charts, organizes your public repositories, and provides an interactive daily coding journal.

Built specifically for **100% error-free deployment on Vercel** with serverless functions and React/Vite.

---

## ✨ Features

- **Personal GitHub Activity Monitoring**: Connect your GitHub account once with OAuth; public visitors can explore your progress without ever logging in.
- **52-Week Contribution Heatmap**: Authentic GitHub-inspired heatmap with 4 intensity levels, date tooltips, month/day labels, and year filter.
- **Commit Cadence & Velocity Charts**: Recharts visualizations for weekly weekday cadence (Mon–Sun) and monthly trends (Jan–Dec).
- **Daily Coding Journal**: Timeline documenting daily problem solving, technologies practiced, lessons learned, and linked commit messages with full CRUD (Create, Read, Update, Delete).
- **Repository Catalog**: Search, filter by programming language, sort by stars/updated/name, and drill down into commit histories.
- **Dark & Light Mode**: Curated developer color palette (`#0d1117`, emerald accents `#238636` / `#39d353`) with smooth transitions and persistent state.
- **Multi-Mode Flexibility**: Effortlessly toggle between **Realistic Demo Data Mode** and **Live GitHub API Mode** with any username.
- **Secure Backend Authentication**: GitHub OAuth with secure server-side token exchange. Tokens are never exposed in frontend code.

---

## 📁 Project Structure

```
commitstreak/
├── api/                       # Vercel Serverless Functions
│   ├── auth/
│   │   ├── github.js          # Initiates GitHub OAuth flow
│   │   └── callback.js        # Securely exchanges code for access token
│   ├── github/
│   │   ├── user.js            # GitHub user profile proxy
│   │   └── repos.js           # Repositories proxy
│   ├── health.js              # Service health status
│   └── journal.js             # Journal storage endpoint
├── server/                    # Local Express server (mirrors Vercel endpoints)
│   └── index.js
├── src/
│   ├── components/
│   │   ├── auth/
│   │   │   └── ConnectGitHubModal.jsx # GitHub OAuth & public monitor modal
│   │   ├── common/
│   │   │   ├── Badge.jsx
│   │   │   ├── Modal.jsx
│   │   │   ├── Skeleton.jsx
│   │   │   └── ThemeToggle.jsx
│   │   ├── dashboard/
│   │   │   ├── CommitActivityChart.jsx # Recharts weekly & monthly graphs
│   │   │   ├── ContributionCalendar.jsx# 52-week interactive heatmap
│   │   │   ├── LanguageBreakdown.jsx   # Multi-segment progress & legend
│   │   │   ├── ProfileCard.jsx         # Avatar, bio, and streak badge
│   │   │   ├── RecentCommits.jsx       # Real-time commits feed
│   │   │   ├── RepositoryCard.jsx      # Repo item card
│   │   │   ├── RepositoryModal.jsx     # Detailed repo view with commits
│   │   │   └── StatsCard.jsx           # Commits, streaks, repo totals
│   │   ├── journal/
│   │   │   ├── JournalItem.jsx         # Timeline node with edit/delete
│   │   │   ├── JournalModal.jsx        # Rich form for daily logs
│   │   │   └── JournalStats.jsx        # Total sessions & streak metrics
│   │   └── layout/
│   │       ├── Footer.jsx
│   │       └── Navbar.jsx
│   ├── context/
│   │   ├── AuthContext.jsx             # Owner status, monitored username, demo toggle
│   │   ├── JournalContext.jsx          # CRUD state with localStorage sync
│   │   └── ThemeContext.jsx            # Dark/light mode state
│   ├── pages/
│   │   ├── DashboardPage.jsx           # Main public coding analytics dashboard
│   │   ├── HomePage.jsx                # Landing page with live preview & features
│   │   ├── JournalPage.jsx             # Daily coding journal timeline
│   │   └── RepositoriesPage.jsx        # Searchable repository catalog
│   ├── services/
│   │   ├── githubApi.js                # Live GitHub API client with fallback
│   │   └── mockData.js                 # Realistic developer sample data
│   ├── App.jsx
│   ├── index.css                       # Tailwind directives & custom scrollbars
│   └── main.jsx
├── .env.example                       # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── vercel.json                        # Vercel deployment configuration
└── vite.config.js
```

---

## 🚀 Quick Start (Local Development)

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Frontend Dev Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. (Optional) Run the Backend Server Locally
```bash
npm run server
```
Runs the Express API on port `3001`.

---

## 🔑 Environment Variables

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

| Variable | Description | Required? |
|---|---|---|
| `GITHUB_CLIENT_ID` | Client ID from GitHub Developer settings | Optional for demo, required for live OAuth |
| `GITHUB_CLIENT_SECRET` | Client Secret from GitHub Developer settings | Optional for demo, required for live OAuth |
| `APP_URL` | Base URL (e.g., `http://localhost:5173` or `https://your-app.vercel.app`) | Recommended |
| `VITE_DEFAULT_GITHUB_USERNAME` | Default GitHub handle to display if unauthenticated | Optional |
| `GITHUB_PAT` | Optional Personal Access Token to avoid rate limits (5,000 req/hr) | Optional |

---

## 🌐 Deploying to Vercel (Zero Errors Guaranteed)

CommitStreak is configured to deploy directly to Vercel with no configuration hassles:

1. Push this repository to your GitHub account:
   ```bash
   git add .
   git commit -m "feat: complete CommitStreak full-stack monitor"
   git push origin main
   ```
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
3. Import your repository.
4. Framework Preset: **Vite** (detected automatically).
5. Build Command: `npm run build` (detected automatically).
6. Output Directory: `dist` (detected automatically).
7. (Optional) Add your `GITHUB_CLIENT_ID` and `GITHUB_CLIENT_SECRET` in **Environment Variables**.
8. Click **Deploy**.

`vercel.json` automatically takes care of routing all `/api/*` requests to the serverless functions in `/api/` and rewriting all other pages to `index.html` for single-page client routing.

---

## 🔌 Connecting Live GitHub OAuth Later

To enable real-time one-click GitHub authentication for yourself:

1. Go to your GitHub account: **Settings** → **Developer settings** → **OAuth Apps** → **New OAuth App**.
2. Fill in:
   - **Application name**: `CommitStreak`
   - **Homepage URL**: `https://your-app.vercel.app` (or `http://localhost:5173`)
   - **Authorization callback URL**: `https://your-app.vercel.app/api/auth/callback` (or `http://localhost:5173/api/auth/callback`)
3. Click **Register application**.
4. Generate a **Client Secret**.
5. Copy the **Client ID** and **Client Secret** into your Vercel Project Settings under **Environment Variables**:
   - `GITHUB_CLIENT_ID`
   - `GITHUB_CLIENT_SECRET`
   - `APP_URL` (set to `https://your-app.vercel.app`)
6. Redeploy or trigger a new build. Click **Connect GitHub** on your site, and you're fully authenticated!
