from pydantic import BaseModel


class AnalyticsSummary(BaseModel):
    accuracy: float
    attempt_count: int
    avg_runtime_ms: float
    topic_success_rate: dict
    difficulty_distribution: dict
