# PrepIQ – Assessment System + Stats Integration + Content Linking Upgrade

You are a **senior full-stack engineer + AI systems architect**.

You are upgrading an existing platform:

**PrepIQ – AI-Based Placement Intelligence System**

The system already includes:

* coding platform (problems + compiler)
* roadmap generation
* analytics dashboard
* mock test module (basic)

Your task is to **enhance the MVP into a complete preparation system**.

---

# 🎯 PRIMARY OBJECTIVE

Build a system where:

```text
Assessment + Practice + External Stats + Tutorials + AI → Unified Intelligence System
```

The system must behave like:

```text
LeetCode + GFG + TUF+ + AI Coach
```

---

# 🔥 FEATURE 1 — TEST / ASSESSMENT TAB (LIKE LEETCODE)

Add new tab:

```text
Assessment
```

This tab includes:

```text
DSA Assessment
Survey Test
Mock Tests (already exists, integrate here)
```

---

## 🧩 Assessment Page Layout

Sections:

```text
1. Start Assessment
2. Previous Assessments
3. Performance Summary
```

---

## 🧠 DSA ASSESSMENT TEST

Purpose:

```text
Evaluate user's real skill level
Generate accurate roadmap
```

---

### Structure

```text
Total: 9 problems
5 Easy
3 Medium
1 Hard
```

Topics:

```text
Arrays
Strings
Recursion
Hashing
Binary Search
```

---

### Test Behavior

```text
Timer enabled (90 min)
Auto submit on timeout
Lock navigation (optional)
```

---

### Metrics Captured

```text
accuracy
time per problem
attempt count
difficulty success rate
completion %
```

---

## 🧠 SURVEY TEST (SMART INPUT SYSTEM)

Instead of static form, make it **interactive test-like UI**.

Questions:

```text
How confident are you in DSA?
How many problems solved before?
Target companies?
Weekly study hours?
Preferred language?
Weak areas (self-declared)?
```

---

## 🤖 AI USAGE

Assessment + survey feed into:

```text
generate_initial_roadmap()
```

---

# 🔥 FEATURE 2 — MOCK TEST INTEGRATION (MERGE)

Merge Mock Test into Assessment tab:

```text
Assessment
  ├── DSA Test
  ├── Survey
  └── Mock Tests
```

Mock test remains separate but accessible here.

---

# 🔥 FEATURE 3 — FIX GFG STATS FETCH (CRITICAL)

---

## ⚠️ Problem

GFG stats fetch is unreliable / broken.

---

## ✅ Solution Approach

Implement **robust scraping/API layer**.

---

## 🧠 Backend Service

Create:

```text
gfg_service.py
leetcode_service.py
```

---

## 🧩 GFG Fetch Strategy

Options:

1. Scrape public profile:

```text
https://auth.geeksforgeeks.org/user/{username}/practice/
```

Extract:

```text
problems solved
coding score
institution rank
monthly activity
```

2. Use fallback:

```text
manual input if scraping fails
```

---

## 🧩 LeetCode Fetch

Use GraphQL:

```text
https://leetcode.com/graphql
```

Fetch:

```text
total solved
easy/medium/hard solved
contest rating
submission stats
```

---

## 🛠 Error Handling

```text
if fetch fails:
  retry
  fallback to cached data
  show "sync failed" message
```

---

# 🔥 FEATURE 4 — PROFILE ANALYTICS INTEGRATION

Enhance profile page.

---

## 📊 Combine 3 Data Sources

```text
1. Internal PrepIQ data
2. LeetCode stats
3. GFG stats
```

---

## 🧠 Unified Metrics

Display:

```text
Total problems solved (all platforms)
Topic strength (internal)
Accuracy (internal)
LeetCode difficulty distribution
GFG score
Contest rating (LC)
```

---

## 📈 Advanced Analytics

```text
Platform comparison chart
Skill gap analysis
External vs internal consistency
```

---

# 🔥 FEATURE 5 — SAMPLE TUTORIAL SYSTEM

