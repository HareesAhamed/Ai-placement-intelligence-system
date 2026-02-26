# 🧠 AI-Based Placement Intelligence System

## Frontend Prototype Implementation Report

---

# 1️⃣ Prototype Objective

Build a **fully functional frontend prototype** that:

* Simulates AI-driven placement analytics
* Tracks DSA performance
* Generates roadmap
* Provides mock test simulation
* Displays analytics dashboards

⚠️ No real backend
⚠️ No real ML
⚠️ Mock data + simulated logic

The goal is to demonstrate:

* Product concept
* Intelligence layer simulation
* Strong UI/UX
* Full flow usability

---

# 2️⃣ Tech Stack (Prototype Version)

## Core

* React 18
* TypeScript
* Tailwind CSS
* React Router DOM

## Visualization

* Recharts (Charts)
* Lucide React (Icons)

## State Management

* useState
* useEffect
* LocalStorage

## Optional (Premium Feel)

* Framer Motion (Animations)
* clsx (Conditional classes)

---

# 3️⃣ Project Structure

```
src/
 ├── components/
 │    ├── layout/
 │    │    ├── Sidebar.tsx
 │    │    ├── Navbar.tsx
 │    │
 │    ├── dashboard/
 │    ├── roadmap/
 │    ├── mocktest/
 │    ├── analytics/
 │    ├── problems/
 │
 ├── pages/
 │    ├── Dashboard.tsx
 │    ├── Roadmap.tsx
 │    ├── MockTest.tsx
 │    ├── Problems.tsx
 │    ├── Analytics.tsx
 │
 ├── data/
 │    ├── mockUserData.ts
 │    ├── companyPatterns.ts
 │
 ├── utils/
 │    ├── weaknessEngine.ts
 │    ├── readinessEngine.ts
 │    ├── roadmapEngine.ts
 │
 ├── types/
 │    ├── index.ts
 │
 ├── App.tsx
 └── main.tsx
```

---

# 4️⃣ Mock Data Layer (Simulated Backend)

Create static user data.

### mockUserData.ts

```ts
export const userPerformance = [
  { topic: "Array", attempts: 20, solved: 15, avgTime: 25 },
  { topic: "DP", attempts: 15, solved: 5, avgTime: 50 },
  { topic: "Graph", attempts: 10, solved: 3, avgTime: 60 },
  { topic: "Tree", attempts: 12, solved: 8, avgTime: 35 }
];
```

---

### companyPatterns.ts

```ts
export const companyPatterns = {
  Amazon: {
    Array: 0.2,
    DP: 0.3,
    Graph: 0.4,
    Tree: 0.1
  }
};
```

---

# 5️⃣ Intelligence Simulation Layer

This is the most important part.

We simulate AI.

---

# 5.1 Weakness Engine

### weaknessEngine.ts

```ts
export function calculateWeakness(topicData: any) {
  const accuracy = topicData.solved / topicData.attempts;
  const timeFactor = topicData.avgTime / 30;

  return (1 - accuracy) * topicData.attempts * timeFactor;
}
```

Classification:

```ts
export function classify(score: number) {
  if (score > 5) return "Weak";
  if (score > 2) return "Average";
  return "Strong";
}
```

This creates intelligent-feeling output.

---

# 5.2 Company Readiness Engine

```ts
export function calculateReadiness(
  userData: any[],
  companyWeights: any
) {
  let totalScore = 0;

  userData.forEach(topic => {
    const accuracy = topic.solved / topic.attempts;
    const weight = companyWeights[topic.topic] || 0;

    totalScore += accuracy * weight;
  });

  return Math.round(totalScore * 100);
}
```

---

# 5.3 Roadmap Generator (Mock AI Planning)

```ts
export function generateRoadmap(sortedWeakTopics: string[]) {
  const roadmap = [];

  for (let i = 1; i <= 30; i++) {
    roadmap.push({
      day: i,
      topic: sortedWeakTopics[i % sortedWeakTopics.length],
      problems: 3
    });
  }

  return roadmap;
}
```

Add mock every 7th day:

```ts
if (i % 7 === 0) {
  roadmap.push({ day: i, topic: "Mock Interview" });
}
```

---

# 6️⃣ Page-by-Page Prototype Implementation

---

# 🏠 Dashboard Page

### Displays:

* AI Readiness Score
* Radar Chart (Topic strength)
* Weak topics list
* Trend line chart

### Data Flow:

```
Mock Data → Weakness Engine → Classification → UI Cards
```

Use Recharts:

* RadarChart
* LineChart
* BarChart

---

# 📘 Problems Page

### Features:

* Static problem list
* Add new solved problem
* Update localStorage

Mock function:

```ts
function saveProblem(problem) {
  const existing = JSON.parse(localStorage.getItem("problems") || "[]");
  localStorage.setItem("problems", JSON.stringify([...existing, problem]));
}
```

Add confidence slider.

After submit:

Show mock AI feedback:

```ts
function generateFeedback(time, avgTime) {
  if (time > avgTime)
    return "You are slower than average. Revise pattern recognition.";
  return "Good performance. Maintain speed.";
}
```

---

# 🗺️ Roadmap Page

* Show progress bars
* Display generated roadmap
* Mark day complete

Use state:

```ts
const [completedDays, setCompletedDays] = useState<number[]>([]);
```

---

# 🎯 Mock Test Page

Simulate test start.

```ts
function startMockTest() {
  setTimeout(() => {
    setScore(Math.floor(Math.random() * 100));
  }, 2000);
}
```

After completion:

Show AI comment:

* “Strong in Array”
* “Weak in Graph transitions”

---

# 📊 Analytics Page

Show:

* Topic Heatmap (manual color grid)
* Weakness ranking
* Company-wise donut charts

---

# 7️⃣ State Management Strategy

Use simple approach:

* useState for page state
* useEffect for recalculations
* localStorage for persistence

No Redux required for prototype.

---

# 8️⃣ UI/UX Implementation Strategy

## Tailwind Patterns

Cards:

```css
bg-[#111827] rounded-xl p-6 border border-[#1F2937]
```

Glow active:

```css
shadow-lg shadow-blue-500/20
```

---

## Reusable Components

Create:

* Card.tsx
* ProgressBar.tsx
* ScoreRing.tsx
* TopicBadge.tsx

---

# 9️⃣ Prototype Flow Simulation

### User Journey

1. User opens Dashboard
2. Sees readiness score
3. Goes to Problems
4. Logs solved problem
5. Dashboard updates
6. Roadmap regenerates
7. Takes mock test
8. Analytics updates

Even though data is mocked — it feels real.

---

# 🔟 What Makes Prototype Look Real

* Real formula logic
* Dynamic charts
* Conditional styling
* AI-style feedback messages
* Roadmap auto-generation

---

# 1️⃣1️⃣ Limitations (Prototype Round)

* No authentication
* No real DB
* No ML model
* No backend validation
* Random mock test score

But for demo — fully sufficient.

---

# 1️⃣2️⃣ Future Upgrade Plan

After prototype:

* Add FastAPI backend
* PostgreSQL
* Real user auth
* Replace mock engines with ML models
* Add LeetCode API sync

---

# 🎯 Final Prototype Goal

You are not building a coding platform.

You are building:

> A Placement Intelligence Simulation Engine

That’s powerful for:

* Hackathon
* Resume
* Internship interviews
* Product demo

---


