from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user, get_optional_current_user
from app.models.bookmark import ProblemBookmark
from app.models.problem import Problem
from app.models.submission import Submission
from app.models.user import User
from app.schemas.problem import BookmarkResponse, ProblemCreate, ProblemListItem, ProblemRead

router = APIRouter()


@router.get("", response_model=list[ProblemListItem])
def list_problems(
    db: Session = Depends(get_db),
    difficulty: str | None = Query(default=None),
    topic: str | None = Query(default=None),
    company: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    tab: str = Query(default="all"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    search: str | None = Query(default=None),
    current_user: User | None = Depends(get_optional_current_user),
) -> list[ProblemListItem]:
    all_problems = list(db.scalars(select(Problem).order_by(Problem.id.asc())).all())

    submission_problem_ids: set[int] = set()
    bookmarked_ids: set[int] = set()
    if current_user:
        submission_problem_ids = {
            row[0]
            for row in db.execute(
                select(Submission.problem_id).where(
                    Submission.user_id == current_user.id,
                    Submission.status == "Accepted",
                )
            ).all()
        }
        bookmarked_ids = {
            row[0]
            for row in db.execute(
                select(ProblemBookmark.problem_id).where(ProblemBookmark.user_id == current_user.id)
            ).all()
        }

    def match(problem: Problem) -> bool:
        if difficulty and problem.difficulty.lower() != difficulty.lower():
            return False
        if topic and topic.lower() not in [t.lower() for t in (problem.topic_tags or [problem.topic])]:
            return False
        if company and company.lower() not in [c.lower() for c in problem.company_tags]:
            return False
        if tab.lower() == "premium" and not problem.is_premium:
            return False
        if search:
            hay = " ".join([problem.title, problem.topic, *problem.topic_tags, *problem.company_tags]).lower()
            if search.lower() not in hay:
                return False
        solved = problem.id in submission_problem_ids
        bookmarked = problem.id in bookmarked_ids
        if status_filter:
            normalized = status_filter.lower()
            if normalized == "solved" and not solved:
                return False
            if normalized == "unsolved" and solved:
                return False
            if normalized == "bookmarked" and not bookmarked:
                return False
        return True

    filtered = [problem for problem in all_problems if match(problem)]
    start = (page - 1) * page_size
    end = start + page_size

    return [
        ProblemListItem(
            id=problem.id,
            title=problem.title,
            difficulty=problem.difficulty,
            topic=problem.topic,
            topic_tags=problem.topic_tags or ([problem.topic] if problem.topic else []),
            company_tags=problem.company_tags,
            is_premium=problem.is_premium,
            solved=problem.id in submission_problem_ids,
            is_bookmarked=problem.id in bookmarked_ids,
        )
        for problem in filtered[start:end]
    ]


@router.get("/{problem_id}", response_model=ProblemRead)
def get_problem(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User | None = Depends(get_optional_current_user),
) -> ProblemRead:
    problem = db.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    solved = False
    is_bookmarked = False
    if current_user:
        solved = db.scalar(
            select(Submission.id).where(
                Submission.user_id == current_user.id,
                Submission.problem_id == problem.id,
                Submission.status == "Accepted",
            )
        ) is not None
        is_bookmarked = db.scalar(
            select(ProblemBookmark.id).where(
                ProblemBookmark.user_id == current_user.id,
                ProblemBookmark.problem_id == problem.id,
            )
        ) is not None

    return ProblemRead(
        id=problem.id,
        title=problem.title,
        difficulty=problem.difficulty,
        topic=problem.topic,
        topic_tags=problem.topic_tags or ([problem.topic] if problem.topic else []),
        is_premium=problem.is_premium,
        description=problem.description,
        input_format=problem.input_format,
        output_format=problem.output_format,
        constraints=problem.constraints,
        examples=problem.examples,
        company_tags=problem.company_tags,
        hints=problem.hints,
        visible_testcases=problem.visible_testcases,
        solved=solved,
        is_bookmarked=is_bookmarked,
        created_at=problem.created_at,
    )


@router.post("", response_model=ProblemRead, status_code=status.HTTP_201_CREATED)
def create_problem(payload: ProblemCreate, db: Session = Depends(get_db)) -> Problem:
    problem = Problem(
        title=payload.title,
        difficulty=payload.difficulty,
        topic=payload.topic,
        topic_tags=payload.topic_tags,
        is_premium=payload.is_premium,
        description=payload.description,
        input_format=payload.input_format,
        output_format=payload.output_format,
        constraints=payload.constraints,
        examples=payload.examples,
        company_tags=payload.company_tags,
        hints=payload.hints,
        visible_testcases=[tc.model_dump() for tc in payload.visible_testcases],
        hidden_testcases=[tc.model_dump() for tc in payload.hidden_testcases],
    )
    db.add(problem)
    db.commit()
    db.refresh(problem)
    return problem


@router.post("/{problem_id}/bookmark", response_model=BookmarkResponse)
def toggle_bookmark(
    problem_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> BookmarkResponse:
    problem = db.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")

    existing = db.scalar(
        select(ProblemBookmark).where(
            ProblemBookmark.user_id == current_user.id,
            ProblemBookmark.problem_id == problem_id,
        )
    )
    if existing:
        db.delete(existing)
        bookmarked = False
    else:
        db.add(ProblemBookmark(user_id=current_user.id, problem_id=problem_id))
        bookmarked = True

    db.commit()
    return BookmarkResponse(problem_id=problem_id, bookmarked=bookmarked)
