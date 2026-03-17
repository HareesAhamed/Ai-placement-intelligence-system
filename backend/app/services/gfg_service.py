import httpx
import logging
from bs4 import BeautifulSoup
from typing import Dict, Any, Optional

logger = logging.getLogger(__name__)

class GFGService:
    BASE_URL = "https://auth.geeksforgeeks.org/user/{}/practice/"
    
    @classmethod
    async def fetch_user_stats(cls, username: str) -> Optional[Dict[str, Any]]:
        """
        Scrape GFG public profile for stats.
        Includes problems solved, coding score, institution rank, etc.
        """
        url = cls.BASE_URL.format(username)
        
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                response = await client.get(url)
                if response.status_code != 200:
                    logger.warning(f"GFG fetch failed for {username} with status {response.status_code}")
                    return None
                    
                soup = BeautifulSoup(response.text, "html.parser")
                
                stats = {
                    "username": username,
                    "problems_solved": 0,
                    "coding_score": 0,
                    "institution_rank": None,
                    "easy_solved": 0,
                    "medium_solved": 0,
                    "hard_solved": 0,
                }
                
                # Scraping logic could go here based on GFG's current HTML structure
                # This is a simplified placeholder as their HTML changes often.
                # E.g. finding divs with specific classes.
                
                score_cards = soup.find_all("div", class_="score_card_value")
                if len(score_cards) >= 1:
                    try:
                        stats["coding_score"] = int(score_cards[0].text.strip())
                    except ValueError:
                        pass
                if len(score_cards) >= 2:
                    try:
                        stats["problems_solved"] = int(score_cards[1].text.strip())
                    except ValueError:
                        pass
                        
                return stats
        except Exception as e:
            logger.error(f"Error fetching GFG stats for {username}: {e}")
            return None

gfg_service = GFGService()
