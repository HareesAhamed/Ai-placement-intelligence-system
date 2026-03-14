from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.problem import Problem
from app.schemas.problem import ProblemCreate, ProblemRead

router = APIRouter()


@router.get("", response_model=list[ProblemRead])
def list_problems(
    db: Session = Depends(get_db),
    difficulty: str | None = Query(default=None),
    topic: str | None = Query(default=None),
) -> list[Problem]:
    query = select(Problem)
    if difficulty:
        query = query.where(Problem.difficulty == difficulty)
    if topic:
        query = query.where(Problem.topic == topic)
    return list(db.scalars(query).all())


@router.get("/{problem_id}", response_model=ProblemRead)
def get_problem(problem_id: int, db: Session = Depends(get_db)) -> Problem:
    problem = db.get(Problem, problem_id)
    if not problem:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Problem not found")
    return problem


@router.post("", response_model=ProblemRead, status_code=status.HTTP_201_CREATED)
def create_problem(payload: ProblemCreate, db: Session = Depends(get_db)) -> Problem:
    problem = Problem(
        title=payload.title,
        difficulty=payload.difficulty,
        topic=payload.topic,
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
