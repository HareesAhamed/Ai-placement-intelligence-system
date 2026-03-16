# PrepIQ — Complete MVP Feature Architecture

## AI-Based Placement Intelligence System

PrepIQ is an **AI-driven preparation intelligence platform** that combines:

* coding practice
* structured learning
* behavior analytics
* AI roadmap generation

The system transforms **preparation behavior → intelligent preparation strategy**.

The **core MVP pillar** is:

> AI Roadmap Generation + Adaptive Preparation System

---

# 1. Global Platform Architecture

High-level system layers:

```
Frontend (React + TS)
        ↓
API Layer (FastAPI)
        ↓
Intelligence Engine
        ↓
Database (PostgreSQL)
        ↓
Code Execution Engine
```

Core engines:

```
Roadmap Engine
Weakness Detection Engine
Behavior Analytics Engine
Company Intelligence Engine
```

---

# 2. Complete Page Architecture

PrepIQ MVP contains **8 main product pages**.

```
1. Landing
2. Onboarding
3. Dashboard
4. Roadmap
5. Problems
6. Tutorials
7. Analytics
8. Profile
```

Each page contributes data to the **AI roadmap system**.

---

# 3. Landing Page (Product Entry)

Purpose:

Explain the platform and push users to onboarding.

Sections:

```
Hero
Platform concept
Key features
Demo screenshots
Start preparation CTA
```

Core message:

```
PrepIQ = AI Placement Preparation OS
```

Avoid typical AI landing page gradients.

Design inspiration:

Developer platforms like **Vercel**.

---

# 4. Onboarding System (Roadmap Initialization)

This page collects **initial training data for AI roadmap generation**.

Flow:

```
Welcome
↓
Preparation Survey
↓
Learning Preferences
↓
Optional DSA Assessment
↓
Roadmap Generation
```

---

## Onboarding Survey Data

Collected fields:

```
Current academic year
DSA experience level
Target companies
Weekly preparation hours
Preferred programming language
Preparation timeline
```

Example:

```
Year: 3rd
Level: Beginner
Company: Amazon
Hours/week: 12
Timeline: 4 months
```

---

## Optional Assessment Test

Purpose:

Improve initial roadmap accuracy.

Test structure:

```
5 Easy Problems
3 Medium Problems
1 Hard Problem
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
Accuracy
Time taken
Attempts
Difficulty success rate
```

These metrics become the **initial topic strength scores**.

---

# 5. AI Roadmap Page (Core Product)

This is the **central page of PrepIQ**.

The roadmap represents a **structured preparation schedule**.

Example:

```
Week 1
Day 1
Arrays tutorial
3 problems

Day 2
Binary search tutorial
3 problems

Day 7
Mock interview
Weekly review
```

Each roadmap item contains:

```
Topic
Problem count
Tutorial
Estimated time
Completion status
```

Status types:

```
Pending
In Progress
Completed
```

---

# 6. Problems Platform (Coding Practice)

The problem page acts as the **practice environment**.

Inspired by:

* **LeetCode**
* **HackerRank**

---

## Problem Explorer

Table view:

```
Status
Title
Difficulty
Topic
Companies
Acceptance rate
```

Filters:

```
Topic
Difficulty
Company
Solved status
Roadmap problems
```

---

## Problem Detail Page

Layout:

```
| Problem Description | Code Editor |
```

Left panel:

```
Problem statement
Examples
Constraints
Hints
Tutorial link
```

Right panel:

```
Code editor
Language selector
Run code
Submit solution
```

Languages supported:

```
C++
Java
Python
```

Editor:

```
Monaco Editor
```

Execution engine options:

```
Judge0
Docker sandbox
Custom runner
```

---

# 7. Tutorial Platform

Tutorial pages support **structured learning**.

Inspired by **TakeUForward**.

Topics included:

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

## Tutorial Page Layout

Structure:

```
Topic introduction
Concept explanation
Code examples
Complexity analysis
Common mistakes
Practice problems
```

Each tutorial links to:

```
Beginner problems
Intermediate problems
Interview problems
```

Roadmap indicator:

```
Roadmap Day 6
Binary Search Tutorial
```

---

# 8. Dashboard (Preparation Command Center)

Dashboard shows **high-level preparation insights**.

Widgets:

```
Topic strength radar chart
Weak topic list
Company readiness score
Weekly progress
Consistency chart
Difficulty distribution
```

Charts built with:

```
Recharts
```

---

# 9. Analytics Page (Performance Intelligence)

This page visualizes **deep preparation analytics**.

Metrics displayed:

```
Topic accuracy
Attempt frequency
Time trends
Difficulty distribution
Learning consistency
Weak topic ranking
```

Charts include:

```
Radar chart
Line chart
Heatmap calendar
Bar chart
```

---

# 10. Profile Page

The profile page acts as a **developer progress portfolio**.

Inspired by:

* **GitHub**
* **LeetCode**

Sections:

```
User info
Preparation stats
Topic mastery
Company readiness
Activity calendar
```

---

## Profile Statistics

Display:

```
Problems solved
Accuracy
Average solving time
Current streak
Hard problems solved
```

Topic mastery radar chart:

```
Array
DP
Graph
Tree
Greedy
Recursion
```

---

# 11. AI Intelligence Engine

PrepIQ includes **four AI modules**.

---

## Weakness Detection Engine

Calculates topic strength.

Metrics:

```
Accuracy
Attempts
Average time
Difficulty success
```

Weakness formula:

```
Weakness Score =
(1 - Accuracy) × Attempts × TimeFactor × CompanyWeight
```

---

## Company Intelligence Engine

Stores company interview patterns.

Example:

```
Amazon
Graph 0.4
DP 0.3
Array 0.2
System Design 0.1
```

Company readiness score:

```
CompanyScore =
Σ (TopicStrength × CompanyWeight)
```

---

## Roadmap Generation Engine

Inputs:

```
Weak topics
Company priorities
Weekly study hours
Difficulty balance
```

Output:

```
30-day roadmap
```

Algorithm:

```
Rank topics by weakness
Prioritize company topics
Allocate daily problems
Insert revision days
Insert mock interviews
```

---

## Weekly Roadmap Refresh Engine

Every 7 days the system:

1 collects preparation behavior

```
problems solved
accuracy change
time trends
topic attempts
```

2 detects learning patterns

Examples:

```
User improving in arrays
User stuck in graphs
User avoiding hard problems
```

3 updates topic scores

4 regenerates roadmap for next week

---

# 12. Core Data Flow

Complete learning loop:

```
User solves problem
        ↓
Performance data stored
        ↓
Weakness engine updates topic strength
        ↓
Analytics engine updates dashboard
        ↓
Roadmap engine updates preparation plan
```

This creates a **self-improving preparation system**.

---

# 13. MVP Feature Summary

PrepIQ MVP must include:

```
Onboarding survey
Optional DSA assessment
AI roadmap generation
Coding platform with compiler
Tutorial system
Preparation analytics
Company readiness scoring
Weekly roadmap refresh
```

---

# Final Product Definition

PrepIQ becomes:

```
LeetCode + TUF+ + AI preparation coach
```

A system that turns **coding practice into structured preparation intelligence**.

---
