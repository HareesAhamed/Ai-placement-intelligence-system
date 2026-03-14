from pydantic import BaseModel, Field


class ExecuteRequest(BaseModel):
    language: str = Field(pattern="^(cpp|python|java|javascript)$")
    code: str = Field(min_length=1, max_length=100000)
    input: str = Field(default="", max_length=50000)


class ExecuteResponse(BaseModel):
    output: str
    stderr: str = ""
    runtime: str
    status: str
