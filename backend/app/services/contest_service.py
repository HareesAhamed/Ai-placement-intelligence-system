import json
from datetime import datetime, timedelta, timezone
from urllib.parse import urlencode
from urllib.request import Request, urlopen

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.config import get_settings
from app.models.contest import Contest


SUPPORTED_PLATFORMS = {
    "leetcode": "leetcode.com",
    "codeforces": "codeforces.com",
    "codechef": "codechef.com",
    "atcoder": "atcoder.jp",
}


class ContestService:
    def __init__(self) -> None:
        self.settings = get_settings()

    def _fetch_from_clist(self) -> list[dict]:
        username = self.settings.clist_api_username
        api_key = self.settings.clist_api_key
        if not username or not api_key:
            return []

        now = datetime.now(timezone.utc)
        resource_filter = ",".join(SUPPORTED_PLATFORMS.values())
        query = urlencode(
            {
                "username": username,
                "api_key": api_key,
                "resource": resource_filter,
                "start__gte": now.isoformat(),
                "order_by": "start",
                "limit": 80,
            }
        )
        url = f"https://clist.by/api/v4/contest/?{query}"
        request = Request(url, headers={"User-Agent": self.settings.connectors_user_agent})
        with urlopen(request, timeout=20) as response:
            payload = json.loads(response.read().decode("utf-8"))

        objects = payload.get("objects", [])
        items: list[dict] = []
        for item in objects:
            host = item.get("host", "")
            platform = next((key for key, value in SUPPORTED_PLATFORMS.items() if value in host), None)
            if not platform:
                continue
            start = datetime.fromisoformat(item["start"].replace("Z", "+00:00"))
            duration = int(item.get("duration", 0) // 60)
            items.append(
                {
                    "platform": platform.title(),
                    "name": item.get("event", "Untitled Contest"),
                    "start_time": start,
                    "duration": duration,
                    "url": item.get("href") or item.get("event_url") or "https://clist.by/",
                }
            )
        return items

    def _fallback_contests(self) -> list[dict]:
        now = datetime.now(timezone.utc)
        return [
            {
                "platform": "LeetCode",
                "name": "Weekly Contest",
                "start_time": now + timedelta(days=1),
                "duration": 90,
                "url": "https://leetcode.com/contest/",
            },
            {
                "platform": "Codeforces",
                "name": "Codeforces Round",
                "start_time": now + timedelta(days=2, hours=4),
                "duration": 120,
                "url": "https://codeforces.com/contests",
            },
            {
                "platform": "CodeChef",
                "name": "Starters",
                "start_time": now - timedelta(hours=1),
                "duration": 180,
                "url": "https://www.codechef.com/contests",
            },
            {
                "platform": "AtCoder",
                "name": "AtCoder Beginner Contest",
                "start_time": now - timedelta(days=1),
                "duration": 100,
                "url": "https://atcoder.jp/contests/",
            },
        ]

    def sync_contests(self, db: Session) -> int:
        contests = self._fetch_from_clist()
        if not contests:
            contests = self._fallback_contests()

        count = 0
        for item in contests:
            existing = db.scalar(
                select(Contest).where(
                    Contest.platform == item["platform"],
                    Contest.name == item["name"],
                    Contest.start_time == item["start_time"],
                )
            )
            if existing:
                existing.duration = item["duration"]
                existing.url = item["url"]
            else:
                db.add(Contest(**item))
            count += 1

        db.commit()
        return count

    def list_contests(self, db: Session) -> list[Contest]:
        return list(db.scalars(select(Contest).order_by(Contest.start_time.asc())).all())


contest_service = ContestService()
