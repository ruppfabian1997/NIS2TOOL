from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, get_current_user
from app.services.domain_loader import load_domains

router = APIRouter()
DOMAINS_DIR = Path(__file__).resolve().parents[3] / "data" / "domains"


def _find_question(domain_id: str, question_id: str):
    domains = load_domains(str(DOMAINS_DIR))
    for domain in domains:
        if domain.get("id") == domain_id:
            for q in domain.get("questions", []):
                if q.get("id") == question_id:
                    return q
    return None


def _normalize_value(question: dict, value: int) -> int:
    if question.get("type") == "boolean":
        if value not in [0, 1, 4]:
            raise HTTPException(status_code=400, detail="Boolean questions accept 0/1/4")
        return 4 if value in [1, 4] else 0
    if not 0 <= value <= 4:
        raise HTTPException(status_code=400, detail="Scale questions require value 0-4")
    return value


@router.post("/answers", response_model=schemas.AnswerResponse)
def upsert_answer(
    payload: schemas.AnswerCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    question = _find_question(payload.domain_id, payload.question_id)
    if not question:
        raise HTTPException(status_code=404, detail="Question not found")

    normalized_value = _normalize_value(question, payload.value)

    existing = (
        db.query(models.AssessmentAnswer)
        .filter(
            models.AssessmentAnswer.company_id == current_user.id,
            models.AssessmentAnswer.question_id == payload.question_id,
        )
        .first()
    )
    if existing:
        existing.value = normalized_value
        db.add(existing)
        db.commit()
        db.refresh(existing)
        return existing

    answer = models.AssessmentAnswer(
        company_id=current_user.id,
        domain_id=payload.domain_id,
        question_id=payload.question_id,
        value=normalized_value,
    )
    db.add(answer)
    db.commit()
    db.refresh(answer)
    return answer


@router.get("/answers", response_model=List[schemas.AnswerResponse])
def list_answers(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.AssessmentAnswer)
        .filter(models.AssessmentAnswer.company_id == current_user.id)
        .all()
    )
