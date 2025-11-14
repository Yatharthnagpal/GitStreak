# GitPulse — Precision GitHub Contribution Engine

**Created & Developed by Yatharth Nagpal**

GitPulse is a state-of-the-art GitHub contribution engine and activity scheduler. Featuring a rich dark glassmorphic interface, dynamic color themes, 1-click preset strategy cards, real-time heatmap preview with interactive cell inspection, commit realism options (human time jitter, conventional commit generator), and direct serverless integration with GitHub's Git Database API.

---

## Key Features

- **OAuth 2.0 & Personal Access Token Security**: Seamless GitHub OAuth handshake with optional PAT token sign-in fallback.
- **1-Click Quick Preset Strategies**: Instantly configure schedules for *Consistent Daily Coder*, *Weekday Shift*, *Weekend Warrior*, *Random Heavy Burst*, or *Light Touch*.
- **Interactive Contribution Heatmap Preview**: Live 52-week visual contribution graph with cell inspection modal.
- **Dynamic Theme Accent Switcher**: Switch between **Electric Cyan**, **Matrix Emerald**, **Cyber Purple**, and **Solar Gold** UI themes.
- **Commit Realism Engine**:
  - Human Time Jitter (`±0-60 min`) to make commit times naturally human-like.
  - Conventional Commits message generator (`feat:`, `fix:`, `docs:`, `refactor:`).
  - Configurable target file path.
- **Preset Export & Import**: Save and restore scheduling presets in `.json` format.
- **True Git Backdating**: Direct integration with `/git/trees`, `/git/blobs`, and `/git/commits` APIs.
- **Chrome Extension Included**: Complete extension suite under `extension/` directory.

---

## Local Development & Deployment

```bash
# Install dependencies
npm install

# Run backend syntax check
npm run check

# Start local dev server
npx http-server . -p 3000
```

---

## Author

**Yatharth Nagpal** — Creator & Core Architect


