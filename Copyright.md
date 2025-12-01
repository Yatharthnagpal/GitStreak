# Privacy Policy & Copyright Notice for GitStreak

_Last updated: 21 August 2026_  
_Created & Authored by Yatharth Nagpal_

Copyright © 2025–2026 **Yatharth Nagpal**. All rights reserved.

Thank you for using **GitStreak** , a state-of-the-art precision GitHub contribution engine and activity scheduler built on a decoupled architecture featuring **Next.js 14+ React App Router** and **Python 3.10+ FastAPI**.

This Privacy Policy & Copyright Notice explains what data the Application processes, how it is secured, and your rights and controls as a user.

---

## 1. Copyright & Intellectual Property

- **Author & Creator:** Yatharth Nagpal
- **Application Name:** GitStreak — Precision GitHub Contribution Engine
- **Repository:** https://github.com/Yatharthnagpal/GitStreak
- **Production Web Application:** https://gitstreak-ny.vercel.app

All original source code, UI designs, brand visual assets, heatmap algorithms, commit jitter engines, and documentation associated with GitStreak are the exclusive intellectual property of **Yatharth Nagpal**. Unauthorized copying, modification, redistribution, or commercial resale without explicit written permission is strictly prohibited.

---

## 2. Overview & Architecture

GitStreak is a developer productivity platform designed to help developers visualize, curate, and schedule GitHub contribution activity using direct, serverless integration with GitHub’s Git REST Database API (`/git/blobs`, `/trees`, `/commits`, `/refs`).

The Application is engineered around a **privacy-first philosophy**: it processes **only the minimal data necessary** to authenticate your session and execute requested commit scheduling tasks on your specified GitHub repositories.

---

## 3. Data We Collect & Process

Depending on how you authenticate and interact with GitStreak, the Application processes the following categories of data:

### 3.1 GitHub Account & Repository Data
When you sign in via GitHub OAuth 2.0 or supply a Personal Access Token (PAT):
- GitHub Username and User ID
- Public profile avatar URL and display name
- Public/Private repository list (for target repository selection)
- Branch information (e.g., `main`, `master`)
- Commit metadata (commit messages, timestamps, commit author details)

This data is retrieved via the official GitHub REST API solely to render your 52-week activity heatmap, display repository options, and execute commit backdating workflows.

### 3.2 Authentication Credentials & Tokens
To interact with GitHub on your behalf:
- **OAuth Access Tokens**: Generated during the official GitHub OAuth handshake.
- **Personal Access Tokens (PAT)**: Optional sign-in credentials provided directly by you.

Authentication sessions are securely encoded in browser cookies/session state. Tokens are **never shared, published, or sold** to third parties.

### 3.3 User Preferences & UI State
The Application stores local UI configuration preferences in browser local storage or session cookies, including:
- Selected theme preset (*Electric Cyan*, *Matrix Emerald*, *Cyber Purple*, *Solar Gold*)
- Heatmap inspection drawer state
- Selected target repository and branch parameters

---

## 4. How We Use Your Data

We process data exclusively for the following operational purposes:
- To authenticate your session and verify GitHub permissions.
- To display your live 52-week contribution heatmap and activity statistics.
- To construct and execute direct GitHub API tree/blob commit workflows.
- To maintain system performance, diagnose errors, and enforce safe secondary rate-limit safety guards.

We do **NOT** perform user tracking, sell user data, run third-party advertising, or construct behavioral profiles.

---

## 5. Third-Party Services & Infrastructure

GitStreak interacts with the following trusted service providers strictly to deliver service functionality:
- **GitHub API** ([https://api.github.com](https://api.github.com)): Primary data provider and destination for user-authorized Git operations.
- **Vercel** ([https://vercel.com](https://vercel.com)): Serverless hosting provider for Next.js frontend rendering and Python FastAPI backend API routing.

All third-party services operate under their respective security and privacy policies.

---

## 6. Data Security & Retention

- **Security Measures**: All network communication is enforced over encrypted HTTPS/TLS connections. Sensitive tokens and cookies are handled with modern browser security flags (`SameSite`, `Secure`, `HttpOnly` where applicable).
- **Data Retention**: GitStreak does not store persistent databases of your repository code or personal commit history. Session data expires upon sign-out or session invalidation.

You may revoke GitStreak’s GitHub access permissions at any time via your [GitHub Applications Settings](https://github.com/settings/applications).

---

## 7. Contact Information

For legal inquiries, permissions, or support regarding GitStreak , please contact:

- **Author & Architect:** Yatharth Nagpal
- **Email:** nagpalyatharth99@gmail.com
- **GitHub Profile:** https://github.com/Yatharthnagpal
- **Project Repository:** https://github.com/Yatharthnagpal/GitStreak
