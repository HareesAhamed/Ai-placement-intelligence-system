from datetime import datetime

from pydantic import BaseModel, ConfigDict


class Testcase(BaseModel):
    input: str
    expected_output: str


class ProblemBase(BaseModel):
    title: str
    difficulty: str
    topic: str
    description: str
    input_format: str | None = None
    output_format: str | None = None
    constraints: str | None = None
    examples: list[dict[str, str]] = []
    company_tags: list[str] = []
    hints: list[str] = []


class ProblemCreate(ProblemBase):
    visible_testcases: list[Testcase] = []
    hidden_testcases: list[Testcase] = []


class ProblemRead(ProblemBase):
    id: int
    visible_testcases: list[Testcase] = []
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)
