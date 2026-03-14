from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import get_cors_origins, get_settings
from app.database import Base, engine
import app.models  # noqa: F401
from app.routers import auth, execution, problems, submissions

settings = get_settings()
app = FastAPI(title=settings.app_name, debug=settings.app_debug)

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


@app.get("/health")
def health() -> dict[str, str]:
    return {"status": "ok", "env": settings.app_env}


app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(execution.router, tags=["execution"])
app.include_router(problems.router, prefix="/problems", tags=["problems"])
app.include_router(submissions.router, prefix="/submissions", tags=["submissions"])
