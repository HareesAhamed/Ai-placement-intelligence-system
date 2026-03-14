from datetime import datetime

from sqlalchemy import DateTime, Float, ForeignKey, Integer, JSON, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class UserAnalytics(Base):
    __tablename__ = "user_analytics"

    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    accuracy: Mapped[float] = mapped_column(Float, default=0)
    attempt_count: Mapped[int] = mapped_column(Integer, default=0)
    avg_runtime_ms: Mapped[float] = mapped_column(Float, default=0)
    topic_success_rate: Mapped[dict] = mapped_column(JSON, default=dict)
    difficulty_distribution: Mapped[dict] = mapped_column(JSON, default=dict)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
