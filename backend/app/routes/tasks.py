from pathlib import Path
from typing import List

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app import models, schemas
from app.deps import get_db, get_current_user
from app.services.domain_loader import load_domains

router = APIRouter()
DOMAINS_DIR = Path(__file__).resolve().parents[3] / "data" / "domains"


@router.post("/generate", response_model=List[schemas.TaskResponse])
def generate_tasks(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    domains = load_domains(str(DOMAINS_DIR))
    created = []
    for domain in domains:
        domain_id = domain.get("id")
        for measure in domain.get("measures", []):
            existing = (
                db.query(models.Task)
                .filter(
                    models.Task.company_id == current_user.id,
                    models.Task.measure_id == measure.get("id"),
                )
                .first()
            )
            if existing:
                continue
            task = models.Task(
                company_id=current_user.id,
                domain_id=domain_id,
                measure_id=measure.get("id"),
                title=measure.get("title"),
                priority=measure.get("priority", "medium"),
                status="backlog",
            )
            db.add(task)
            created.append(task)
    db.commit()
    for task in created:
        db.refresh(task)
    return created


@router.get("/", response_model=List[schemas.TaskResponse])
def list_tasks(
    db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)
):
    return (
        db.query(models.Task)
        .filter(models.Task.company_id == current_user.id)
        .order_by(models.Task.status, models.Task.priority)
        .all()
    )


@router.patch("/{task_id}", response_model=schemas.TaskResponse)
def update_task(
    task_id: int,
    payload: schemas.TaskUpdate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    task = (
        db.query(models.Task)
        .filter(models.Task.company_id == current_user.id, models.Task.id == task_id)
        .first()
    )
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")

    if payload.priority:
        task.priority = payload.priority
    if payload.status:
        task.status = payload.status

    db.add(task)
    db.commit()
    db.refresh(task)
    return task
