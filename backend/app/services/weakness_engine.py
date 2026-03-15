from __future__ import annotations

from collections import defaultdict
from dataclasses import dataclass

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.problem import Problem
from app.models.submission import Submission

IDEAL_TOPIC_RUNTIME_MS = 1200


@dataclass
class TopicWeakness:
    topic: str
    attempts: int
    accuracy: float
    avg_runtime_ms: float
    weakness_score: float
    classification: str


class WeaknessEngine:
    def compute_topic_weakness(
        self,
        db: Session,
        user_id: int,
        company_weights: dict[str, float] | None = None,
    ) -> list[TopicWeakness]:
        company_weights = company_weights or {}
        submissions = list(db.scalars(select(Submission).where(Submission.user_id == user_id)).all())
        topic_stats: dict[str, dict[str, float]] = defaultdict(lambda: {"attempts": 0, "accepted": 0, "runtime_total": 0.0, "runtime_count": 0})

        for sub in submissions:
            problem = db.get(Problem, sub.problem_id)
            if not problem:
                continue
            topic = problem.topic
            topic_stats[topic]["attempts"] += 1
            if sub.status == "Accepted":
                topic_stats[topic]["accepted"] += 1
            if sub.runtime_ms is not None:
                topic_stats[topic]["runtime_total"] += float(sub.runtime_ms)
                topic_stats[topic]["runtime_count"] += 1

        results: list[TopicWeakness] = []
        for topic, stats in topic_stats.items():
            attempts = int(stats["attempts"])
            accepted = stats["accepted"]
            accuracy = (accepted / attempts) if attempts else 0.0
            avg_runtime_ms = (stats["runtime_total"] / stats["runtime_count"]) if stats["runtime_count"] else float(IDEAL_TOPIC_RUNTIME_MS)
            time_factor = max(0.5, avg_runtime_ms / IDEAL_TOPIC_RUNTIME_MS)
            company_weight = company_weights.get(topic, 1.0)

            # Core weakness formula for roadmap prioritization.
            weakness_score = (1 - accuracy) * attempts * time_factor * company_weight

            classification = "strong"
            if weakness_score >= 3:
                classification = "weak"
            elif weakness_score >= 1.5:
                classification = "average"

            results.append(
                TopicWeakness(
                    topic=topic,
                    attempts=attempts,
                    accuracy=round(accuracy * 100, 2),
                    avg_runtime_ms=round(avg_runtime_ms, 2),
                    weakness_score=round(weakness_score, 3),
                    classification=classification,
                )
            )

        results.sort(key=lambda item: item.weakness_score, reverse=True)
        return results

    def detect_behavior_patterns(self, weakness: list[TopicWeakness]) -> list[str]:
        insights: list[str] = []
        weak_topics = [item for item in weakness if item.classification == "weak"]
        if weak_topics:
            top = weak_topics[0]
            insights.append(f"You need extra focus on {top.topic} (accuracy {top.accuracy}%).")

        slower_topics = [item for item in weakness if item.avg_runtime_ms > IDEAL_TOPIC_RUNTIME_MS * 2]
        if slower_topics:
            insights.append(f"Solving speed is slow in {slower_topics[0].topic}; prioritize timed practice.")

        if not insights:
            insights.append("Performance is stable. Increase medium/hard question volume for growth.")

        return insights


weakness_engine = WeaknessEngine()
