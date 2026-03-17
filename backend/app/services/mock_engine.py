from __future__ import annotations

from datetime import datetime, timezone

from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.models.problem import Problem
from app.models.submission import Submission


class MockEngine:
    def compute_metrics(
        self,
        db: Session,
        user_id: int,
        started_at: datetime,
        question_ids: list[int],
    ) -> dict[str, object]:
        accepted_submissions = list(
            db.scalars(
                select(Submission)
                .where(
                    and_(
                        Submission.user_id == user_id,
                        Submission.problem_id.in_(question_ids),
                        Submission.status == "Accepted",
                        Submission.created_at >= started_at,
                    )
                )
                .order_by(Submission.created_at.asc())
            ).all()
        )

        solved_ids = {submission.problem_id for submission in accepted_submissions}
        total = len(question_ids)
        solved_count = len(solved_ids)
        accuracy = round((solved_count / total) * 100, 2) if total else 0.0
        score = int(round(accuracy))

        topics: list[str] = []
        for pid in question_ids:
            problem = db.get(Problem, pid)
            if problem and problem.topic not in topics:
                topics.append(problem.topic)

        now = datetime.now(timezone.utc)
        start_value = started_at.replace(tzinfo=timezone.utc) if started_at.tzinfo is None else started_at
        time_taken_minutes = max(1, int((now - start_value).total_seconds() // 60))
        per_problem_time = {
            str(pid): round((time_taken_minutes * 60) / max(1, total), 2)
            for pid in question_ids
        }

        return {
            "score": score,
            "accuracy": accuracy,
            "solved_count": solved_count,
            "total_questions": total,
            "time_taken_minutes": time_taken_minutes,
            "completion_percent": round((solved_count / max(1, total)) * 100, 2),
            "topics": topics,
            "problem_ids": question_ids,
            "per_problem_time": per_problem_time,
        }


mock_engine = MockEngine()
