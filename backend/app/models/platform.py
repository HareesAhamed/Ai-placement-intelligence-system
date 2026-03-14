from datetime import datetime

from sqlalchemy import JSON, DateTime, ForeignKey, String, UniqueConstraint, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class UserPlatformAccount(Base):
    __tablename__ = "user_platform_accounts"
    __table_args__ = (UniqueConstraint("user_id", "platform", name="uq_user_platform_account"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    platform: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    username: Mapped[str] = mapped_column(String(255), nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="platform_accounts")
    stats = relationship("UserPlatformStat", back_populates="account", uselist=False, cascade="all, delete-orphan")


class UserPlatformStat(Base):
    __tablename__ = "user_platform_stats"
    __table_args__ = (UniqueConstraint("user_id", "platform", name="uq_user_platform_stat"),)

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    user_id: Mapped[int] = mapped_column(ForeignKey("users.id", ondelete="CASCADE"), index=True)
    account_id: Mapped[int] = mapped_column(ForeignKey("user_platform_accounts.id", ondelete="CASCADE"), index=True)
    platform: Mapped[str] = mapped_column(String(64), nullable=False, index=True)
    easy_solved: Mapped[int] = mapped_column(default=0)
    medium_solved: Mapped[int] = mapped_column(default=0)
    hard_solved: Mapped[int] = mapped_column(default=0)
    total_solved: Mapped[int] = mapped_column(default=0)
    topics: Mapped[list[str]] = mapped_column(JSON, default=list)
    latest_submission_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())

    user = relationship("User", back_populates="platform_stats")
    account = relationship("UserPlatformAccount", back_populates="stats")
