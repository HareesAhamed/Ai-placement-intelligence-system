from __future__ import annotations

from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.orm import Session

from app.models.onboarding import OnboardingSurvey
from app.models.problem import Problem
from app.models.roadmap import RoadmapDay, RoadmapPlan
from app.models.user import User
from app.services.company_engine import company_engine
from app.services.weakness_engine import weakness_engine

DEFAULT_TOPICS = [
    "Arrays",
    "Strings",
    "Recursion",
    "Hashing",
    "Binary Search",
    "Linked List",
    "Stacks",
    "Queues",
    "Trees",
    "Graphs",
    "Dynamic Programming",
    "Greedy",
    "Backtracking",
]


class RoadmapEngine:
    def _topic_cycle(self, weak_topics: list[str]) -> list[str]:
        seen: set[str] = set()
        ordered: list[str] = []
        for topic in [*weak_topics, *DEFAULT_TOPICS]:
            if topic in seen:
                continue
            seen.add(topic)
            ordered.append(topic)
        return ordered

    def _build_day(self, day_number: int, topic: str, weekly_hours: int) -> dict[str, object]:
        week_day = ((day_number - 1) % 7) + 1
        if week_day == 7:
            return {
                "task_type": "weekly-review",
                "topic": "Weekly Review",
                "problems_count": 0,
                "estimated_minutes": 60,
                "tutorial_title": "Weekly Review + Mock Interview",
            }

        problems_count = 2 if weekly_hours <= 8 else 3
        if week_day in {3, 6} and weekly_hours >= 12:
            problems_count = 4

        return {
            "task_type": "practice",
            "topic": topic,
            "problems_count": problems_count,
            "estimated_minutes": 90,
            "tutorial_title": f"{topic} Tutorial",
        }

    def generate_initial_roadmap(self, db: Session, user: User) -> RoadmapPlan:
        survey = db.scalar(select(OnboardingSurvey).where(OnboardingSurvey.user_id == user.id))
        if not survey:
            raise ValueError("Survey must be submitted before generating roadmap")

        company_weights = company_engine.get_company_weights(db, survey.target_companies)
        weakness = weakness_engine.compute_topic_weakness(db, user.id, company_weights)
        weak_topics = [item.topic for item in weakness[:6]]
        topic_cycle = self._topic_cycle(weak_topics)

        existing_plans = list(
            db.scalars(select(RoadmapPlan).where(RoadmapPlan.user_id == user.id, RoadmapPlan.is_active.is_(True))).all()
        )
        for plan in existing_plans:
            plan.is_active = False

        plan = RoadmapPlan(
            user_id=user.id,
            start_date=date.today(),
            week_number=1,
            is_active=True,
            generated_reason="initial",
            ai_feedback="Roadmap generated from your survey, current behavior, and company focus.",
        )
        db.add(plan)
        db.flush()

        for day in range(1, 31):
            topic = topic_cycle[(day - 1) % len(topic_cycle)]
            spec = self._build_day(day, topic, survey.weekly_study_hours)
            tutorial_link = self._pick_tutorial_link(db, topic)
            db.add(
                RoadmapDay(
                    plan_id=plan.id,
                    day_number=day,
                    week_number=((day - 1) // 7) + 1,
                    topic=str(spec["topic"]),
                    problems_count=int(spec["problems_count"]),
                    tutorial_title=str(spec["tutorial_title"]),
                    tutorial_link=tutorial_link,
                    estimated_minutes=int(spec["estimated_minutes"]),
                    task_type=str(spec["task_type"]),
                )
            )

        db.commit()
        db.refresh(plan)
        return plan

    def refresh_weekly(self, db: Session, user: User) -> tuple[RoadmapPlan, list[str]]:
        survey = db.scalar(select(OnboardingSurvey).where(OnboardingSurvey.user_id == user.id))
        if not survey:
            raise ValueError("Survey must be submitted before refreshing roadmap")

        company_weights = company_engine.get_company_weights(db, survey.target_companies)
        weakness = weakness_engine.compute_topic_weakness(db, user.id, company_weights)
        insights = weakness_engine.detect_behavior_patterns(weakness)

        plan = self.generate_initial_roadmap(db, user)
        plan.generated_reason = "weekly-refresh"
        plan.ai_feedback = " ".join(insights)
        db.commit()
        db.refresh(plan)
        return plan, insights

    def mark_day_complete(self, db: Session, user_id: int, day_id: int) -> RoadmapDay:
        day = db.get(RoadmapDay, day_id)
        if not day:
            raise ValueError("Roadmap day not found")

        plan = db.get(RoadmapPlan, day.plan_id)
        if not plan or plan.user_id != user_id:
            raise ValueError("Roadmap day not found")

        day.is_completed = True
        db.commit()
        db.refresh(day)
        return day

    def get_active_plan(self, db: Session, user_id: int) -> RoadmapPlan | None:
        return db.scalar(
            select(RoadmapPlan)
            .options(selectinload(RoadmapPlan.days))
            .where(RoadmapPlan.user_id == user_id, RoadmapPlan.is_active.is_(True))
            .order_by(RoadmapPlan.created_at.desc())
        )

    def _pick_tutorial_link(self, db: Session, topic: str) -> str | None:
        candidate = db.scalar(select(Problem.tutorial_link).where(Problem.topic == topic, Problem.tutorial_link.is_not(None)))
        return candidate


roadmap_engine = RoadmapEngine()
