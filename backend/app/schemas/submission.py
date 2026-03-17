from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field


class SubmissionCreate(BaseModel):
    problem_id: int
    language: str = Field(pattern="^(cpp|python|java|javascript)$")
    code: str = Field(min_length=1, max_length=100000)


class SubmissionRead(BaseModel):
    id: int
    user_id: int
    problem_id: int
    language: str
    status: str
    runtime_ms: int | None
    memory_kb: int | None
    passed_testcases: int
    total_testcases: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class SubmissionResult(BaseModel):
    submission_id: int
    status: str
    passed: int
    total: int
    runtime_ms: int | None
    memory_kb: int | None
    topic_mastery_update: str | None = None
    roadmap_progress_update: str | None = None
