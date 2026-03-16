# PrepIQ – MVP Page Redesign & Functionality Upgrade

You are a **senior full-stack engineer and product designer**.

You are redesigning and refactoring the **PrepIQ platform**.

PrepIQ is an **AI-powered placement preparation platform** that tracks coding behaviour and generates adaptive preparation roadmaps.

The system already has a core architecture.
Your task is to **improve functionality and UI for the following pages** while keeping the MVP stable.

Pages to redesign:

```
Onboarding
Problem
Tutorial
Profile
```

The system must look and behave like a **serious developer platform**, not a generic AI web app.

---

# PRIMARY GOAL

Improve:

1️⃣ usability
2️⃣ developer-focused UI
3️⃣ preparation workflow
4️⃣ AI roadmap accuracy

The redesign must follow the **UX patterns used by major coding platforms**.

Reference platforms:

```
LeetCode
TakeUForward (TUF+)
Codeforces
GitHub
Vercel dashboard
Linear.app
```

Avoid:

```
generic AI SaaS UI
heavy gradients
glow effects
marketing-style layouts
```

---

# CORE PRINCIPLE

PrepIQ is **not just a coding platform**.

It is a **preparation intelligence system**.

Therefore every page must support:

```
learning
practice
analytics
roadmap tracking
```

The **AI roadmap generation system is the core MVP feature**.

All pages must integrate with the roadmap system.

---

# PAGE 1 — ONBOARDING SYSTEM

The onboarding page must be redesigned to create **high-quality AI roadmap input data**.

The onboarding flow should feel similar to:

```
Notion onboarding
Duolingo onboarding
TUF+ learning path setup
```

---

# ONBOARDING FLOW

Step 1 — Welcome Screen

Display:

```
PrepIQ introduction
Purpose of platform
```

Buttons:

```
Start Setup
Skip Assessment
```

---

Step 2 — Preparation Context Survey

Collect the following data:

```
Current academic year
Target companies
Preferred programming language
Weekly preparation hours
Current DSA confidence level
Preparation start date
Target timeline
```

Example options:

```
DSA Level
Beginner
Intermediate
Advanced
```

---

Step 3 — Learning Preference

Ask user:

```
Focus areas
```

Options:

```
DSA
Competitive Programming
System Design
Interview Preparation
```

---

Step 4 — Optional DSA Assessment

Purpose:

```
generate accurate initial roadmap
```

Assessment format:

```
5 easy problems
3 medium problems
1 hard problem
```

Topics:

```
Arrays
Strings
Recursion
Hashing
Binary Search
```

Metrics collected:

```
accuracy
time taken
attempts
difficulty success
```

---

Step 5 — AI Roadmap Generation

After onboarding the system must call:

```
generate_initial_roadmap()
```

Inputs:

```
survey_data
assessment_data
target_company
weekly_hours
```

Output:

```
30-day roadmap
```

---

# ONBOARDING UI DESIGN

Layout:

```
Centered stepper UI
Progress indicator
Minimal text
Clear choices
```

Example structure:

```
Step 1  Welcome
Step 2  Preparation Survey
Step 3  Learning Preferences
Step 4  DSA Assessment
Step 5  AI Roadmap Generated
```

---

# PAGE 2 — PROBLEM PAGE

This page must behave like a **LeetCode problem interface**.

But integrate **PrepIQ roadmap intelligence**.

---

# PROBLEM EXPLORER PAGE

Display a problem table.

Columns:

```
Status
Title
Difficulty
Topic
Company Tags
Acceptance Rate
```

Filters:

```
Topic filter
Difficulty filter
Company filter
Solved filter
Roadmap filter
```

---

# ROADMAP INTEGRATION

Problems that are part of the user roadmap must display:

```
Roadmap tag
```

Example:

```
Binary Search
Roadmap Day 4
```

---

# PROBLEM DETAIL PAGE

Layout must follow **LeetCode style split view**.

