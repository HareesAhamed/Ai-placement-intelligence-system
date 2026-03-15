# PrepIQ – Futuristic Developer Platform UI

You are a **senior product designer and frontend engineer**.

Design the **full UI/UX for PrepIQ**, an AI-powered placement preparation platform.

PrepIQ is a **developer productivity platform**, not a generic AI SaaS product.

The design must look like a **professional coding platform used by serious developers**.

---

# DESIGN PHILOSOPHY

The UI must combine the design inspiration of:

• **LeetCode** → coding platform layout
• **TakeUForward (TUF+)** → structured learning roadmap
• **GitHub** → developer productivity interface
• **Linear.app** → clean modern UI
• **Vercel dashboard** → premium minimal feel

Avoid looking like:

❌ generic AI startup landing page
❌ heavy neon gradients
❌ excessive glowing effects
❌ flashy marketing design

The UI must look like:

✅ serious developer tool
✅ structured and professional
✅ information-dense but clean
✅ futuristic but practical

---

# COLOR SYSTEM (IMPORTANT)

Avoid the typical **AI gradient palette**.

Use a **developer platform color system**.

Primary Theme

Dark mode default.

Background

```
#0B0F14
```

Secondary background

```
#11161C
```

Card background

```
#151B22
```

Border color

```
#222A33
```

Primary accent

```
#3B82F6
```

Success

```
#22C55E
```

Warning

```
#F59E0B
```

Error

```
#EF4444
```

Text colors

Primary text

```
#E6EDF3
```

Secondary text

```
#9BA3AF
```

Muted

```
#6B7280
```

Do NOT use:

• rainbow gradients
• glowing backgrounds
• flashy animations

---

# TYPOGRAPHY

Use developer-friendly fonts.

Headings

```
Inter
```

Code

```
JetBrains Mono
```

Font hierarchy

```
H1 32px
H2 24px
H3 18px
Body 14px
Code 13px
```

---

# GLOBAL LAYOUT

The platform layout should follow a **developer dashboard layout**.

Structure:

```
Left Sidebar
Top Navigation
Main Workspace
Right Context Panel (optional)
```

Example layout

```
| Sidebar | Main Content | Context Panel |
```

---

# SIDEBAR DESIGN

Sidebar should resemble **GitHub / Linear style navigation**.

Width

```
260px
```

Sections

Logo

PrepIQ

Navigation

```
Dashboard
Roadmap
Problems
Tutorials
Analytics
Mock Interviews
Contests
Settings
```

Bottom section

```
User profile
Notifications
Logout
```

Icons should be **Lucide icons**.

---

# TOP NAVBAR

Top bar should contain:

```
Search problems
Current roadmap progress
Company readiness score
Notifications
User avatar
```

Example

```
[Search Problems]   [Roadmap Progress]   [Company Readiness]   [Profile]
```

---

# DASHBOARD PAGE

The dashboard should look like a **developer analytics command center**.

Layout grid

```
2 column grid
```

Top widgets

Topic Strength Radar Chart

Weak Topics

Company Readiness Gauge

Weekly Progress

Lower widgets

Problem Solving Consistency Chart

Difficulty Distribution

Roadmap Progress Tracker

---

# RADAR CHART (Topic Strength)

Show topic performance.

Topics

```
Array
String
Graph
DP
Tree
Recursion
Greedy
```

Chart style

• subtle grid lines
• muted background
• blue highlight

Use

```
Recharts
```

---

# WEAK TOPIC PANEL

Card design

```
Weak Topics
-------------
Graph (Accuracy 34%)
DP (Accuracy 41%)
Backtracking (Accuracy 38%)
```

Include

```
Practice Button
```

---

# COMPANY READINESS WIDGET

Display readiness score.

Example

```
Amazon Readiness
64%
```

Gauge style.

Color:

```
blue → green
```

---

# ROADMAP PAGE

This is the **core UI of PrepIQ**.

It must look like a **learning operating system**.

Layout

```
Calendar roadmap view
```

Example

```
Week 1

Day 1
Arrays tutorial
3 problems

Day 2
Binary search tutorial
3 problems
```

Each day card

```
Topic
Problems count
Tutorial
Estimated time
Completion status
```

Status indicators

```
Completed
In progress
Pending
```

---

# PROBLEMS PAGE

Must resemble **LeetCode problem explorer**.

Table layout

Columns

```
Status
Title
Difficulty
Topic
Acceptance
Companies
```

Filters

```
Topic filter
Difficulty filter
Company filter
Solved filter
```

---

# PROBLEM DETAIL PAGE

Split layout like LeetCode.

Left panel

```
Problem description
Examples
Constraints
Hints
Tutorial
```

Right panel

Code editor

Languages

```
C++
Java
Python
```

Buttons

```
Run Code
Submit
Reset
```

---

# CODE EDITOR

Use:

```
Monaco Editor
```

Features

```
syntax highlighting
auto indentation
line numbers
theme support
```

Execution panel

```
Input
Output
Execution time
Memory
```

---

# TUTORIAL PAGE

Tutorial UI should resemble **TUF+ learning pages**.

Structure

```
Topic Overview
Concept Explanation
Code Examples
Time Complexity
Practice Problems
```

Example

```
Binary Search Tutorial
```

---

# ANALYTICS PAGE

Analytics must feel like a **developer performance dashboard**.

Widgets

```
Topic Strength Radar
Accuracy Trend
Consistency Graph
Difficulty Distribution
Weak Topic Ranking
Company Readiness Score
```

Charts

```
Recharts
```

---

# CONTEST PAGE

Inspired by LeetCode contests.

Display

```
Upcoming contests
Live contests
Past contests
Leaderboard
```

---

# MICRO INTERACTIONS

Use subtle animations.

Examples

```
hover highlight
card elevation
button ripple
progress animation
```

Avoid

```
neon glow
heavy transitions
bouncing UI
```

---

# CARD DESIGN

All components should use **clean developer cards**.

Style

```
border-radius: 10px
border: 1px solid #222A33
background: #151B22
```

Padding

```
16px – 24px
```

---

# RESPONSIVENESS

The UI must work on:

```
Laptop
Tablet
Desktop
```

Sidebar collapses on small screens.

---

# FRONTEND STACK

Use

```
React + TypeScript
TailwindCSS
Recharts
Monaco Editor
Lucide Icons
React Query
```

---

# COMPONENT STRUCTURE

```
components/

Sidebar.tsx
TopNavbar.tsx
RadarChart.tsx
ReadinessGauge.tsx
RoadmapCalendar.tsx
ProblemTable.tsx
CodeEditor.tsx
WeakTopicList.tsx
```

---

# VISUAL STYLE SUMMARY

PrepIQ must look like:

```
GitHub + LeetCode + Linear
```

It must NOT look like:

```
generic AI SaaS
```

The design should feel like:

```
developer productivity platform
```

---

# FINAL RESULT

PrepIQ should visually feel like:

```
A futuristic developer preparation operating system
```

Used by serious programmers preparing for interviews.

---
