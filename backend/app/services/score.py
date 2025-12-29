from typing import Dict, List

from sqlalchemy.orm import Session

from app import models


def compute_domain_scores(db: Session, domains: List[Dict], company_id: int) -> List[Dict[str, float]]:
    scores = []
    for domain in domains:
        domain_id = domain["id"]
        questions = domain.get("questions", [])
        max_score = len(questions) * 4 if questions else 1
        answers = (
            db.query(models.AssessmentAnswer)
            .filter(
                models.AssessmentAnswer.domain_id == domain_id,
                models.AssessmentAnswer.company_id == company_id,
            )
            .all()
        )
        total = sum(ans.value for ans in answers)
        score_percent = (total / max_score) * 100 if max_score > 0 else 0
        scores.append({"domain_id": domain_id, "score_percent": score_percent})
    return scores


def compute_overall_score(domain_scores: List[Dict[str, float]]) -> float:
    if not domain_scores:
        return 0.0
    return sum(item["score_percent"] for item in domain_scores) / len(domain_scores)
