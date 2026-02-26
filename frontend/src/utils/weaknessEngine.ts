import type { TopicPerformance, WeaknessResult } from '../types';

/**
 * Calculates a weakness score for a given topic.
 * Higher score = weaker in that topic.
 * Factors: accuracy (inverted), time penalty, attempt volume
 */
export function calculateWeakness(topicData: TopicPerformance): number {
  const accuracy = topicData.solved / topicData.attempts;
  const timeFactor = topicData.avgTime / 30; // 30 min baseline
  const volumeFactor = Math.log2(topicData.attempts + 1) / 4; // normalize attempt volume

  return parseFloat(((1 - accuracy) * timeFactor * (1 + volumeFactor) * 10).toFixed(2));
}

/**
 * Classifies a weakness score into Strong / Average / Weak
 */
export function classifyStrength(score: number): 'Weak' | 'Average' | 'Strong' {
  if (score > 5) return 'Weak';
  if (score > 2) return 'Average';
  return 'Strong';
}

/**
 * Analyzes all topics and returns sorted weakness results (weakest first)
 */
export function analyzeWeaknesses(performanceData: TopicPerformance[]): WeaknessResult[] {
  return performanceData
    .map(topic => {
      const score = calculateWeakness(topic);
      return {
        topic: topic.topic,
        score,
        classification: classifyStrength(score),
        accuracy: parseFloat((topic.solved / topic.attempts * 100).toFixed(1)),
      };
    })
    .sort((a, b) => b.score - a.score);
}

/**
 * Returns the top N weakest topics
 */
export function getWeakTopics(performanceData: TopicPerformance[], n: number = 3): string[] {
  return analyzeWeaknesses(performanceData)
    .filter(w => w.classification === 'Weak')
    .slice(0, n)
    .map(w => w.topic);
}
