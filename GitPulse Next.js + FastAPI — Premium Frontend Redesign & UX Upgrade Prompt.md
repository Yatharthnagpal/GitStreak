# GitPulse — Premium Frontend Redesign & UX Upgrade

## ROLE

Act as a **10+ year Senior Product Designer, UX Architect, Design Engineer, and Next.js Frontend Architect**.

You specialize in:

- Developer tools
- SaaS dashboards
- Data visualization
- GitHub integrations
- Next.js / React
- Premium dark interfaces
- Glassmorphism
- Motion design
- Design systems
- Complex configuration workflows

You are redesigning the existing **GitPulse** application.
renaming it to **GitStreak**

The application is currently being migrated to:

```text
GitStreak/
├── frontend/
│   └── Next.js + React
│
└── backend/
    └── Python + FastAPI
```

The architecture already exists or is being implemented.

Your primary responsibility is:

> **Transform the frontend into a polished, premium, modern developer product without unnecessarily changing the backend architecture or breaking existing functionality.**

---

# 1. IMPORTANT — UNDERSTAND THE EXISTING PROJECT FIRST

Before modifying anything, inspect the complete project.

Read:

```text
/frontend
/backend
```

Understand:

- Next.js version
- React version
- App Router structure
- TypeScript configuration
- existing CSS
- theme system
- existing components
- API layer
- authentication flow
- FastAPI routes
- environment variables
- state management
- data structures
- existing GitHub integration
- contribution heatmap logic
- preset generation logic
- schedule configuration logic

Do NOT immediately start replacing files.

First understand the current implementation.

---

# 2. CORE PRODUCT IDENTITY

GitStreak should feel like:

> **A premium command center for understanding and managing your GitHub activity.**

The product should communicate:

- Developer productivity
- GitHub intelligence
- Activity planning
- Contribution visualization
- Engineering workflow
- Precision
- Control
- Transparency

The product should NOT feel like:

- A generic admin dashboard
- A cryptocurrency dashboard
- A gaming UI
- A cyberpunk website
- A generic SaaS template
- An overly decorative 3D website

The visual direction should be:

## Premium Developer Tool

Think:

```text
Linear
+
Vercel
+
Raycast
+
GitHub
+
modern data visualization
```

But create an ORIGINAL GitPulse identity.

Do not copy any existing product.

---

# 3. KEEP THE EXISTING VISUAL DNA

The current project already has:

- Dark glassmorphism
- Ambient glow
- Cyber-style background effects
- Outfit
- Plus Jakarta Sans
- JetBrains Mono
- Cyan
- Emerald
- Purple
- Amber themes

Do NOT remove these.

Instead:

> **Refine them into a more sophisticated design system.**

The current aesthetic should evolve from:

```text
Cyber / Glassmorphism
```

into:

```text
Premium Developer Analytics
```

---

# 4. VISUAL DIRECTION

Primary mode:

## DARK

Background:

```text
#07090C
#0B0E12
#10141A
```

Surface:

```text
rgba(255,255,255,0.035)
rgba(255,255,255,0.055)
rgba(255,255,255,0.075)
```

Borders:

Extremely subtle.

Use:

```text
rgba(255,255,255,0.07)
```

instead of bright borders.

---

# 5. ACCENT THEMES

Preserve the existing four themes:

```text
Electric Cyan
Matrix Emerald
Cyber Purple
Solar Gold
```

But redesign the implementation so each theme controls:

```text
--accent
--accent-muted
--accent-glow
--accent-surface
--accent-border
--accent-text
```

Example:

```text
Cyan
#22D3EE

Emerald
#34D399

Purple
#A78BFA

Amber
#FBBF24
```

Do not make the entire interface change color.

Only the following should primarily react:

- CTA buttons
- active navigation
- selected states
- graph highlights
- heatmap highlights
- focus states
- small accent elements
- ambient glow

The interface must remain visually calm.

---

# 6. TYPOGRAPHY SYSTEM

Keep:

### Primary

Outfit / Plus Jakarta Sans

### Technical

JetBrains Mono

Use JetBrains Mono for:

- numbers
- GitHub usernames
- repository names
- commit IDs
- dates
- code-like information
- technical metadata

Create a clear hierarchy:

```text
Display
Heading
Subheading
Body
Caption
Technical
Metric
```

Large numbers should feel extremely prominent.

---

# 7. GLOBAL APPLICATION SHELL

Create a premium application shell.

Desktop:

