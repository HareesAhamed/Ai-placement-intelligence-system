from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.platform import UserPlatformAccount, UserPlatformStat
from app.models.user import User
from app.schemas.platform import (
    PlatformAccountPayload,
    PlatformAccountRead,
    PlatformStatRead,
    PlatformSyncResponse,
)
from app.services.platform_connector_service import platform_connector_service

router = APIRouter(prefix="/platform-connectors", tags=["platform-connectors"])


@router.get("/accounts", response_model=list[PlatformAccountRead])
def list_accounts(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[PlatformAccountRead]:
    accounts = list(
        db.scalars(
            select(UserPlatformAccount)
            .where(UserPlatformAccount.user_id == current_user.id)
            .order_by(UserPlatformAccount.platform.asc())
        ).all()
    )
    return [PlatformAccountRead(id=acc.id, platform=acc.platform, username=acc.username) for acc in accounts]


@router.post("/accounts", response_model=PlatformAccountRead, status_code=status.HTTP_201_CREATED)
def upsert_account(
    payload: PlatformAccountPayload,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> PlatformAccountRead:
    platform = payload.platform.lower().strip()
    if platform not in {"leetcode", "geeksforgeeks", "gfg"}:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Unsupported platform")

    normalized_platform = "geeksforgeeks" if platform == "gfg" else platform
    existing = db.scalar(
        select(UserPlatformAccount).where(
            UserPlatformAccount.user_id == current_user.id,
            UserPlatformAccount.platform == normalized_platform,
        )
    )
    if existing:
        existing.username = payload.username.strip()
        account = existing
    else:
        account = UserPlatformAccount(
            user_id=current_user.id,
            platform=normalized_platform,
            username=payload.username.strip(),
        )
        db.add(account)

    db.commit()
    db.refresh(account)
    return PlatformAccountRead(id=account.id, platform=account.platform, username=account.username)


@router.get("/stats", response_model=list[PlatformStatRead])
def list_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> list[PlatformStatRead]:
    stats = list(
        db.scalars(
            select(UserPlatformStat)
            .where(UserPlatformStat.user_id == current_user.id)
            .order_by(UserPlatformStat.platform.asc())
        ).all()
    )
    return [
        PlatformStatRead(
            platform=stat.platform,
            easy_solved=stat.easy_solved,
            medium_solved=stat.medium_solved,
            hard_solved=stat.hard_solved,
            total_solved=stat.total_solved,
            topics=stat.topics or [],
            latest_submission_at=stat.latest_submission_at,
        )
        for stat in stats
    ]


@router.post("/sync", response_model=PlatformSyncResponse)
def sync_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)) -> PlatformSyncResponse:
    synced = platform_connector_service.sync_user_platform_stats(db=db, user_id=current_user.id)
    return PlatformSyncResponse(synced=synced, message="Platform stats synchronized")
