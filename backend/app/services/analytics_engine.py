from __future__ import annotations

from collections import defaultdict
from datetime import date, timedelta

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.problem import Problem
from app.models.roadmap import RoadmapPlan
from app.models.submission import Submission
from app.services.company_engine import company_engine
from app.services.weakness_engine import weakness_engine


class AnalyticsEngine:
    def topic_strength(self, db: Session, user_id: int, target_companies: list[str]) -> list[dict[str, object]]:
        company_weights = company_engine.get_company_weights(db, target_companies)
        weakness = weakness_engine.compute_topic_weakness(db, user_id, company_weights)
        return [
            {
                "topic": item.topic,
                "attempts": item.attempts,
                "accuracy": item.accuracy,
                "avg_runtime_ms": item.avg_runtime_ms,
                "weakness_score": item.weakness_score,
                "classification": item.classification,
            }
            for item in weakness
        ]

    def progress(self, db: Session, user_id: int) -> dict[str, object]:
        plan = db.scalar(
            select(RoadmapPlan)
            .where(RoadmapPlan.user_id == user_id, RoadmapPlan.is_active.is_(True))
            .order_by(RoadmapPlan.created_at.desc())
        )
        completion = 0.0
        if plan and plan.days:
            total = len(plan.days)
            completed = sum(1 for day in plan.days if day.is_completed)
            completion = round((completed / total) * 100, 2)

        submissions = list(db.scalars(select(Submission).where(Submission.user_id == user_id)).all())
        by_day: dict[str, int] = defaultdict(int)
        accepted = 0
        for sub in submissions:
            if sub.created_at:
                by_day[str(sub.created_at.date())] += 1
            if sub.status == "Accepted":
                accepted += 1

        total_attempts = len(submissions)
        accuracy = round((accepted / total_attempts) * 100, 2) if total_attempts else 0.0

        last_7 = [date.today() - timedelta(days=i) for i in range(6, -1, -1)]
        consistency_points = [{"date": str(day), "attempts": by_day.get(str(day), 0)} for day in last_7]

        return {
            "roadmap_completion": completion,
            "accuracy": accuracy,
            "attempt_count": total_attempts,
            "consistency": consistency_points,
        }

    def difficulty_distribution(self, db: Session, user_id: int) -> dict[str, int]:
        submissions = list(db.scalars(select(Submission).where(Submission.user_id == user_id)).all())
        diff_count: dict[str, int] = defaultdict(int)
        for sub in submissions:
            problem = db.get(Problem, sub.problem_id)
            if not problem:
                continue
            diff_count[problem.difficulty] += 1
        return dict(diff_count)


analytics_engine = AnalyticsEngine()