```text
┌────────────────────────────────────────────────────────────┐
│ GitPulse                    Search     Theme     Profile   │
├────────────┬───────────────────────────────────────────────┤
│            │                                               │
│ Overview   │                                               │
│ Activity   │                 Main Content                  │
│ Schedule   │                                               │
│ Insights   │                                               │
│            │                                               │
│ Settings   │                                               │
│            │                                               │
└────────────┴───────────────────────────────────────────────┘
```

Sidebar:

- compact
- elegant
- collapsible
- icon + label
- active indicator
- keyboard accessible

Suggested navigation:

```text
Overview

Activity

Schedule

Presets

Insights

────────────────

Settings
```

Do not add unnecessary navigation items.

---

# 8. TOP NAVIGATION

Create:

```text
GitPulse

[⌘ K Search]

Theme

Notifications

Avatar
```

The top bar should be:

- sticky
- translucent
- subtly blurred
- low visual weight

Do not make it oversized.

---

# 9. COMMAND PALETTE

Implement a premium command palette.

Keyboard:

```text
⌘ K
Ctrl K
```

Search:

```text
Search GitPulse...
```

Sections:

```text
Navigation

Overview
Activity
Schedule
Presets
Settings

Actions

Create Schedule
Load Preset
Refresh Activity
Switch Theme

Account

GitHub Profile
Sign Out
```

Support:

- keyboard navigation
- arrow keys
- Enter
- Escape
- fuzzy search

---

# 10. DASHBOARD / OVERVIEW

This should become the main visual centerpiece.

Top:

```text
Good evening

Your GitHub activity at a glance.
```

Then create a clean metrics row.

Example:

```text
ACTIVITY
1,284
commits

ACTIVE DAYS
186
this year

STREAK
24
days

REPOSITORIES
18
connected
```

Do not turn every metric into a giant card.

Use typography, whitespace and subtle containers.

---

# 11. HERO ANALYTICS SECTION

Create a large section:

## Activity Overview

Controls:

```text
7D
30D
90D
1Y

[Commits ▼]
```

Visualization:

- area chart
- line chart
- subtle gradient
- smooth transitions
- hover inspection
- date tooltip

Example tooltip:

```text
August 20

18 commits
4 pull requests
7 active repositories
```

The chart should be visually sophisticated but restrained.

---

# 12. 52-WEEK CONTRIBUTION HEATMAP

This is one of the most important components.

The existing:

```text
ContributionHeatmap.tsx
```

must remain functional.

Upgrade its presentation.

Display:

```text
Contribution Activity
Last 52 weeks
```

Controls:

```text
Intensity
Activity Type
Year
```

Heatmap cells should have:

- 4–5 intensity levels
- theme-aware accent
- subtle hover glow
- tooltip
- keyboard accessibility

Tooltip:

```text
August 20, 2026

18 activities

Commits       12
PRs            3
Reviews        3
```

Add a small legend:

```text
Less  ░ ▒ ▓ █  More
```

Do not make the heatmap neon.

---

# 13. HEATMAP INSPECTION

Clicking a day should open a refined inspection panel.

Example:

```text
August 20, 2026

18 activities

────────────────

Commits                 12
Pull Requests             3
Reviews                   3

────────────────

Repositories

project-alpha
project-beta
project-gamma

────────────────

[Close]
```

Use a drawer or modal.

Animate:

```text
opacity
transform
blur
```

around 200ms.

---

# 14. PRESET EXPERIENCE

The existing:

```text
PresetSelector.tsx
```

should become a major UX component.

Current presets:

```text
Consistent Daily
Weekday Shift
Weekend Warrior
Random Burst
Light Touch
```

Instead of five plain cards, create a visual strategy selector.

Example:

```text
┌────────────────────────────────────────────┐
│ CONSISTENT DAILY                           │
│                                            │
│ Balanced activity distribution             │
│                                            │
│ ████████████████████████                   │
│                                            │
│ Predictable · Balanced                     │
│                                            │
│ ● Selected                                 │
└────────────────────────────────────────────┘
```

Each preset should visually preview its schedule pattern.

For example:

### Consistent Daily

Even distribution.

### Weekday Shift

Weekday concentration.

### Weekend Warrior

Weekend concentration.

### Random Burst

Variable activity pattern.

### Light Touch

Minimal activity.

The preview should be visual rather than just descriptive.

---

# 15. SCHEDULE CONFIGURATOR

The existing:

```text
ScheduleConfigurator.tsx
```

should become a premium configuration workspace.

Structure:

```text
Schedule

Configure your activity plan

────────────────────────

Target Date

[ Calendar ]

Activity Count

[ 12 ]

Time Window

[ 09:00 ] — [ 18:00 ]

────────────────────────

Preset

[ Consistent Daily ]

────────────────────────

Options

Commit Prefix          [ ON ]

Human Time Variation   [ slider ]

────────────────────────

Schedule Preview

████████████████

12 activities

────────────────────────

[ Review Schedule ]
```

