from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.contest import ContestRead
from app.services.contest_service import contest_service

router = APIRouter(prefix="/contests", tags=["contests"])


@router.get("", response_model=list[ContestRead])
def list_contests(
    db: Session = Depends(get_db),
    section: str = Query(default="all"),
) -> list[ContestRead]:
    now = datetime.now(timezone.utc)
    contests = contest_service.list_contests(db)

    items: list[ContestRead] = []
    for contest in contests:
        contest_end = contest.start_time + timedelta(minutes=contest.duration)
        if contest.start_time > now:
            contest_section = "upcoming"
        elif contest.start_time <= now <= contest_end:
            contest_section = "live"
        else:
            contest_section = "past"

        if section != "all" and section.lower() != contest_section:
            continue

        items.append(
            ContestRead(
                id=contest.id,
                platform=contest.platform,
                name=contest.name,
                start_time=contest.start_time,
                duration=contest.duration,
                url=contest.url,
                section=contest_section,
            )
        )
    return items


@router.post("/sync")
def sync_contests(db: Session = Depends(get_db)) -> dict[str, int]:
    count = contest_service.sync_contests(db)
    return {"synced": count}
