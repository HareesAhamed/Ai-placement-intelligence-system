from datetime import datetime

from pydantic import BaseModel


class ContestRead(BaseModel):
    id: int
    platform: str
    name: str
    start_time: datetime
    duration: int
    url: str
    section: str
