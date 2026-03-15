from fastapi import APIRouter, Depends, status
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database import get_db
from app.dependencies import get_current_user
from app.models.onboarding import OnboardingSurvey
from app.models.user import User
from app.schemas.survey import SurveyReadResponse, SurveySubmitRequest

router = APIRouter(prefix="/survey", tags=["survey"])


@router.post("/submit", response_model=SurveyReadResponse, status_code=status.HTTP_201_CREATED)
def submit_survey(
    payload: SurveySubmitRequest,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingSurvey:
    survey = db.scalar(select(OnboardingSurvey).where(OnboardingSurvey.user_id == current_user.id))
    if not survey:
        survey = OnboardingSurvey(user_id=current_user.id)
        db.add(survey)

    survey.current_year = payload.current_year
    survey.dsa_experience_level = payload.dsa_experience_level
    survey.target_companies = payload.target_companies
    survey.weekly_study_hours = payload.weekly_study_hours
    survey.preferred_language = payload.preferred_language
    survey.preparation_start_date = payload.preparation_start_date
    survey.goal_timeline_months = payload.goal_timeline_months

    db.commit()
    db.refresh(survey)
    return survey


@router.get("", response_model=SurveyReadResponse)
def get_survey(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
) -> OnboardingSurvey:
    survey = db.scalar(select(OnboardingSurvey).where(OnboardingSurvey.user_id == current_user.id))
    if not survey:
        # Returning 404 would force additional client error handling for first-time users.
        survey = OnboardingSurvey(
            user_id=current_user.id,
            current_year="3rd",
            dsa_experience_level="Beginner",
            target_companies=[],
            weekly_study_hours=6,
            preferred_language="python",
            preparation_start_date=current_user.created_at.date(),
            goal_timeline_months=6,
        )
        db.add(survey)
        db.commit()
        db.refresh(survey)
    return survey