Important:

Separate configuration from execution.

Do not make the primary action feel dangerous or ambiguous.

Use:

```text
Configure
→ Review
→ Confirm
```

rather than:

```text
ONE CLICK → EXECUTE
```

This creates a much better UX.

---

# 16. REVIEW SCREEN

Before execution, create a review step.

Show:

```text
Review Schedule

Target
August 20, 2026

Activities
12

Time window
09:00 – 18:00

Preset
Consistent Daily
```

Then show a timeline:

```text
09:14     Activity
10:28     Activity
11:42     Activity
13:05     Activity
14:16     Activity
...
```

Primary action:

```text
Confirm Schedule
```

Secondary:

```text
Edit
```

This dramatically improves usability.

---

# 17. SCHEDULE STATUS

After submission, show a clear status screen.

Example:

```text
Schedule Active

● Running

12 activities

██████████████████░░░░

9 / 12 completed
```

Then:

```text
Completed
9

Remaining
3

Started
09:14

Estimated completion
17:42
```

Use subtle live updates.

---

# 18. ACTIVITY PAGE

Create a dedicated activity timeline.

Example:

```text
Activity

Today

09:14
Repository activity
project-alpha

10:32
Repository activity
project-beta

12:04
Pull request activity
project-alpha
```

Add filters:

```text
All
Commits
Pull Requests
Reviews
Repositories
```

Use a timeline rather than repetitive cards.

---

# 19. INSIGHTS

Add a dedicated:

## GitPulse Insights

Examples:

```text
Activity increased 18% this month.

Your most active repository is
project-alpha.

Your activity is concentrated between
10:00 AM and 3:00 PM.

You maintained activity across
6 consecutive weeks.
```

Use:

- small charts
- spark lines
- trend indicators
- concise explanations

The goal is:

> Turn raw GitHub activity into understandable information.

---

# 20. GITHUB CONNECTION

Create a beautiful GitHub connection state.

Disconnected:

```text
Connect GitHub

Connect your GitHub account to analyze
your repositories and activity.

[ Continue with GitHub ]
[ Use Personal Access Token ]
```

Connected:

```text
● GitHub Connected

@Yatharthnagpal

18 repositories
2,431 activities

[Manage Connection]
```

Do not expose sensitive tokens.

---

# 21. AUTHENTICATION UX

The existing FastAPI endpoints:

```text
/api/auth/github
/api/auth/callback
/api/auth/pat
/api/auth/me
```

must remain functional.

The frontend should only redesign the experience around them.

Support the existing authentication strategy.

If both:

```text
HTTP-only session
JWT
```

are currently supported, do not remove either without explicit architectural justification.

---

# 22. RESPONSIVE DESIGN

Design intentionally for:

### Desktop

1440+

### Laptop

1024–1439

### Tablet

768–1023

### Mobile

320–767

Mobile should not simply be a compressed desktop.

For mobile:

- sidebar → drawer
- top navigation → compact
- charts → horizontally scrollable when necessary
- heatmap → optimized density
- configuration → vertical sections
- presets → horizontal carousel
- tables → stacked rows
- metrics → 2-column grid

---

# 23. GLASSMORPHISM RULES

Glassmorphism should be subtle.

Use:

```text
backdrop-filter: blur(...)
```

only where it provides depth.

Do NOT:

- blur everything
- make every surface transparent
- use huge glowing borders
- use excessive shadows

Hierarchy should come from:

```text
contrast
spacing
typography
surface elevation
```

not from decoration.

---

# 24. AMBIENT BACKGROUND

Keep the existing ambient glow canvas.

But improve it.

Background should contain:

- extremely subtle radial gradients
- slow-moving glow
- fine noise
- optional grid

Animation should be barely noticeable.

It should create atmosphere, not compete with content.

Respect:

```text
prefers-reduced-motion
```

---

# 25. MOTION SYSTEM

Create a centralized motion system.

Fast:

```text
120–180ms
```

Normal:

```text
200–280ms
```

Emphasis:

```text
300–450ms
```

Use motion for:

- page transitions
- modal opening
- sidebar
- chart reveal
- metric counting
- hover
- selection
- theme switching

Avoid:

- excessive bouncing
- huge transforms
- long animations
- unnecessary parallax

---

# 26. BUTTON SYSTEM

Create consistent button variants.

```text
Primary
Secondary
Ghost
Danger
Icon
```

Primary:

```text
[ Confirm Schedule ]
```

Secondary:

