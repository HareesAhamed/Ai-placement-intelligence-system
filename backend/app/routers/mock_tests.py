from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import and_, select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.schemas.mock_test import (
    MockTestCategoryResponse,
    MockTestEvaluateRequest,
    MockTestEvaluateResponse,
    MockTestProblemItem,
    MockTestStartRequest,
    MockTestStartResponse,
)
from app.services.analytics_engine import analytics_engine

router = APIRouter(prefix="/mock-tests", tags=["mock-tests"])


@router.get("/categories", response_model=MockTestCategoryResponse)
def get_mock_test_categories(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> MockTestCategoryResponse:
    problems = list(db.scalars(select(Problem)).all())
    pattern_categories = sorted({problem.topic for problem in problems if problem.topic})
    company_categories = sorted({tag for problem in problems for tag in (problem.company_tags or []) if tag})

    return MockTestCategoryResponse(
        pattern_categories=pattern_categories,
        company_categories=company_categories,
    )


def _difficulty_bucket(problems: list[Problem], label: str) -> list[Problem]:
    return [problem for problem in problems if problem.difficulty.lower() == label.lower()]


def _build_question_set(problems: list[Problem], question_count: int) -> list[Problem]:
    easy = _difficulty_bucket(problems, "Easy")
    medium = _difficulty_bucket(problems, "Medium")
    hard = _difficulty_bucket(problems, "Hard")

    targets = [(easy, 0.5), (medium, 0.3), (hard, 0.2)]
    picked: list[Problem] = []
    used_ids: set[int] = set()

    for bucket, ratio in targets:
        quota = max(1, int(round(question_count * ratio)))
        for problem in bucket:
            if len([item for item in picked if item.difficulty == problem.difficulty]) >= quota:
                break
            if problem.id in used_ids:
                continue
            picked.append(problem)
            used_ids.add(problem.id)

    for problem in problems:
        if len(picked) >= question_count:
            break
        if problem.id in used_ids:
            continue
        picked.append(problem)
        used_ids.add(problem.id)

    return picked[:question_count]


@router.post("/start", response_model=MockTestStartResponse)
def start_mock_test(
    payload: MockTestStartRequest,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> MockTestStartResponse:
    base_query = select(Problem)

    if payload.mode == "pattern":
        if not payload.category:
            raise HTTPException(status_code=400, detail="Pattern category is required")
        pool = list(
            db.scalars(
                base_query.where(Problem.topic == payload.category).order_by(Problem.id.asc())
            ).all()
        )
    elif payload.mode == "company":
        if not payload.category:
            raise HTTPException(status_code=400, detail="Company category is required")
        pool = list(
            db.scalars(
                base_query.where(Problem.company_tags.contains([payload.category])).order_by(Problem.id.asc())
            ).all()
        )
    else:
        pool = list(db.scalars(base_query.order_by(Problem.id.asc())).all())

    if len(pool) < 3:
        raise HTTPException(status_code=404, detail="Not enough problems to create this mock test")

    selected = _build_question_set(pool, payload.question_count)

    return MockTestStartResponse(
        mode=payload.mode,
        category=payload.category,
        started_at=datetime.now(timezone.utc),
        problems=[
            MockTestProblemItem(
                id=problem.id,
                title=problem.title,
                difficulty=problem.difficulty,
                topic=problem.topic,
            )
            for problem in selected
        ],
    )


@router.post("/evaluate", response_model=MockTestEvaluateResponse)
def evaluate_mock_test(
    payload: MockTestEvaluateRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> MockTestEvaluateResponse:
    question_ids = list(dict.fromkeys(payload.problem_ids))
    if len(question_ids) == 0:
        raise HTTPException(status_code=400, detail="No questions found for evaluation")

    accepted_submissions = list(
        db.scalars(
            select(Submission)
            .where(
                and_(
                    Submission.user_id == current_user.id,
                    Submission.problem_id.in_(question_ids),
                    Submission.status == "Accepted",
                    Submission.created_at >= payload.started_at,
                )
            )
            .order_by(Submission.created_at.asc())
        ).all()
    )

    solved_ids = {submission.problem_id for submission in accepted_submissions}
    solved_count = len(solved_ids)
    total = len(question_ids)
    score = int(round((solved_count / total) * 100)) if total else 0

    topic_strength = analytics_engine.topic_strength(db, current_user.id, [])
    strong_topics = [item["topic"] for item in topic_strength if item["classification"] == "strong"]
    weak_topics = [item["topic"] for item in topic_strength if item["classification"] == "weak"]

    now = datetime.now(timezone.utc)
    started_at = payload.started_at.replace(tzinfo=timezone.utc) if payload.started_at.tzinfo is None else payload.started_at
    duration_minutes = max(1, int((now - started_at).total_seconds() // 60))

    return MockTestEvaluateResponse(
        mode=payload.mode,
        category=payload.category,
        score=score,
        solved_count=solved_count,
        total_questions=total,
        time_taken_minutes=duration_minutes,
        strengths=strong_topics[:3] if strong_topics else ["Consistency in solving attempts"],
        weaknesses=weak_topics[:3] if weak_topics else ["Increase medium/hard mock completion"],
    )
