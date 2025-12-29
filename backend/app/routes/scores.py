from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, get_current_user
from app.services.domain_loader import load_domains
from app.services.score import compute_domain_scores, compute_overall_score

router = APIRouter()
DOMAINS_DIR = Path(__file__).resolve().parents[3] / "data" / "domains"


@router.get("/domain", response_model=List[schemas.DomainScore])
def domain_scores(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    domains = load_domains(str(DOMAINS_DIR))
    scores = compute_domain_scores(db, domains, company_id=current_user.id)
    return [schemas.DomainScore(**item) for item in scores]


@router.get("/overall", response_model=schemas.OverallScore)
def overall_score(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    domains = load_domains(str(DOMAINS_DIR))
    scores = compute_domain_scores(db, domains, company_id=current_user.id)
    overall = compute_overall_score(scores)
    return schemas.OverallScore(score_percent=overall)