```text
[ Preview ]
```

Ghost:

```text
[ Cancel ]
```

All buttons need:

- hover
- active
- focus
- disabled
- loading

states.

---

# 27. FORM DESIGN

Inputs should feel premium.

Use:

- floating labels where appropriate
- clear labels
- helper text
- validation
- focus glow
- error state
- disabled state

Never rely exclusively on placeholder text.

---

# 28. TOAST SYSTEM

Create a global toast notification system.

Examples:

```text
✓ Schedule created

GitHub connected

⚠ Unable to refresh activity

✕ Schedule failed
```

Toasts should be:

- concise
- dismissible
- accessible
- theme aware

---

# 29. LOADING STATES

Every API-driven component must have a skeleton state.

Do NOT use:

```text
Loading...
```

everywhere.

Create skeletons matching the final layout.

Examples:

```text
MetricSkeleton
ChartSkeleton
HeatmapSkeleton
RepositorySkeleton
ScheduleSkeleton
```

---

# 30. ERROR STATES

Create friendly error states.

Example:

```text
Something went wrong

We couldn't load your GitHub activity.

[Try Again]
```

Do not expose:

```text
AxiosError
500 Internal Server Error
```

to the user.

Log technical details appropriately.

---

# 31. EMPTY STATES

Example:

```text
No activity yet

Connect GitHub to start exploring
your engineering activity.

[Connect GitHub]
```

Empty states should always explain:

1. What happened
2. Why it matters
3. What the user should do next

---

# 32. ACCESSIBILITY

Implement:

- semantic HTML
- keyboard navigation
- focus states
- ARIA labels
- screen-reader friendly controls
- reduced motion
- sufficient contrast
- accessible tooltips
- accessible dialogs

Do not sacrifice accessibility for visual design.

---

# 33. COMPONENT ARCHITECTURE

Refactor toward reusable components.

Suggested:

```text
frontend/src/

components/

  layout/
    AppShell.tsx
    Sidebar.tsx
    Topbar.tsx
    CommandPalette.tsx

  dashboard/
    MetricCard.tsx
    ActivityChart.tsx
    ActivitySummary.tsx
    Insights.tsx

  heatmap/
    ContributionHeatmap.tsx
    HeatmapCell.tsx
    HeatmapTooltip.tsx
    HeatmapInspector.tsx

  presets/
    PresetSelector.tsx
    PresetCard.tsx
    PresetPreview.tsx

  schedule/
    ScheduleConfigurator.tsx
    SchedulePreview.tsx
    ScheduleReview.tsx
    ScheduleStatus.tsx

  auth/
    AuthHero.tsx
    GitHubConnect.tsx
    PATLogin.tsx

  ui/
    Button.tsx
    Input.tsx
    Select.tsx
    Modal.tsx
    Drawer.tsx
    Tooltip.tsx
    Toast.tsx
    Skeleton.tsx
    Badge.tsx

  theme/
    ThemeSwitcher.tsx
```

Adapt this structure to the existing project rather than blindly creating duplicate components.

---

# 34. STATE MANAGEMENT

Do not introduce unnecessary state libraries.

Use:

- React state
- Context
- URL state
- server state
- existing architecture

where appropriate.

Keep:

### UI state

Separate from:

### API state

Separate from:

### Authentication state

Separate from:

### Schedule configuration state

This will prevent the interface from becoming difficult to maintain.

---

# 35. API INTEGRATION

Do not hardcode fake production data.

Use the existing FastAPI API.

Expected routes include:

```text
/api/health

/api/auth/github
/api/auth/callback
/api/auth/pat
/api/auth/me

/api/commits/schedule

/api/presets/generate
```

Create a clean frontend API layer:

```text
lib/
  api/
    auth.ts
    commits.ts
    presets.ts
```

Handle:

- loading
- success
- error
- retry
- timeout
- authentication failure

consistently.

---

# 36. SECURITY

Frontend must NEVER:

- expose GitHub client secrets
- expose backend secrets
- log PAT tokens
- store sensitive credentials unnecessarily
- put secrets in client-side environment variables

Use server-side environment variables appropriately.

---

# 37. PERFORMANCE

Target:

```text
Fast initial render
Fast navigation
Minimal JavaScript
Smooth charts
No unnecessary re-renders
```

Use:

- Next.js App Router appropriately
- server components where useful
- client components only when interaction requires them
- dynamic imports for heavy visualizations
- memoization where justified
- optimized animation
- lazy loading

Do not over-engineer.

---

# 38. DESIGN SYSTEM

Create a unified system for:

```text
Colors
Typography
Spacing
Radius
Borders
Shadows
Glass
Motion
Icons
Charts
```

