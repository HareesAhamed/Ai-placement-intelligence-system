from __future__ import annotations

from collections import defaultdict

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.models.company_pattern import CompanyPattern
from app.services.weakness_engine import TopicWeakness


class CompanyEngine:
    def get_company_weights(self, db: Session, companies: list[str]) -> dict[str, float]:
        if not companies:
            return {}

        rows = list(
            db.scalars(
                select(CompanyPattern).where(CompanyPattern.company.in_(companies))
            ).all()
        )
        aggregate: dict[str, float] = defaultdict(float)
        for row in rows:
            aggregate[row.topic] += row.weight
        return dict(aggregate)

    def readiness_by_company(self, db: Session, topic_strength: list[TopicWeakness]) -> dict[str, float]:
        all_patterns = list(db.scalars(select(CompanyPattern)).all())
        if not all_patterns:
            return {}

        topic_strength_map = {item.topic: max(0.0, 100.0 - item.weakness_score * 10) for item in topic_strength}

        grouped: dict[str, list[CompanyPattern]] = defaultdict(list)
        for pattern in all_patterns:
            grouped[pattern.company].append(pattern)

        readiness: dict[str, float] = {}
        for company, patterns in grouped.items():
            score = 0.0
            total_weight = 0.0
            for pattern in patterns:
                total_weight += pattern.weight
                score += topic_strength_map.get(pattern.topic, 50.0) * pattern.weight
            readiness[company] = round((score / total_weight) if total_weight else 0.0, 2)

        return readiness


company_engine = CompanyEngine()
