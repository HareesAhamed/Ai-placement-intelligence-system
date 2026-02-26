import type { TopicPerformance, CompanyWeights } from '../types';

/**
 * Calculates how ready a user is for a specific company interview.
 * Combines topic accuracy with the company's topic weightage.
 * Returns a score 0-100.
 */
export function calculateReadiness(
  userData: TopicPerformance[],
  companyWeights: CompanyWeights
): number {
  let totalScore = 0;
  let totalWeight = 0;

  userData.forEach(topic => {
    const weight = companyWeights[topic.topic] || 0;
    if (weight > 0) {
      const accuracy = topic.solved / topic.attempts;
      const timePenalty = Math.min(topic.avgTime / 60, 1); // penalize if avg > 60 min
      const topicScore = accuracy * (1 - timePenalty * 0.3); // 30% time penalty weight
      totalScore += topicScore * weight;
      totalWeight += weight;
    }
  });

  if (totalWeight === 0) return 0;
  return Math.round((totalScore / totalWeight) * 100);
}

/**
 * Calculates overall readiness across all companies
 */
export function calculateOverallReadiness(
  userData: TopicPerformance[],
  allCompanyWeights: Record<string, CompanyWeights>
): number {
  const scores = Object.values(allCompanyWeights).map(
    weights => calculateReadiness(userData, weights)
  );
  if (scores.length === 0) return 0;
  return Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
}

/**
 * Returns company-specific readiness with breakdown
 */
export function getCompanyReadinessBreakdown(
  userData: TopicPerformance[],
  allCompanyWeights: Record<string, CompanyWeights>
): { company: string; readiness: number }[] {
  return Object.entries(allCompanyWeights)
    .map(([company, weights]) => ({
      company,
      readiness: calculateReadiness(userData, weights),
    }))
    .sort((a, b) => b.readiness - a.readiness);
}
