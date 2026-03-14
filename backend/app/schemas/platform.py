from datetime import datetime

from pydantic import BaseModel


class PlatformAccountPayload(BaseModel):
    platform: str
    username: str


class PlatformAccountRead(BaseModel):
    id: int
    platform: str
    username: str


class PlatformStatRead(BaseModel):
    platform: str
    easy_solved: int
    medium_solved: int
    hard_solved: int
    total_solved: int
    topics: list[str]
    latest_submission_at: datetime | None


class PlatformSyncResponse(BaseModel):
    synced: int
    message: str