Add real content for MVP.

---

## 🧩 Create Tutorials Table

```text
id
title
topic
content
difficulty_level
```

---

## 🧪 Sample Tutorials

Add at least:

```text
Arrays Basics
Binary Search
Two Pointers
Recursion
DFS/BFS
Dynamic Programming Intro
```

---

## 📘 Tutorial Content Structure

Each tutorial must include:

```text
Concept
Explanation
Code examples (C++/Java/Python)
Time complexity
Practice problems
```

---

# 🔥 FEATURE 6 — CONTENT LINKING SYSTEM (IMPORTANT)

Everything must be connected using IDs.

---

## 🔗 Relationships

```text
Problem → tutorial_id
Problem → editorial_id
Roadmap → problem_id
Roadmap → tutorial_id
Editorial → tutorial_id
```

---

## 🧩 Example Flow

```text
Roadmap Day 3
↓
Binary Search Tutorial
↓
Solve Problem 34
↓
View Editorial
↓
Back to Tutorial
```

---

## 🧠 Database Update

Problems table:

```text
tutorial_id
editorial_id
```

Editorial table:

```text
id
problem_id
content
```

---

# 🔥 FEATURE 7 — EDITORIAL + TUTORIAL INTEGRATION

Problem page tabs:

```text
Description | Submissions | Code Review | Editorial
```

---

## 📘 Editorial Content

```text
Approach explanation
Brute force
Optimized solution
Code examples
Complexity
```

---

## 🔗 Link to Tutorial

```text
Binary Search Problem → Binary Search Tutorial
```

---

# 🔥 FEATURE 8 — AI ENHANCEMENTS (CREATIVE UPGRADE)

---

## 🧠 Skill Gap Detection

AI compares:

```text
User vs company requirement
```

Example:

```text
Amazon requires Graph + DP
User weak in Graph
→ highlight gap
```

---

## 🧠 Smart Recommendations

After each submission:

```text
"Practice 2 more Graph problems"
"Review Binary Search tutorial"
```

---

## 🧠 Learning Pattern Detection

Detect:

```text
fast learner
slow but consistent
inconsistent
topic skipping
```

---

# 🔥 FEATURE 9 — IMPROVED DATA FLOW

Final system loop:

```text
Assessment → Roadmap
↓
Solve Problems
↓
Metrics Stored
↓
External Stats Synced
↓
AI Analysis Runs
↓
Roadmap Updated
↓
User Improves
```

---

# 🔥 FRONTEND ADDITIONS

New pages:

```text
AssessmentPage.tsx
SurveyTest.tsx
DSATest.tsx
StatsIntegrationPanel.tsx
```

Enhancements:

```text
Profile.tsx
ProblemDetail.tsx
Roadmap.tsx
```

---

# 🔥 BACKEND ADDITIONS

```text
routers/
assessment_router.py
stats_router.py

services/
gfg_service.py
leetcode_service.py
assessment_engine.py
```

---

# 🔥 DATABASE ADDITIONS

Assessment

```text
id
user_id
score
accuracy
time_taken
```

---

ExternalStats

```text
user_id
leetcode_data
gfg_data
last_synced
```

---

Tutorial

```text
id
title
content
topic
```

---

Editorial

```text
id
problem_id
content
```

---

# 🚀 FINAL PRODUCT

PrepIQ becomes:

```text
AI-powered preparation intelligence ecosystem
```

With:

```text
assessment system
coding platform
tutorial system
external stats integration
AI roadmap engine
analytics dashboard
```

---

# ✅ FINAL EXPECTED BEHAVIOR

```text
User registers
↓
Takes survey + assessment
↓
AI generates roadmap
↓
User solves problems
↓
Stats (internal + LC + GFG) collected
↓
AI analyzes continuously
↓
Roadmap adapts
↓
User improves systematically
```

---

## 🔥 BONUS (Optional Enhancement Ideas)

Add:

```text
Daily streak system
Gamification badges
Company-wise preparation mode
Peer comparison (leaderboard)
```

---
