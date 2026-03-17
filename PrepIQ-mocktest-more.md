# PrepIQ – MVP Feature Upgrade (Mock Test + AI Intelligence + Workflow Integration)

You are a **senior full-stack engineer + AI systems architect**.

You are upgrading an existing platform:

**PrepIQ – AI-Based Placement Intelligence System**

The platform already includes:

* authentication
* problems system
* roadmap generation
* analytics dashboard

Your task is to **extend and refine the MVP** with new features and deeper system integration.

---

# 🎯 PRIMARY OBJECTIVE

Transform PrepIQ into a **fully interactive AI preparation system** where:

```
User action → Data logged → AI analyzes → Roadmap adapts
```

The system must behave like:

```
LeetCode + TUF+ + AI Coach + Interview Simulator
```

---

# 🔥 FEATURE 1 — MOCK TEST TAB (NEW MODULE)

Add a new main tab:

```
Mock Test
```

---

## 🧠 Purpose

Simulate **real interview / OA environments**.

---

## 🧩 Mock Test Types

```id="mock-types"
1. Topic-based test
2. Mixed DSA test
3. Company-specific test
4. Timed full mock (like OA)
```

---

## ⚙️ Mock Test Structure

Each test includes:

```id="mock-structure"
2–5 problems
difficulty mix (easy, medium, hard)
time limit (60–120 mins)
```

---

## 🧪 Test Flow

```
Start Test → Timer starts
↓
Solve problems
↓
Submit all / Auto-submit on timeout
↓
Evaluation
↓
Analytics generated
```

---

## 📊 Mock Test Metrics

Store:

```id="mock-metrics"
score
accuracy
time per problem
completion %
topics covered
weak areas
```

---

## 🤖 AI Integration

After test:

* update **topic strength**
* update **weakness scores**
* trigger **roadmap refresh**

---

## 🧱 Backend

Create:

```
mock_test.py (model)
mock_router.py
mock_engine.py
```

---

# 🔥 FEATURE 2 — ROADMAP TASK EXECUTION FLOW

Enhance roadmap page.

---

## 🧩 Current Issue

Roadmap is static → must become **interactive execution system**.

---

## ✅ Required Behavior

When user clicks:

```
Day 1 → View details
```

Show:

```id="day-details"
Topics
Problems list
Tutorial links
Estimated time
```

---

## ▶️ Continue Task Button

Add button:

```
Continue Task
```

---

## 🔁 Flow

```
Click Continue Task
↓
Redirect to Problem Page
↓
Load specific problem from roadmap
```

---

## 🔄 Task Completion Logic

When user solves roadmap problem:

```
Auto mark as completed
Update roadmap progress
```

UI:

```
☑ Completed
⏳ In progress
⬜ Pending
```

---

## 🧠 Backend Logic

When submission success:

```id="task-complete"
if problem_id in roadmap:
    mark task complete
    update roadmap progress
```

---

# 🔥 FEATURE 3 — USER METRICS LOGGING SYSTEM (CRITICAL)

Every user action must be tracked.

---

## 📊 Store the following:

```id="metrics"
problem attempts
accuracy
time taken
difficulty success rate
topic frequency
submission history
consistency
mock test performance
```

---

## 🧱 Backend Tables

Add:

```
user_metrics
topic_metrics
activity_logs
```

---

## 🧠 Derived Metrics

Compute:

```id="derived"
accuracy per topic
avg solving time
difficulty success rate
learning trend
```

---

# 🔥 FEATURE 4 — AI ANALYSIS ENGINE (AUTO + MANUAL)

---

## 🤖 Automatic Analysis

Trigger AI when:

```id="auto-triggers"
user login
problem submission
mock test completion
weekly refresh
```

---

## 🧠 Manual Analysis Button

Add button:

```
Run AI Analysis
```

---

## ⚙️ What it does:

```
Recompute topic strength
Update weak topics
Recalculate company readiness
Regenerate roadmap
```

---

## API

```
POST /ai/analyze
POST /roadmap/refresh
```

---

# 🔥 FEATURE 5 — AUTO ROADMAP REFRESH

---

## 🔄 Trigger Conditions

```id="refresh-triggers"
problem submission
mock test completion
manual button click
weekly scheduler
```

---

## 🧠 Refresh Logic

```
update topic strength
detect weak topics
detect trends
regenerate roadmap
```

---

## 🧩 Trend Detection Examples

```id="trend"
user improving in arrays
user stuck in graphs
user skipping hard problems
```

---

# 🔥 FEATURE 6 — CODE REVIEW SYSTEM

After user submits solution:

---

## 🧠 Add "Code Review" Tab

Display:

```id="review"
optimal solution
time complexity
space complexity
improvements
alternative approaches
```

---

## 🤖 AI Review Engine

Use:

```
LLM or rule-based analyzer
```

---

## Example Output

```
Your solution is correct but not optimal.
Time complexity: O(n²)
Optimal: O(n) using hashmap.
```

---

## Backend

```
code_review_service.py
```

---

# 🔥 FEATURE 7 — EDITORIAL TAB (LINK TO TUTORIAL)

Add tab in problem page:

```
Description | Submissions | Code Review | Editorial
```

---

## 📘 Editorial Content

Display:

```id="editorial"
concept explanation
step-by-step solution
optimized code
related tutorial link
```

---

## 🔗 Link to Tutorial Page

```
Binary Search Problem → Binary Search Tutorial
```

---

# 🔥 FEATURE 8 — PROBLEM PAGE ENHANCEMENTS

After submission:

Show:

```id="post-submit"
result (success/fail)
execution stats
topic mastery update
roadmap progress update
```

---

# 🔥 FEATURE 9 — SYSTEM DATA FLOW

Final system loop:

```id="flow"
User solves problem
↓
Metrics stored
↓
AI analysis runs
↓
Weak topics updated
↓
Roadmap refreshed
↓
Dashboard updated
```

---

# 🔥 FRONTEND UPDATES

Add pages:

```
MockTestPage.tsx
RoadmapDetail.tsx
CodeReviewPanel.tsx
EditorialTab.tsx
```

Enhance:

```
ProblemDetail.tsx
Roadmap.tsx
Dashboard.tsx
```

---

# 🔥 BACKEND STRUCTURE UPDATE

Add:

```
routers/
mock_router.py
ai_router.py

services/
mock_engine.py
analysis_engine.py
code_review_service.py

models/
mock_test.py
user_metrics.py
activity_log.py
```

---

# 🔥 DATABASE ADDITIONS

MockTest

```id="mock-db"
id
user_id
score
accuracy
time_taken
topics
```

---

UserMetrics

```id="metrics-db"
user_id
topic
accuracy
avg_time
attempts
```

---

ActivityLog

```id="log-db"
user_id
action
timestamp
metadata
```

---

# 🔥 FINAL EXPECTED SYSTEM BEHAVIOR

User journey:

```
Login
↓
AI analyzes past data
↓
Dashboard updates
↓
User follows roadmap
↓
Clicks Day → goes to problem
↓
Solves problem
↓
Metrics updated
↓
AI refreshes roadmap
↓
User improves continuously
```

---

# 🚀 FINAL PRODUCT

PrepIQ becomes:

```
AI-powered placement preparation OS
```

With:

```id="final-features"
interactive roadmap
mock interview system
coding platform
AI analytics engine
adaptive roadmap
code review assistant
tutorial integration
```

---
