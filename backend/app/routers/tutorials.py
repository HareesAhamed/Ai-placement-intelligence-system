from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.tutorial import Tutorial
from app.models.user import User
from app.schemas.tutorial import TutorialRead

router = APIRouter(prefix="/tutorials", tags=["tutorials"])


@router.get("", response_model=list[TutorialRead])
def list_tutorials(
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> list[Tutorial]:
    return list(db.scalars(select(Tutorial).order_by(Tutorial.topic.asc())).all())


@router.get("/{topic}", response_model=TutorialRead)
def get_tutorial(
    topic: str,
    db: Session = Depends(get_db),
    _: User = Depends(get_current_user),
) -> Tutorial:
    tutorial = db.scalar(select(Tutorial).where(Tutorial.topic == topic))
    if not tutorial:
        raise HTTPException(status_code=404, detail="Tutorial not found")
    return tutorial
