import type { RoadmapDay } from '../types';

/**
 * Generates a 30-day personalized roadmap based on weak topics.
 * Every 7th day is a mock interview.
 * Weak topics get more problem allocation.
 */
export function generateRoadmap(sortedWeakTopics: string[]): RoadmapDay[] {
  if (sortedWeakTopics.length === 0) {
    sortedWeakTopics = ['Array', 'DP', 'Graph'];
  }

  const roadmap: RoadmapDay[] = [];
  const completedDays: number[] = JSON.parse(
    localStorage.getItem('prepiq_completed_days') || '[]'
  );

  for (let i = 1; i <= 30; i++) {
    const isMock = i % 7 === 0;

    if (isMock) {
      roadmap.push({
        day: i,
        topic: 'Mock Interview',
        problems: 5,
        isMockInterview: true,
        completed: completedDays.includes(i),
      });
    } else {
      // Distribute topics with bias toward weakest
      const topicIndex = (i - 1) % sortedWeakTopics.length;
      const topic = sortedWeakTopics[topicIndex];

      // More problems for weaker topics (first in sorted list = weakest)
      const problemCount = topicIndex < 2 ? 4 : 3;

      roadmap.push({
        day: i,
        topic,
        problems: problemCount,
        isMockInterview: false,
        completed: completedDays.includes(i),
      });
    }
  }

  return roadmap;
}

/**
 * Marks a day as complete and persists to localStorage
 */
export function markDayComplete(day: number): number[] {
  const completed: number[] = JSON.parse(
    localStorage.getItem('prepiq_completed_days') || '[]'
  );
  if (!completed.includes(day)) {
    completed.push(day);
    localStorage.setItem('prepiq_completed_days', JSON.stringify(completed));
  }
  return completed;
}

/**
 * Returns roadmap progress percentage
 */
export function getRoadmapProgress(roadmap: RoadmapDay[]): number {
  const completed = roadmap.filter(d => d.completed).length;
  return Math.round((completed / roadmap.length) * 100);
}

/**
 * Returns topic-wise progress from roadmap
 */
export function getTopicProgress(roadmap: RoadmapDay[]): { topic: string; total: number; completed: number; percentage: number }[] {
  const topicMap = new Map<string, { total: number; completed: number }>();

  roadmap.forEach(day => {
    const existing = topicMap.get(day.topic) || { total: 0, completed: 0 };
    existing.total++;
    if (day.completed) existing.completed++;
    topicMap.set(day.topic, existing);
  });

  return Array.from(topicMap.entries()).map(([topic, data]) => ({
    topic,
    total: data.total,
    completed: data.completed,
    percentage: Math.round((data.completed / data.total) * 100),
  }));
}
