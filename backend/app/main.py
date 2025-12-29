import os
from pathlib import Path
from typing import List

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app import models
from app.database import engine
from app.routes import auth, domains, assessment, scores, tasks
from app.services.domain_loader import load_domains

DOMAINS_DIR = Path(__file__).resolve().parents[2] / "data" / "domains"
DOMAINS_CACHE: List[dict] = load_domains(str(DOMAINS_DIR)) if DOMAINS_DIR.is_dir() else []

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="NIS2 Compliance MVP")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    app.include_router(auth.router, prefix="/auth", tags=["auth"])
    app.include_router(domains.router, prefix="/domains", tags=["domains"])
    app.include_router(assessment.router, prefix="/assessment", tags=["assessment"])
    app.include_router(scores.router, prefix="/scores", tags=["scores"])
    app.include_router(tasks.router, prefix="/tasks", tags=["tasks"])
    tags=["tasks"],
    dependencies=[Depends(get_db), Depends(get_current_user)],
)


@app.get("/health")
async def health():
    return {"status": "ok"}
