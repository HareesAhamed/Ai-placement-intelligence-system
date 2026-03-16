from pydantic import BaseModel


class TutorialRead(BaseModel):
    topic: str
    title: str
    concept: str
    code_example: str
    complexity: str
    practice_tips: str
    resource_link: str | None = None
    video_links: list[str] = []
    article_snippets: list[dict[str, str]] = []
