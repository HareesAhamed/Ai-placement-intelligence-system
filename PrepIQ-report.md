# PrepIQ – AI-Based Placement Intelligence System

### Detailed MVP Architecture & System Design Report

---

# 1. Project Vision

**PrepIQ** is an AI-driven placement preparation intelligence platform that converts raw preparation activity into structured insights, analytics, and adaptive preparation roadmaps.

Unlike traditional coding platforms that only provide problems, PrepIQ acts as an **AI placement mentor** that:

* tracks preparation behaviour
* detects weak concepts
* predicts readiness
* generates structured learning roadmaps
* dynamically updates the roadmap using AI.

The platform focuses on **preparation intelligence rather than problem repositories**.

According to the project proposal, the goal is to transform placement preparation into a **measurable, optimized, and targeted system using analytics and AI modelling**. 

---

# 2. Core Problem the System Solves

Students preparing for placements often face several issues:

### 1. Unstructured Preparation

Students randomly solve coding problems without a structured plan.

### 2. No Weak Topic Detection

Most platforms do not analyze topic-wise performance.

### 3. No Company-Specific Preparation

Students cannot easily align preparation with company patterns.

### 4. False Readiness Perception

Students often believe they are prepared without real metrics.

### 5. No Behaviour Intelligence

Preparation behaviour is not analyzed.

PrepIQ solves this by building a **Performance Intelligence Engine**.

---

# 3. Key Concept of PrepIQ

PrepIQ converts **raw preparation activity → intelligent preparation guidance**.

Input Data:

* solved problems
* topic attempts
* solving time
* attempts count
* mock interview results
* coding platform data

AI Engine:

* weakness detection
* behaviour analysis
* readiness scoring
* roadmap generation

Outputs:

* weak topic insights
* readiness score
* personalized roadmap
* company-specific preparation plan

---

# 4. MVP Scope (Minimum Viable Product)

The MVP focuses on **core intelligence features** rather than building a full coding platform.

### MVP Features

1. User profile and authentication
2. Problem solving data logging
3. Weak topic detection
4. Company readiness scoring
5. AI roadmap generation
6. Analytics dashboard
7. Weekly roadmap refresh (AI feature)
8. LeetCode / GFG profile import (optional)

---

# 5. Technology Stack

### Frontend

* React with TypeScript
* Tailwind CSS
* Recharts (analytics charts)

Purpose:

* dashboard UI
* roadmap interface
* analytics visualizations

---

### Backend

* FastAPI (Python)
* REST APIs
* JWT authentication
* Pydantic validation

Purpose:

* data processing
* AI logic
* analytics computation

---

### Database

PostgreSQL

Stores:

* users
* problem logs
* roadmap data
* company patterns
* mock interview data

---

### Optional Infrastructure

* Redis for caching
* Docker for containerization
* Vercel for frontend hosting
* Render or AWS for backend

---

# 6. System Architecture

High level system flow:

```
User
   ↓
React Frontend
   ↓
FastAPI Backend
   ↓
PostgreSQL Database
   ↓
AI Intelligence Engine
   ↓
Analytics + Roadmap
```

The **AI Intelligence Engine** performs the core analytics.

---

# 7. Core Modules of PrepIQ

---

# Module 1 — Authentication System

Purpose:
manage user accounts and preparation preferences.

Features:

* JWT login
* user profile
* target company selection
* weekly preparation hours
* preparation start date

User preferences influence the roadmap generation.

---

# Module 2 — Coding Activity Tracker

This module collects **preparation behavior data**.

Each solved problem stores:

```
Problem ID
Topic
Subtopic
Difficulty
Attempts
Solved status
Time taken
Date
Platform (LC/GFG)
Company tag
```

This becomes the **training data for the intelligence engine**.

---

# Module 3 — Weak Topic Detection Engine

This is the first AI logic layer.

The system calculates **topic strength scores**.

### Metrics used

Accuracy per topic

```
Accuracy = solved / attempts
```

Average solving time

```
AvgTime(topic)
```

Difficulty performance

```
Hard problems success rate
```

---

### Weakness Score Formula

```
Weakness Score =
(1 − Accuracy) × Attempts × TimeFactor × CompanyWeight
```

Where:

TimeFactor

```
UserAvgTime / IdealAvgTime
```

CompanyWeight

```
importance of topic for selected company
```

---

### Topic Classification

Topics are classified into:

