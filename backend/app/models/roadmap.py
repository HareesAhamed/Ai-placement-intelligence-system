from datetime import date, datetime

from sqlalchemy import Boolean, Date, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class RoadmapPlan(Base):
    __tablename__ = "roadmap_plans"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    start_date: Mapped[date] = mapped_column(Date, nullable=False)
    week_number: Mapped[int] = mapped_column(Integer, default=1)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    generated_reason: Mapped[str] = mapped_column(String(64), default="initial")
    ai_provider: Mapped[str] = mapped_column(String(64), default="rule-based")
    generation_trace: Mapped[str | None] = mapped_column(Text, nullable=True)
    ai_feedback: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="roadmap_plans")
    days = relationship("RoadmapDay", back_populates="plan", cascade="all, delete-orphan")


class RoadmapDay(Base):
    __tablename__ = "roadmap_days"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    plan_id: Mapped[int] = mapped_column(ForeignKey("roadmap_plans.id", ondelete="CASCADE"), index=True)
    day_number: Mapped[int] = mapped_column(Integer, nullable=False)
    week_number: Mapped[int] = mapped_column(Integer, nullable=False)
    topic: Mapped[str] = mapped_column(String(128), nullable=False)
    problems_count: Mapped[int] = mapped_column(Integer, default=2)
    tutorial_title: Mapped[str | None] = mapped_column(String(255), nullable=True)
    tutorial_link: Mapped[str | None] = mapped_column(String(1024), nullable=True)
    estimated_minutes: Mapped[int] = mapped_column(Integer, default=90)
    task_type: Mapped[str] = mapped_column(String(64), default="practice")
    is_completed: Mapped[bool] = mapped_column(Boolean, default=False)

    plan = relationship("RoadmapPlan", back_populates="days")
