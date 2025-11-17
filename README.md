# GitStreak — Precision GitHub Contribution Engine

**Created & Developed by Yatharth Nagpal**

GitStreak is a state-of-the-art GitHub contribution engine and activity scheduler built on a modern decoupled architecture (**Next.js 14+ React App Router** frontend and **Python 3.10+ FastAPI** backend). Featuring a Linear/Vercel-inspired dark glassmorphic interface, dynamic theme accents (*Electric Cyan*, *Matrix Emerald*, *Cyber Purple*, *Solar Gold*), interactive 52-week contribution heatmap with cell inspection drawer, 5 automated preset strategy cards, 3-step safe schedule execution workflow, and direct serverless integration with GitHub's Git REST Database API (`/git/blobs`, `/trees`, `/commits`, `/refs`).

---

## Key Features

- **GitHub OAuth 2.0 & PAT Token Security**: Seamless GitHub OAuth handshake with optional Personal Access Token sign-in fallback.
- **Target Repository Select Dropdown**: Fetch real GitHub user repositories directly via API and auto-detect default branches (`main`, `master`).
- **5 Automated Preset Strategy Cards**:
  1. *Consistent Daily*: Fixed commit count for all days.
  2. *Weekday Shift*: Random commits Mon–Fri, 0 on weekends.
  3. *Weekend Warrior*: Random commits Sat–Sun, 0 on weekdays.
  4. *Random Burst*: Random commits whole week.
  5. *Light Touch*: Minimal 1–3 commits whole week.
- **Interactive 52-Week Contribution Heatmap**: Live 365-day visual contribution graph with slide-over inspection drawer.
- **⌘K Command Palette**: Fast keyboard navigation, search, and theme switching.
- **Commit Realism Engine**: Human time jitter (`±0–60 min`) and conventional commit generator (`feat:`, `fix:`, `docs:`, `refactor:`).
- **True Git Backdating**: Direct integration with `/git/trees`, `/git/blobs`, and `/git/commits` APIs with secondary rate-limit safety guards.

---

## Development & Architecture

```text
git-streak/
├── backend/          # Python 3.10+ FastAPI API Server 
└── frontend/         # Next.js 14+ React Web App 

## Author

**Yatharth Nagpal** — Creator & Core Architect