Avoid one-off CSS.

Every page should clearly belong to the same product.

---

# 39. PAGE STRUCTURE

The finished application should have approximately:

```text
/
    Landing / Authentication

/dashboard
    Overview

/activity
    Activity timeline

/schedule
    Schedule configurator

/presets
    Preset strategies

/insights
    Analytics insights

/settings
    Account / theme / GitHub
```

Adapt routes to the current application if different routes already exist.

Do not break existing URLs unnecessarily.

---

# 40. DESIGN QUALITY CHECK

After implementation, inspect every screen at:

```text
1440px
1280px
1024px
768px
390px
```

Check:

### Alignment

Everything follows a consistent grid.

### Spacing

No cramped sections.

### Typography

Clear hierarchy.

### Contrast

Readable.

### Motion

Smooth.

### Components

Consistent.

### Data

Easy to scan.

### Mobile

Actually usable.

---

# 41. VISUAL QA

Use browser inspection/screenshots if available.

For each major page ask:

```text
Does this look like a real product?

Does it look premium?

Does the hierarchy make sense?

Is there too much glass?

Is there too much glow?

Are the charts understandable?

Are the important numbers obvious?

Are buttons obvious?

Does anything feel like a template?
```

Fix visual inconsistencies rather than accepting the first implementation.

---

# 42. DO NOT

Never:

- rewrite the backend just for visual reasons
- remove existing API endpoints
- remove authentication
- replace real API data with mock data
- introduce unnecessary dependencies
- make everything glass
- make everything glow
- use excessive gradients
- use random 3D illustrations
- use generic stock imagery
- create a cyberpunk gaming aesthetic
- copy another SaaS product
- sacrifice performance for animation
- sacrifice accessibility for aesthetics

---

# 43. IMPORTANT FUNCTIONALITY RULE

The existing application contains functionality around GitHub activity scheduling and contribution planning.

The frontend should present this functionality **clearly and transparently as user-configured GitHub activity scheduling**.

Do not introduce UX intended to disguise automated/generated activity as organic human activity.

Do not add features whose purpose is to misrepresent activity.

Focus the design on:

- planning
- scheduling
- visualization
- review
- transparency
- user control

---

# 44. IMPLEMENTATION ORDER

Follow this exact sequence.

## STEP 1

Audit the existing codebase.

## STEP 2

Create a short architecture map.

## STEP 3

Identify what can be reused.

## STEP 4

Create/refine design tokens.

## STEP 5

Build AppShell.

## STEP 6

Build navigation.

## STEP 7

Build authentication experience.

## STEP 8

Redesign dashboard.

## STEP 9

Redesign contribution heatmap.

## STEP 10

Redesign preset selector.

## STEP 11

Redesign schedule configurator.

## STEP 12

Create schedule review/status experience.

## STEP 13

Create activity timeline.

## STEP 14

Create insights.

## STEP 15

Implement responsive design.

## STEP 16

Implement accessibility.

## STEP 17

Implement loading/error/empty states.

## STEP 18

Perform visual QA.

## STEP 19

Run build verification.

---

# 45. VERIFICATION

Backend:

```bash
cd backend
python -m pytest
uvicorn main:app --reload
```

Verify:

```text
/api/health
```

returns:

```text
200 OK
```

Frontend:

```bash
cd frontend
npm run build
npm run dev
```

Verify:

```text
http://localhost:3000
```

Check:

- no TypeScript errors
- no hydration errors
- no console errors
- no broken API calls
- no broken routes
- no missing assets

---

# 46. FINAL QUALITY BAR

The final GitPulse should feel like:

> **A serious developer product from 2026.**

Not a portfolio project.

Not a dashboard template.

Not a concept design.

Not a cyberpunk demo.

It should feel:

```text
Premium
Technical
Calm
Intelligent
Fast
Precise
Interactive
Trustworthy
```

The visual hierarchy should be:

```text
DATA
↓
INSIGHT
↓
ACTION
```

rather than:

```text
DECORATION
↓
CARDS
↓
DATA
```

---

# FINAL COMMAND

Do not begin by rewriting everything.

First inspect the existing implementation.

Then:

1. Preserve the architecture.
2. Preserve working functionality.
3. Preserve the existing theme concept.
4. Upgrade the design system.
5. Upgrade the UX.
6. Upgrade the information hierarchy.
7. Upgrade interactions.
8. Upgrade responsive behavior.
9. Upgrade accessibility.
10. Perform visual QA.

The final result should be a **production-quality GitPulse frontend that feels dramatically more polished while remaining recognizably the same product underneath.**