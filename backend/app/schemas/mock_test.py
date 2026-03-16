from datetime import datetime

from pydantic import BaseModel, Field


class MockTestStartRequest(BaseModel):
    mode: str = Field(pattern="^(pattern|company|overall)$")
    category: str | None = None
    question_count: int = Field(default=10, ge=3, le=20)


class MockTestProblemItem(BaseModel):
    id: int
    title: str
    difficulty: str
    topic: str


class MockTestStartResponse(BaseModel):
    mode: str
    category: str | None = None
    started_at: datetime
    problems: list[MockTestProblemItem]


class MockTestEvaluateRequest(BaseModel):
    mode: str = Field(pattern="^(pattern|company|overall)$")
    category: str | None = None
    started_at: datetime
    problem_ids: list[int] = Field(min_length=1)


class MockTestEvaluateResponse(BaseModel):
    mode: str
    category: str | None = None
    score: int
    solved_count: int
    total_questions: int
    time_taken_minutes: int
    strengths: list[str]
    weaknesses: list[str]


class MockTestCategoryResponse(BaseModel):
    pattern_categories: list[str]
    company_categories: list[str]
