# PrepIQ – AI-Based Placement Intelligence System

You are a **senior AI systems architect and full-stack engineer**.

Your task is to generate a **complete MVP implementation** of the project:

# PrepIQ – AI-Based Placement Intelligence System

PrepIQ is an **AI-powered placement preparation intelligence platform** that transforms unstructured coding practice into **structured preparation intelligence**.

The platform must include:

* a **coding practice system**
* **AI learning analytics**
* **AI roadmap generation**
* **behaviour-based roadmap refresh**

The **most important module is the AI roadmap engine**.

The system must be designed to work like:

LeetCode + Notion Roadmap + AI Coach.

---

# PRIMARY OBJECTIVE

The system should convert **student preparation behaviour → intelligent preparation guidance**.

The platform must:

1 Track coding behaviour
2 Detect weak topics
3 Generate structured preparation roadmaps
4 Adapt roadmap weekly using AI
5 Map preparation to company requirements

The final system should act as a **digital AI placement mentor**.

---

# MVP CORE FEATURES

The MVP must include the following modules.

### 1 User Registration System

User registration must include a **small onboarding survey**.

The survey collects preparation context for the **initial roadmap generation**.

Survey fields:

```
Current Year (2nd / 3rd / Final)
DSA experience level (Beginner / Intermediate / Advanced)
Target companies
Available weekly study hours
Preferred programming language
Preparation start date
Goal timeline (3 months / 6 months)
```

---

### Optional Initial DSA Assessment Test

After registration the system can offer:

```
Optional DSA skill assessment
```

The test includes:

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
attempt count
difficulty success
```

These metrics help generate the **first AI roadmap**.

---

# CORE FEATURE: AI ROADMAP GENERATION

This is the **most important feature of the MVP**.

The system must generate:

```
Personalized 30-day roadmap
```

The roadmap must depend on:

```
User survey
DSA assessment (optional)
Problem solving behaviour
Weak topics
Company priorities
Available weekly hours
```

---

# ROADMAP STRUCTURE

Each roadmap must include:

```
Daily problem plan
Topic learning sessions
Tutorial reading
Revision days
Mock interview days
Weekly review
```

Example roadmap output:

```
Day 1
Arrays Tutorial
Solve 3 Easy Problems

Day 2
Binary Search Tutorial
Solve 3 Problems

Day 7
Weekly Review
Mock Interview
```

---

# WEEKLY AI ROADMAP REFRESH

Every week the roadmap must adapt based on **user behaviour analytics**.

Behaviour data collected:

```
Problems solved
Topic attempts
Accuracy per topic
Average solving time
Difficulty success rate
Consistency
Skipped topics
```

---

### Weekly Refresh Algorithm

Step 1

Collect last 7 days data

Step 2

Update topic strength scores

Step 3

Detect behaviour patterns

Examples:

```
User skipping hard problems
User stuck on recursion
User improving in arrays
```

Step 4

Re-rank topic priorities

Step 5

Generate new roadmap for next week

---

### Example AI Feedback

```
Your graph accuracy is low (32%).
Average solving time is 2.8x the recommended time.
Next week your roadmap prioritizes graph problems.
```

---

# CODING PLATFORM MODULE

The system must include a **coding practice environment similar to LeetCode**.

Features:

```
Problem list
Problem difficulty
Topic tags
Company tags
Tutorial links
Code editor
Compiler execution
Test case validation
```

---

# SUPPORTED LANGUAGES

The compiler must support:

```
C++
Java
Python
```

Use an **external code execution service** or a sandboxed runner.

Options:

```
Judge0 API
Docker sandbox
Code runner service
```

Execution flow:

```
User code → Backend API → Code execution engine → Result
```

Return:

```
stdout
stderr
execution time
memory
```

---

# PROBLEM DATABASE

Each problem must contain:

```
title
description
difficulty
topic
subtopic
tutorial_link
sample_input
sample_output
test_cases
company_tags
```

Example:

```
Two Sum
Topic: Array
Difficulty: Easy
Companies: Amazon, Google
```

---

# TUTORIAL SYSTEM

Each topic must include tutorials.

Example topics:

```
Arrays
Strings
Recursion
Linked List
Stacks
Queues
Trees
Graphs
Dynamic Programming
Greedy
Backtracking
```

Each tutorial page must include:

```
Concept explanation
Code examples
Complexity analysis
Practice problems
```

---

# AI WEAKNESS DETECTION ENGINE

This engine calculates **topic strength scores**.

Metrics:

```
Accuracy = solved / attempts
Avg solving time
Difficulty success rate
```

Weakness formula:

```
WeaknessScore =
(1 - Accuracy) × Attempts × TimeFactor × CompanyWeight
```

Where

```
TimeFactor =
UserAvgTime / IdealAvgTime
```

Topic classification:

```
Weak
Average
Strong
```

---

# COMPANY INTELLIGENCE ENGINE

The system must store **company interview patterns**.

Example:

```
Amazon
Graph 0.4
DP 0.3
Array 0.2
System Design 0.1
```

Compute:

```
Company Readiness Score =
Σ (TopicStrength × CompanyWeight)
```

Example output:

```
Amazon readiness = 63%
Google readiness = 48%
```

---

# ANALYTICS DASHBOARD

The dashboard must show:

```
Topic strength radar chart
Weak topic ranking
Consistency graph
Accuracy trend
Difficulty distribution
Company readiness score
Roadmap progress
```

Use:

```
Recharts
```

---

# TECH STACK (MANDATORY)

Frontend

```
React + TypeScript
TailwindCSS
Recharts
Monaco Editor (for coding)
```

Backend

```
FastAPI
SQLAlchemy
JWT authentication
Async endpoints
```

Database

```
PostgreSQL
```

Infrastructure

```
Docker
Redis (optional caching)
```

---

# BACKEND ARCHITECTURE

```
backend/
app/
main.py
database.py

