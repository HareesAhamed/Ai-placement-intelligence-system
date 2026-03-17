import re

with open('backend/app/services/analysis_engine.py', 'r') as f:
    content = f.read()

new_imports = """from sqlalchemy import select
from sqlalchemy.orm import Session
import random"""

content = content.replace("from sqlalchemy import select\nfrom sqlalchemy.orm import Session", new_imports)

methods_to_add = """
    def detect_learning_patterns(self, db: Session, user_id: int) -> list[str]:
        metrics = db.scalars(select(TopicMetric).where(TopicMetric.user_id == user_id)).all()
        patterns = []
        for m in metrics:
            if m.avg_runtime_ms > 2000:
                patterns.append(f"You spend a longer time than average on {m.topic}. Consider timing your practice.")
            elif m.avg_runtime_ms < 800 and m.accepted > 3:
                patterns.append(f"You are a fast learner in {m.topic}! Try harder problems.")
        
        if not patterns:
            patterns.append("Your learning pattern is stable across topics.")
            
        return patterns[:3]

    def generate_smart_recommendations(self, db: Session, weak_topics: list[str], target_companies: list[str]) -> list[dict]:
        recommendations = []
        if not weak_topics:
            return recommendations
            
        for topic in weak_topics[:2]: # Top 2 weak topics
            company_context = f" for {target_companies[0]}" if target_companies else ""
            
            # Find a problem
            problems = list(db.scalars(select(Problem).where(Problem.topic == topic, Problem.difficulty == "Medium")).all())
            rec_prob = random.choice(problems) if problems else None
            
            if rec_prob:
                recommendations.append({
                    "title": f"Practice more {topic}",
                    "reason": f"You are weak at {topic}. Practicing this will improve your chances{company_context}.",
                    "action_item": f"Solve {rec_prob.title}",
                    "problem_id": rec_prob.id
                })
        
        return recommendations
"""

content = content.replace("    def analyze_user(self, db: Session, user_id: int, trigger: str, auto_refresh: bool = True) -> dict[str, object]:", methods_to_add + "\n    def analyze_user(self, db: Session, user_id: int, trigger: str, auto_refresh: bool = True) -> dict[str, object]:")

analyze_body_search = """        return {
            "trigger": trigger,
            "topic_strength": topic_strength,
            "weak_topics": weak_topics,
            "readiness": readiness,
            "roadmap_refreshed": roadmap_refreshed,
            "refresh_error": refresh_error,
        }"""

analyze_body_replace = """        patterns = self.detect_learning_patterns(db, user_id)
        recommendations = self.generate_smart_recommendations(db, weak_topics, companies)

        return {
            "trigger": trigger,
            "topic_strength": topic_strength,
            "weak_topics": weak_topics,
            "readiness": readiness,
            "roadmap_refreshed": roadmap_refreshed,
            "refresh_error": refresh_error,
            "learning_patterns": patterns,
            "recommendations": recommendations,
        }"""

content = content.replace(analyze_body_search, analyze_body_replace)

with open('backend/app/services/analysis_engine.py', 'w') as f:
    f.write(content)