Left Panel:

```
Problem description
Examples
Constraints
Hints
Tutorial
Company tags
```

Right Panel:

```
Code editor
Language selector
Run button
Submit button
```

Languages:

```
C++
Java
Python
```

---

# CODE EXECUTION SYSTEM

Use a code execution engine.

Options:

```
Judge0 API
Docker sandbox
Code runner service
```

Execution flow:

```
User code
↓
API request
↓
Compiler service
↓
Test cases run
↓
Output returned
```

Display:

```
stdout
stderr
execution time
memory
```

---

# POST-SUBMISSION ANALYTICS

After solving a problem show:

```
success status
runtime
topic mastery impact
roadmap progress update
```

Update AI metrics:

```
accuracy
attempts
topic strength
```

---

# PAGE 3 — TUTORIAL PAGE

Tutorial pages must resemble **TakeUForward (TUF+) learning modules**.

Each topic should include structured learning.

Example topics:

```
Arrays
Strings
Binary Search
Trees
Graphs
Dynamic Programming
Greedy
Backtracking
```

---

# TUTORIAL STRUCTURE

Each tutorial page must contain:

```
Concept explanation
Visual diagrams
Code examples
Time complexity analysis
Common mistakes
Practice problems
```

---

# TUTORIAL PRACTICE INTEGRATION

Each tutorial must link to:

```
Beginner problems
Intermediate problems
Interview problems
```

Example:

```
Binary Search Tutorial
↓
Solve 5 Problems
```

---

# ROADMAP LINK

If a tutorial is part of roadmap show:

```
Roadmap Day indicator
```

Example:

```
Roadmap Day 7
Binary Search Tutorial
```

---

# PAGE 4 — PROFILE PAGE

The profile page must look like a **developer performance dashboard**.

Inspired by:

```
LeetCode profile
GitHub contribution page
```

---

# PROFILE SECTIONS

User info

```
name
target company
weekly goal
skill level
```

---

# PREPARATION STATISTICS

Display:

```
Problems solved
Current streak
Total submissions
Accuracy
Average solving time
```

---

# TOPIC MASTERY

Display topic strength radar chart.

Topics:

```
Arrays
Graphs
DP
Trees
Greedy
Recursion
```

---

# COMPANY READINESS

Display readiness score.

Example:

```
Amazon readiness 63%
Google readiness 48%
```

---

# PROGRESS VISUALIZATION

Include:

```
heatmap calendar
weekly activity graph
difficulty distribution
```

---

# FRONTEND DESIGN RULES

Theme:

```
Dark developer UI
```

Primary colors:

```
Background: #0B0F14
Cards: #151B22
Borders: #222A33
Accent: #3B82F6
```

Avoid:

```
rainbow gradients
glowing neon effects
marketing UI
```

Use fonts:

```
Inter
JetBrains Mono
```

---

# COMPONENT ARCHITECTURE

Frontend components must include:

```
Sidebar
TopNavbar
ProblemTable
ProblemEditor
TutorialViewer
RadarChart
RoadmapCalendar
ProfileStats
```

---

# BACKEND INTEGRATION

Ensure the pages interact correctly with backend APIs.

Important endpoints:

```
POST /survey/submit
POST /assessment/submit
POST /roadmap/generate
GET /problems
POST /compiler/run
GET /analytics
```

---

# CODE QUALITY REQUIREMENTS

The generated code must:

```
use React + TypeScript
use TailwindCSS
use modular components
connect to FastAPI backend
handle loading states
handle error states
```

---

# FINAL PRODUCT GOAL

After implementing these changes:

PrepIQ should behave like:

```
LeetCode + TUF+ + AI Preparation Coach
```

Users should be able to:

```
Complete onboarding
Receive AI roadmap
Practice coding
Learn tutorials
Track preparation progress
```

The system must feel like a **serious developer preparation platform**, not an AI toy app.

---