routers/
auth_router.py
problems_router.py
compiler_router.py
analytics_router.py
roadmap_router.py

models/
user.py
problem.py
submission.py
company_pattern.py
roadmap.py

services/
weakness_engine.py
roadmap_engine.py
analytics_engine.py
company_engine.py
compiler_service.py

utils/
auth_utils.py
constants.py
```

---

# FRONTEND ARCHITECTURE

```
frontend/src

pages/
Dashboard.tsx
Problems.tsx
ProblemDetail.tsx
Compiler.tsx
Roadmap.tsx
Analytics.tsx
Tutorial.tsx

components/
CodeEditor.tsx
TopicRadarChart.tsx
WeakTopicList.tsx
RoadmapCalendar.tsx
CompanyReadinessGauge.tsx

services/
api.ts
```

---

# API ENDPOINTS

Authentication

```
POST /auth/register
POST /auth/login
```

Survey

```
POST /survey/submit
```

Assessment test

```
GET /assessment/problems
POST /assessment/submit
```

Problems

```
GET /problems
GET /problems/{id}
POST /problems/submit
```

Compiler

```
POST /compiler/run
```

Roadmap

```
POST /roadmap/generate
GET /roadmap
POST /roadmap/refresh
```

Analytics

```
GET /analytics/topic-strength
GET /analytics/company-readiness
GET /analytics/progress
```

---

# DATABASE TABLES

Users

```
id
name
email
password_hash
target_company
weekly_hours
skill_level
```

Problems

```
id
title
topic
difficulty
tutorial_link
```

Submissions

```
id
user_id
problem_id
language
code
time_taken
success
```

Roadmap

```
id
user_id
day_number
topic
problem_count
tutorial
```

CompanyPatterns

```
id
company
topic
weight
```

---

# DOCKER SETUP

Containers:

```
frontend
backend
postgres
compiler
```

---

# CODE QUALITY REQUIREMENTS

The generated system must:

```
use modular architecture
use async FastAPI
include comments explaining AI logic
include seed company pattern data
include example problems
include tutorial data
```

---

# FINAL SYSTEM BEHAVIOUR

When a new user joins:

Step 1

Register

Step 2

Complete onboarding survey

Step 3

(Optional) DSA assessment

Step 4

AI generates **first 30-day roadmap**

Step 5

User practices coding

Step 6

System tracks behaviour

Step 7

Every week

```
AI refreshes roadmap
```

The platform acts as an **AI placement preparation mentor**.

---

# END GOAL

The final product must be a **working AI-powered placement preparation intelligence system** that includes:

```
coding platform
AI analytics
adaptive learning roadmap
company readiness intelligence
```

The **AI roadmap generation engine is the core MVP feature**.

---