Strong
Average
Weak

The system maintains a **topic strength table**.

---

# Module 4 — Company Intelligence Engine

PrepIQ stores **company interview patterns**.

Example:

Amazon:

```
Graph        0.4
DynamicProg  0.3
Array        0.2
SystemDesign 0.1
```

Company readiness score:

```
CompanyScore =
Σ (TopicStrength × CompanyWeight)
```

Example output:

```
Amazon readiness: 63%
Google readiness: 48%
```

This gives **real placement readiness insights**.

---

# Module 5 — Roadmap Generation Engine

This module generates **30-day preparation plans**.

Inputs:

* weak topics
* company importance
* user availability
* difficulty balance

Algorithm:

1. rank topics by weakness
2. prioritize company important topics
3. distribute problems daily
4. insert revision days
5. schedule mock interviews

Example roadmap:

Day 1
Arrays (3 problems)
Recursion (2 problems)

Day 2
Binary Search (3 problems)

Day 7
Mock Interview

---

# 8. Weekly AI Roadmap Refresh Feature

This is the **most important AI feature you wanted**.

The roadmap should not remain static.

Instead it should adapt based on **user behaviour data**.

---

# Behaviour Data Collected

Every week the system analyzes:

```
problems solved
accuracy
topic attempts
average time
consistency
difficulty success rate
```

---

# Weekly AI Refresh Process

Step 1
Collect last 7 days preparation data.

Step 2
Recalculate topic strength.

Step 3
Detect learning trends.

Example:

```
DP accuracy improved from 30% → 60%
Graphs stagnated at 20%
```

Step 4
Detect behaviour patterns.

Examples:

```
User skipping hard problems
User inconsistent practice
User stuck on same topic
```

Step 5
Update roadmap priorities.

---

# Adaptive Roadmap Logic

Example scenario:

Original roadmap:

```
Week 2 focus
DP
Graphs
Greedy
```

AI behaviour analysis:

```
DP improved
Graphs weak
User slow in recursion
```

New roadmap:

```
Week 2 focus
Graphs
Recursion
Graph practice mock
```

---

# AI Feedback Generated

PrepIQ AI can output feedback like:

```
Your graph problem solving accuracy is low.
You spent 3x more time than average.
Next week roadmap prioritizes graph algorithms.
```

---

# 9. Analytics Dashboard

The dashboard displays preparation intelligence.

Visualizations include:

Topic strength radar chart

Weak topic ranking

Preparation consistency graph

Accuracy trend line

Difficulty distribution

Company readiness gauge

---

# 10. Database Schema

Users

```
id
name
email
password
target_company
weekly_hours
created_at
```

Problems

```
id
user_id
topic
difficulty
attempts
solved
time_taken
date
```

CompanyPatterns

```
id
company
topic
weight
```

MockInterviews

```
id
user_id
date
score
feedback
```

Roadmap

```
id
user_id
day_number
topic
problem_count
```

---

# 11. AI / ML Future Improvements

Currently MVP uses **rule-based intelligence**.

Future AI upgrades:

### ML Readiness Prediction

Model predicts placement success probability.

Possible models:

* Logistic Regression
* Random Forest

---

### Performance Clustering

Cluster students into groups:

Beginner
Intermediate
Interview Ready

---

### Time Series Forecasting

Predict performance improvement trends.

Possible models:

* ARIMA
* LSTM

---

### Reinforcement Learning Roadmap

AI learns which roadmap works best.

---

# 12. Deployment Architecture

Frontend

```
Vercel
```

Backend

```
Render
Railway
AWS EC2
```

Database

```
Supabase PostgreSQL
NeonDB
```

Docker setup

```
frontend container
backend container
database container
```

---

# 13. Why PrepIQ Is a Strong Project

PrepIQ combines multiple modern technologies:

* Full-stack development
* AI analytics
* data engineering
* recommendation systems
* behavioural modelling

This makes it stronger than a normal coding platform.

It is effectively:

* a learning analytics system
* a preparation intelligence engine
* an AI recommendation platform

---

# 14. Final System Definition

PrepIQ is an **AI-powered placement preparation intelligence platform** that analyzes coding preparation behavior and generates adaptive learning roadmaps to improve interview readiness.

It transforms preparation into:

* measurable progress
* personalized strategy
* company-aligned preparation

Which aligns with the project’s goal of **turning preparation data into actionable intelligence**. 

---
