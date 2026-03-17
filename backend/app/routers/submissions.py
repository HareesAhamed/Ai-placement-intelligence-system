from collections import defaultdict

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.analytics import UserAnalytics
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.schemas.analytics import AnalyticsSummary
from app.schemas.submission import SubmissionCreate, SubmissionRead, SubmissionResult
from app.services.analysis_engine import analysis_engine
from app.services.roadmap_engine import roadmap_engine
from app.services.testcase_runner import testcase_runner

router = APIRouter()


def _recompute_analytics(db: Session, user_id: int) -> UserAnalytics:
    all_submissions = list(db.scalars(select(Submission).where(Submission.user_id == user_id)).all())
    attempts = len(all_submissions)
    accepted = sum(1 for s in all_submissions if s.status == "Accepted")
    accuracy = (accepted / attempts) * 100 if attempts else 0

    runtime_values = [s.runtime_ms for s in all_submissions if s.runtime_ms is not None]
    avg_runtime = sum(runtime_values) / len(runtime_values) if runtime_values else 0

    topic_count = defaultdict(lambda: {"attempts": 0, "accepted": 0})
    diff_count = defaultdict(int)

    for sub in all_submissions:
        problem = db.get(Problem, sub.problem_id)
        if not problem:
            continue
        topic_count[problem.topic]["attempts"] += 1
        if sub.status == "Accepted":
            topic_count[problem.topic]["accepted"] += 1
        diff_count[problem.difficulty] += 1

    topic_success_rate = {
        topic: round((vals["accepted"] / vals["attempts"]) * 100, 2) if vals["attempts"] else 0
        for topic, vals in topic_count.items()
    }

    existing = db.get(UserAnalytics, user_id)
    if not existing:
        existing = UserAnalytics(user_id=user_id)
        db.add(existing)

    existing.accuracy = round(accuracy, 2)
    existing.attempt_count = attempts
    existing.avg_runtime_ms = round(avg_runtime, 2)
    existing.topic_success_rate = topic_success_rate
    existing.difficulty_distribution = dict(diff_count)
    db.commit()
    db.refresh(existing)
    return existing


@router.post("", response_model=SubmissionResult, status_code=status.HTTP_201_CREATED)
def create_submission(
    payload: SubmissionCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> SubmissionResult:
    problem = db.get(Problem, payload.problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    result = testcase_runner.evaluate(
        language=payload.language,
        code=payload.code,
        visible_testcases=problem.visible_testcases,
        hidden_testcases=problem.hidden_testcases,
    )

    submission = Submission(
        user_id=current_user.id,
        problem_id=payload.problem_id,
        language=payload.language,
        code=payload.code,
        status=result.status,
        runtime_ms=result.max_runtime_ms,
        memory_kb=None,
        passed_testcases=result.passed,
        total_testcases=result.total,
    )
    db.add(submission)
    db.commit()
    db.refresh(submission)
    _recompute_analytics(db, current_user.id)

    analysis_engine.log_activity(
        db,
        current_user.id,
        "problem_submission",
        {
            "problem_id": payload.problem_id,
            "language": payload.language,
            "status": result.status,
            "runtime_ms": result.max_runtime_ms,
        },
    )

    roadmap_message = "Roadmap progress unchanged"
    if result.status == "Accepted":
        updated = roadmap_engine.mark_progress_for_problem(db, current_user.id, payload.problem_id)
        roadmap_message = "Roadmap task auto-marked completed" if updated else "Roadmap matched task not found"

    ai_summary = analysis_engine.analyze_user(
        db,
        current_user.id,
        trigger="problem_submission",
        auto_refresh=True,
    )
    weak_topics = ai_summary.get("weak_topics") or []
    topic_message = (
        f"Weak areas updated: {', '.join(weak_topics[:2])}" if weak_topics else "Topic mastery updated"
    )

    return SubmissionResult(
        submission_id=submission.id,
        status=submission.status,
        passed=submission.passed_testcases,
        total=submission.total_testcases,
        runtime_ms=submission.runtime_ms,
        memory_kb=submission.memory_kb,
        topic_mastery_update=topic_message,
        roadmap_progress_update=roadmap_message,
    )


@router.get("", response_model=list[SubmissionRead])
def list_submissions(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
    problem_id: int | None = Query(default=None),
) -> list[Submission]:
    query = select(Submission).where(Submission.user_id == current_user.id)
    if problem_id is not None:
        query = query.where(Submission.problem_id == problem_id)
    query = query.order_by(Submission.created_at.desc())
    return list(db.scalars(query).all())


@router.get("/analytics/summary", response_model=AnalyticsSummary)
def get_analytics_summary(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> AnalyticsSummary:
    analytics = db.get(UserAnalytics, current_user.id)
    if not analytics:
        analytics = _recompute_analytics(db, current_user.id)

    return AnalyticsSummary(
        accuracy=analytics.accuracy,
        attempt_count=analytics.attempt_count,
        avg_runtime_ms=analytics.avg_runtime_ms,
        topic_success_rate=analytics.topic_success_rate,
        difficulty_distribution=analytics.difficulty_distribution,
    )


@router.get("/{submission_id}", response_model=SubmissionRead)
def get_submission(
    submission_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> Submission:
    submission = db.get(Submission, submission_id)
    if not submission or submission.user_id != current_user.id:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Submission not found")
    return submission
