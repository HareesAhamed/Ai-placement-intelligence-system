from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.onboarding import OnboardingSurvey
from app.models.user import User
from app.services.analytics_engine import analytics_engine
from app.services.company_engine import company_engine
from app.services.weakness_engine import weakness_engine

router = APIRouter(prefix="/analytics", tags=["analytics"])


@router.get("/topic-strength")
def get_topic_strength(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, object]:
    survey = db.scalar(select(OnboardingSurvey).where(OnboardingSurvey.user_id == current_user.id))
    companies = survey.target_companies if survey else []
    return {
        "topics": analytics_engine.topic_strength(db, current_user.id, companies),
    }


@router.get("/company-readiness")
def get_company_readiness(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, object]:
    survey = db.scalar(select(OnboardingSurvey).where(OnboardingSurvey.user_id == current_user.id))
    companies = survey.target_companies if survey else []
    weights = company_engine.get_company_weights(db, companies)
    weakness = weakness_engine.compute_topic_weakness(db, current_user.id, weights)
    readiness = company_engine.readiness_by_company(db, weakness)
    return {"readiness": readiness}


@router.get("/progress")
def get_progress(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> dict[str, object]:
    return analytics_engine.progress(db, current_user.id)
