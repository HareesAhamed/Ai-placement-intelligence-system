from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from apscheduler.schedulers.background import BackgroundScheduler

from app.config import get_cors_origins, get_settings
from app.database import Base, SessionLocal, engine
import app.models  # noqa: F401
from app.routers import auth, contests, execution, platform_connectors, problems, submissions
from app.services.contest_service import contest_service

settings = get_settings()
app = FastAPI(title=settings.app_name, debug=settings.app_debug)
scheduler = BackgroundScheduler(timezone="UTC")

app.add_middleware(
    CORSMiddleware,
    allow_origins=get_cors_origins(settings),
    allow_origin_regex=r"^https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.on_event("startup")
def on_startup() -> None:
    # For local bootstrap; replace with Alembic migrations in deployment.
    Base.metadata.create_all(bind=engine)

    def sync_contests_job() -> None:
        db = SessionLocal()
        try:
            contest_service.sync_contests(db)
        finally:
            db.close()

    if not scheduler.running:
        scheduler.add_job(sync_contests_job, "cron", hour=settings.contest_sync_hour_utc, id="contest_daily_sync", replace_existing=True)
        scheduler.start()
    sync_contests_job()


@app.on_event("shutdown")
def on_shutdown() -> None:
    if scheduler.running:
        scheduler.shutdown(wait=False)


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "env": settings.app_env}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(execution.router, tags=["execution"])
app.include_router(problems.router, prefix="/problems", tags=["problems"])
app.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
app.include_router(platform_connectors.router)
app.include_router(contests.router)
