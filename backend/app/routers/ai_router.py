from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.user import User
from app.services.analysis_engine import analysis_engine

router = APIRouter(prefix="/ai", tags=["ai"])


@router.post("/analyze")
def run_ai_analysis(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, object]:
    return analysis_engine.analyze_user(db, current_user.id, trigger="manual", auto_refresh=True)
